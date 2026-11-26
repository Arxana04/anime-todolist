/** Lazily initialize on responsive/preference changes, including mobile → desktop. */
export async function mountHero(host, track) {
  const media = matchMedia('(min-width:740px) and (prefers-reduced-motion:no-preference)');
  let alive = true, cleanup = null, initializing = false, generation = 0;
  async function reconcile() {
    const wanted = alive && media.matches && track.dataset.motion === 'enabled';
    if (!wanted) { generation++; cleanup?.(); cleanup=null; return; }
    if (cleanup || initializing) return;
    initializing=true;
    const version=++generation;
    const fn=await mountWebGLHero(host,track);
    initializing=false;
    if(!alive || version!==generation) {fn(); if(alive)reconcile();} else cleanup=fn;
  }
  media.addEventListener('change',reconcile);
  track.addEventListener('journeychange',reconcile);
  reconcile();
  return () => {alive=false;generation++;media.removeEventListener('change',reconcile);track.removeEventListener('journeychange',reconcile);cleanup?.();};
}

/** Subtle real-time depth layered over the supplied film. No canvas UI. */
async function mountWebGLHero(host, track) {
  if (!host || !track) return () => {};
  let alive = true, renderer, raf = 0, ro, io;
  let visible = true, enabled = track.dataset.motion === "enabled";
  let progress = 0, px = 0, py = 0, last = 0, time = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 739px)');
  // These modes never download the Three.js chunk.
  if (reduced.matches || small.matches) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const disposals = [];
  function dispose() {
    alive = false; controller.abort(); cancelAnimationFrame(raf);
    ro?.disconnect(); io?.disconnect();
    disposals.forEach(resource => resource.dispose());
    renderer?.dispose(); host.classList.remove('webgl-ready');
  }
  try {
    const THREE = await import('three');
    if (!host.isConnected) return dispose;
    renderer = new THREE.WebGLRenderer({ canvas:host.querySelector('canvas'), alpha:true, antialias:false, powerPreference:'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48,1,.1,80);
    camera.position.z = 10;
    const group = new THREE.Group(); scene.add(group);
    const count = 100;
    const positions = new Float32Array(count*3), colors = new Float32Array(count*3);
    for (let i=0;i<count;i++) {
      // Deterministic scatter keeps the composition stable on return navigation.
      const n = Math.sin(i*127.1+311.7)*43758.5453;
      const seed = n-Math.floor(n);
      positions.set([(seed-.5)*28, (Math.sin(i*4.13)) * 8, (Math.cos(i*1.71))*5],i*3);
      const color = new THREE.Color(i%4 === 0 ? '#63c7d2' : i%3 === 0 ? '#f8b49b' : '#e2d9c0');
      colors.set([color.r,color.g,color.b],i*3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors,3));
    const material = new THREE.ShaderMaterial({
      transparent:true, depthWrite:false, vertexColors:true, blending:THREE.AdditiveBlending,
      uniforms:{ uTime:{value:0}, uProgress:{value:0}, uPixelRatio:{value:Math.min(devicePixelRatio || 1,1.5)} },
      vertexShader:`varying vec3 vColor; uniform float uTime; uniform float uProgress; uniform float uPixelRatio;
        void main(){ vColor=color; vec3 p=position; p.y += sin(uTime*.15+p.x)*.18; p.z+=uProgress*2.; vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=clamp((16.+sin(p.x)*7.)/-mv.z,1.,4.)*uPixelRatio; }`,
      fragmentShader:`varying vec3 vColor; void main(){float r=length(gl_PointCoord-.5); float a=smoothstep(.5,.08,r)*.58; gl_FragColor=vec4(vColor,a);}`,
    });
    const motes = new THREE.Points(geometry,material); group.add(motes);
    disposals.push(geometry,material);
    const curves = [];
    for (let i=0;i<3;i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-12,-4+i, -4), new THREE.Vector3(-3,1+i*.6,-6),
        new THREE.Vector3(5,-1+i*.8,-3), new THREE.Vector3(12,5+i,-6),
      ]);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
      const lineMat = new THREE.LineBasicMaterial({ color:i===0 ? '#66bdc7' : '#e4a08a', transparent:true, opacity:.04, blending:THREE.AdditiveBlending });
      const line = new THREE.Line(lineGeo,lineMat); group.add(line); curves.push(line);
      disposals.push(lineGeo,lineMat);
    }
    host.classList.add('webgl-ready');
    function render(now) {
      raf = 0;
      if (!alive || !enabled || !visible || document.hidden || reduced.matches || small.matches) return;
      if (now-last >= 32) {
        time += Math.min((now-last)/1000,.05); last=now;
        group.rotation.y += (px*.035+progress*.08-group.rotation.y)*.08;
        group.rotation.x += (-py*.025-group.rotation.x)*.08;
        camera.position.z = 10-progress*1.4;
        material.uniforms.uTime.value=time; material.uniforms.uProgress.value=progress;
        curves.forEach((line,i) => { line.material.opacity=.025+progress*.055; line.rotation.z=Math.sin(time*.06+i)*.035; });
        renderer.render(scene,camera);
      }
      raf=requestAnimationFrame(render);
    }
    function start() { if (!raf && alive && enabled && visible && !document.hidden) {last=performance.now(); raf=requestAnimationFrame(render);} }
    function resize() {
      const rect=host.getBoundingClientRect();
      renderer.setSize(rect.width,rect.height,false);
      camera.aspect=rect.width/Math.max(1,rect.height); camera.updateProjectionMatrix(); start();
    }
    function change(event) { progress=event.detail.progress; enabled=event.detail.enabled; if(!enabled) {cancelAnimationFrame(raf); raf=0; renderer.clear();} else start(); }
    track.addEventListener('journeychange',change,{signal});
    track.addEventListener('pointermove',event => {px=(event.clientX/innerWidth-.5)*2; py=(event.clientY/innerHeight-.5)*2; start();},{signal,passive:true});
    document.addEventListener('visibilitychange',() => {if(document.hidden){cancelAnimationFrame(raf);raf=0;}else start();},{signal});
    ro=new ResizeObserver(resize); ro.observe(host);
    io=new IntersectionObserver(([entry]) => {visible=entry.isIntersecting;if(visible)start();else{cancelAnimationFrame(raf);raf=0;} }); io.observe(track);
    resize();
    return dispose;
  } catch (error) {
    dispose();
    console.info('The cinematic artwork is available without WebGL.',error.message);
    return () => {};
  }
}

export async function mountScrollAnimations() {
  const root=document.querySelector('.landing');
  if (!root) return () => {};
  const [{gsap},{ScrollTrigger}] = await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
  if (!root.isConnected) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',() => {
    const ctx=gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach(el => {
        gsap.from(el,{y:30,opacity:0,duration:.85,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 93%',once:true}});
      });
      // Each word fills in reading order as the visitor scrolls; scrolling
      // backward restores the earlier state. No pinning or wheel interception.
      gsap.utils.toArray('[data-scroll-highlight]').forEach(statement => {
        const words = statement.querySelectorAll('.highlight-word');
        gsap.set(words, {'--word-fill':'0%'});
        const reveal = gsap.timeline({scrollTrigger:{
          trigger:statement, start:'top 83%', end:'bottom 40%',
          scrub:.35, invalidateOnRefresh:true,
        }});
        reveal.fromTo(words, {'--word-fill':'0%'}, {
          '--word-fill':'100%', duration:1, stagger:.38, ease:'none',
        });
        const crest = statement.closest('.landing-intro')?.querySelector('.intro-crest>svg');
        if (crest) gsap.fromTo(crest,{y:12,rotate:-7},{y:-6,rotate:3,ease:'none',scrollTrigger:{trigger:statement,start:'top 83%',end:'bottom 40%',scrub:.6}});
      });
      if(innerWidth >= 740) {
        gsap.fromTo('.doorway-rail .world-doorway',{y:i=>i%2?32:0},{y:i=>i%2?-18:14,ease:'none',scrollTrigger:{trigger:'.doorway-rail',start:'top bottom',end:'bottom top',scrub:1}});
        gsap.fromTo('.workspace-perspective',{rotateX:5,y:35},{rotateX:0,y:0,ease:'none',scrollTrigger:{trigger:'.workspace-perspective',start:'top 95%',end:'top 25%',scrub:1}});
        gsap.fromTo('.landing-finale>img',{scale:1.36,y:-25},{scale:1.24,y:15,ease:'none',scrollTrigger:{trigger:'.landing-finale',start:'top bottom',end:'bottom bottom',scrub:1}});
      }
    },root);
    return () => ctx.revert();
  });
  const refresh=() => ScrollTrigger.refresh();
  document.fonts.ready.then(() => {if(root.isConnected)refresh();});
  return () => media.revert();
}
export function observeVideos(root = document) {
  const videos = [...root.querySelectorAll("video[data-ambient]")];
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const video = e.target;
        if (
          e.isIntersecting &&
          !document.hidden &&
          video.dataset.paused !== "true"
        ) {
          video.play().catch(() => {});
        } else video.pause();
      }
    },
    { threshold: 0.05 },
  );
  videos.forEach((v) => io.observe(v));
  const visibility = () => {
    for (const v of videos) {
      if (document.hidden) v.pause();
      else if (
        v.getBoundingClientRect().top < innerHeight &&
        v.dataset.paused !== "true"
      )
        v.play().catch(() => {});
    }
  };
  document.addEventListener("visibilitychange", visibility);
  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    videos.forEach((v) => v.pause());
  };
}
