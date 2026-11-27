import { worldScene } from './world-scenes.mjs';
import { animeEmblem } from './anime-symbols.mjs';
import { WORLD_ART_DIRECTION } from './world-art-direction.mjs';
import foregrounds from './data/world-foregrounds.json';
const html = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function artwork(world) {
  const foreground=foregrounds[world.id];
  const src=foreground?.src || world.poster;
  return `<img class="world-stage-keyart ${foreground ? 'world-stage-transparent-art' : ''}" src="${html(src)}" alt="${html(world.title)} ${foreground ? 'foreground artwork' : 'complete key visual'}" decoding="async"/>`;
}

/** Real anime artwork supplies the world. WebGL only supplies its atmosphere. */
export function worldStageMarkup(world, {variant='banner',motion=true}={}) {
  const preset=worldScene(world.id),onePiece=world.id==='one-piece'&&variant==='banner';
  const toggle=`<button type="button" class="world-stage-toggle" data-action="world-motion" aria-label="${motion?'Pause':'Enable'} world animation" aria-pressed="${!motion}"><svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${motion?'<path d="M7 5v10m6-10v10"/>':'<path d="m7 4 8 6-8 6Z"/>'}</svg><span>${motion?'Motion on':'Motion off'}</span></button>`;
  if(onePiece)return `<section class="world-stage world-stage-banner world-stage-voyage voyage-scene" data-world-id="one-piece" data-variant="banner" data-motion="${motion?'on':'off'}" aria-label="One Piece Thousand Sunny sailing scene" style="--stage-accent:${world.color};--stage-secondary:${world.secondary}"><div class="voyage-stars" aria-hidden="true"></div><canvas class="world-stage-canvas" aria-hidden="true"></canvas><div class="voyage-copy"><span class="eyebrow">YOUR NEXT ADVENTURE</span><strong>Small steps.<br>Wide horizons.</strong><span>A little progress, every day.</span></div><div class="voyage-moon" aria-hidden="true"></div><img class="voyage-ship" src="/assets/sunny_go_ship.png" alt="Thousand Sunny sailing across the horizon"/><div class="voyage-wave wave-back"></div><div class="voyage-wave wave-front"></div>${toggle}</section>`;
  return `<section class="world-stage world-stage-${variant} world-stage-illustrated" data-world-id="${html(world.id)}" data-variant="${variant}" data-motion="${motion?'on':'off'}" style="--stage-accent:${world.color};--stage-secondary:${world.secondary}" aria-label="${html(world.title)} illustrated world">
    <img class="world-stage-backdrop" src="${html(variant==='auth'?world.poster:world.scene)}" alt="" decoding="async"/>
    ${variant==='banner'&&motion&&world.loop?`<video class="world-stage-ambient" src="${html(world.loop)}" poster="${html(world.scene)}" muted loop playsinline preload="metadata" aria-hidden="true"></video>`:''}
    <div class="world-stage-wash"></div><canvas class="world-stage-canvas" aria-hidden="true"></canvas>
    ${variant==='banner'?`<div class="world-stage-visual ${world.id === "mf-ghost" ? "world-stage-racer" : foregrounds[world.id] ? "world-stage-character" : "world-stage-artwork"}">${artwork(world)}</div><div class="world-stage-copy"><span>YOUR ${html(world.title.toUpperCase())} CHAPTER</span><h2>${html(preset.name)}</h2><p>${html(preset.subtitle)}</p></div><span class="world-stage-caption">${animeEmblem(world.id)}<span>${html(world.native||world.title)}</span></span>`:''}
    ${world.id === "mf-ghost" ? '<div class="world-stage-road" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' : ""}${toggle}</section>`;
}

/** One renderer for the visible world's ambient weather; no geometric models. */
export function mountWorldStage(host,world,{motion=true}={}) {
  if(!host)return()=>{};
  let alive=true,renderer,geometry,material,raf=0,visible=false,last=0,elapsed=0,ro,io;
  let enabled=motion,initializing=false,px=0,py=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),events=new AbortController();
  const video=host.querySelector('video');
  const stop=()=>{cancelAnimationFrame(raf);raf=0;last=0;video?.pause();};
  function dispose(){if(!alive)return;alive=false;events.abort();stop();ro?.disconnect();io?.disconnect();geometry?.dispose();material?.dispose();renderer?.dispose();host.classList.remove('scene-ready');}
  async function initialize(){
    if(initializing||renderer||!alive)return;
    if(!enabled||reduced.matches||host.dataset.variant==='auth'){host.dataset.renderer='artwork';return;}
    initializing=true;
    try{
      const T=await import('three');if(!alive||!host.isConnected)return;
      renderer=new T.WebGLRenderer({canvas:host.querySelector('canvas'),alpha:true,antialias:false,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
      const scene=new T.Scene(),camera=new T.PerspectiveCamera(40,1,.1,50);camera.position.z=9;
      const preset=worldScene(world.id),kinds=['stars','petals','snow','embers','code','sea','dust','void','bubbles','grid','leaves','ink','water','energy','debris','notes','speed','wind','spiral'];
      const style=kinds.indexOf(preset.particles),seed=[...world.id].reduce((s,c)=>s+c.charCodeAt(0),0),count=90;
      const positions=new Float32Array(count*3),sizes=new Float32Array(count);
      for(let i=0;i<count;i++){const n=Math.sin(i*127.1+seed)*43758.5453,v=n-Math.floor(n);positions.set([(v-.5)*24,Math.sin(i*3.41+seed)*4,Math.cos(i*2.7)*3],i*3);sizes[i]=.5+v;}
      geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('aSize',new T.BufferAttribute(sizes,1));
      const weatherColor=style===2?'#dce8f2':style===3?'#ed9b50':world.secondary;
      material=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uTime:{value:0},uStyle:{value:style},uColor:{value:new T.Color(weatherColor).lerp(new T.Color('#efdfc9'),.25)},uRatio:{value:Math.min(devicePixelRatio||1,1.5)}},vertexShader:`attribute float aSize;uniform float uTime,uStyle,uRatio;varying float vStyle;void main(){vec3 p=position;vStyle=uStyle;
        if(uStyle==2.||uStyle==1.||uStyle==10.){p.y=mod(p.y-uTime*.3+4.,8.)-4.;p.x+=sin(uTime*.3+p.y)*.35;}
        else if(uStyle==3.||uStyle==4.||uStyle==8.||uStyle==13.){p.y=mod(p.y+uTime*.4+4.,8.)-4.;}
        else if(uStyle==16.||uStyle==17.){p.x=mod(p.x+uTime*2.+12.,24.)-12.;}
        else{p.y+=sin(uTime*.35+p.x)*.2;}
        vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((uStyle==1.||uStyle==2.||uStyle==10.?40.:24.)*aSize/-mv.z,1.,7.)*uRatio;}`,fragmentShader:`uniform vec3 uColor;varying float vStyle;void main(){vec2 p=gl_PointCoord-.5;float a=smoothstep(.5,.05,length(p));if(vStyle==4.||vStyle==9.)a=step(abs(p.x),.12)*step(abs(p.y),.4);if(vStyle==16.||vStyle==17.)a=step(abs(p.y),.055)*smoothstep(.5,0.,abs(p.x));if(vStyle==1.||vStyle==10.)a=smoothstep(.5,.1,length(p*vec2(1.,1.6)));gl_FragColor=vec4(uColor,a*.65);}`});
      const particles=new T.Points(geometry,material);scene.add(particles);
      function draw(now){raf=0;if(!alive||!visible||!enabled||document.hidden||reduced.matches)return;if(!last)last=now;if(now-last>=32){elapsed+=Math.min((now-last)/1000,.06);last=now;material.uniforms.uTime.value=elapsed*preset.speed;particles.position.x+=(px*.15-particles.position.x)*.04;particles.position.y+=(-py*.1-particles.position.y)*.04;renderer.render(scene,camera);host.classList.add('scene-ready');host.dataset.renderer='artwork-webgl';host.dataset.scene=world.id;host.dataset.frame=String(Math.round(elapsed*30));}raf=requestAnimationFrame(draw);}
      function start(){if(alive&&visible&&enabled&&!document.hidden&&!reduced.matches&&!raf){raf=requestAnimationFrame(draw);video?.play().catch(()=>{});}}
      function resize(){if(!alive)return;const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();start();}
      host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;},{passive:true,signal:events.signal});
      reduced.addEventListener('change',()=>{enabled=motion&&!reduced.matches;if(enabled)start();else{stop();host.classList.remove('scene-ready');host.dataset.renderer='artwork';}},{signal:events.signal});
      document.addEventListener('visibilitychange',()=>document.hidden?stop():start(),{signal:events.signal});
      ro=new ResizeObserver(resize);ro.observe(host);io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)start();else stop();});io.observe(host);resize();
    }catch(error){host.dataset.renderer='artwork';dispose();console.info('Anime artwork remains available.',error.message);}
    finally{initializing=false;}
  }
  reduced.addEventListener('change',()=>{if(!reduced.matches&&motion)initialize();},{signal:events.signal});
  initialize();return dispose;
}
