/** The supplied film, driven by native scroll. Compressed assets and decoded
 * bitmaps have separate budgets: ten 720p bitmaps, three concurrent decodes. */
export function mountFrameSequence(host, config) {
  if (!host) return () => {};
  const track = host.closest('.journey-track');
  const canvas = host.querySelector('canvas');
  const context = canvas.getContext('2d', { alpha: false });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 739px)');
  const controller = new AbortController();
  const { signal } = controller;
  const bitmaps = new Map(), blobs = new Map(), pending = new Set();
  const motionButton = track.querySelector('.journey-motion');
  const opening = track.querySelector('.journey-opening');
  const destination = track.querySelector('.journey-destination');
  const chapter = track.querySelector('.journey-chapter-name');
  const percent = track.querySelector('.journey-percent');
  let alive = true, active = false, visible = true, paused = false;
  let target = 0, current = -1, inflight = 0, raf = 0, idle = 0;
  let prefetching = false, blobBytes = 0;
  const queue = new Set();
  try { paused = sessionStorage.getItem('anime_journey_paused') === 'true'; } catch {}
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const path = i => `${config.prefix}${String(i + 1).padStart(4, '0')}.${config.extension || 'webp'}`;
  const remember = (i, blob) => {
    if (blobs.has(i)) return;
    blobs.set(i, blob);
    blobBytes += blob.size;
    // Bound compressed storage as well as decoded GPU/CPU image memory.
    while (blobBytes > 20 * 1024 * 1024 && blobs.size > 1) {
      const key = blobs.keys().next().value;
      blobBytes -= blobs.get(key).size;
      blobs.delete(key);
    }
  };
  async function getBlob(i) {
    if (blobs.has(i)) return blobs.get(i);
    const response = await fetch(path(i), { signal, cache: 'force-cache' });
    if (!response.ok) throw new Error('Journey frame unavailable');
    const blob = await response.blob();
    if (alive) remember(i, blob);
    return blob;
  }
  function paint() {
    raf = 0;
    if (!alive || !active || !visible || document.hidden || !context) return;
    const chosen = bitmaps.has(target) ? target : [...bitmaps.keys()].sort((a,b) => Math.abs(a-target)-Math.abs(b-target))[0];
    if (chosen === undefined || chosen === current) return;
    const bitmap = bitmaps.get(chosen);
    const scale = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
    context.drawImage(bitmap, (canvas.width-bitmap.width*scale)/2, (canvas.height-bitmap.height*scale)/2, bitmap.width*scale, bitmap.height*scale);
    current = chosen;
    host.dataset.frame = String(chosen);
    host.dataset.decodedFrames = String(bitmaps.size);
    host.classList.add('has-frames');
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(paint); }
  function drain() {
    if (!active || !alive || !visible || document.hidden) return;
    while (inflight < 3 && queue.size) {
      const i = [...queue].sort((a,b) => Math.abs(a-target)-Math.abs(b-target))[0];
      queue.delete(i);
      if (bitmaps.has(i) || pending.has(i)) continue;
      inflight++; pending.add(i);
      (async () => {
        try {
          const blob = await getBlob(i);
          if (!active || !alive) return;
          const bitmap = await createImageBitmap(blob);
          if (!alive || !active) { bitmap.close(); return; }
          bitmaps.set(i, bitmap);
          while (bitmaps.size > 10) {
            const victim = [...bitmaps.keys()].filter(k => k !== target).sort((a,b) => Math.abs(b-target)-Math.abs(a-target))[0];
            bitmaps.get(victim).close(); bitmaps.delete(victim);
          }
          schedule();
        } catch { /* The poster remains usable if the sequence cannot load. */ }
        finally { inflight--; pending.delete(i); drain(); }
      })();
    }
  }
  function update() {
    if (!alive) return;
    const rect = track.getBoundingClientRect();
    const progress = active ? clamp(-rect.top / Math.max(1, track.offsetHeight-innerHeight)) : 0;
    target = Math.round(progress * (config.count-1));
    track.style.setProperty('--journey-progress', progress);
    const openingOpacity = 1-clamp((progress-.30)/.17);
    const destinationOpacity = clamp((progress-.63)/.15);
    opening.style.opacity = String(openingOpacity);
    opening.style.transform = `translateY(${-45 * (1-openingOpacity)}px)`;
    opening.inert = openingOpacity < .15;
    opening.setAttribute('aria-hidden', String(openingOpacity < .15));
    destination.style.opacity = String(destinationOpacity);
    destination.style.transform = `translateY(${30*(1-destinationOpacity)}px)`;
    destination.inert = destinationOpacity < .85;
    destination.setAttribute('aria-hidden', String(destinationOpacity < .85));
    chapter.textContent = progress < .3 ? '01 — THE EVERYDAY' : progress < .63 ? '02 — THE CROSSING' : '03 — YOUR SANCTUARY';
    percent.textContent = String(Math.round(progress*100)).padStart(2,'0');
    if (active && visible && !document.hidden) {
      queue.clear();
      for (const offset of [0,1,-1,2,-2,3]) {
        const i = target+offset;
        if (i >= 0 && i < config.count && !bitmaps.has(i) && !pending.has(i)) queue.add(i);
      }
      drain(); schedule();
    }
    track.dispatchEvent(new CustomEvent('journeychange', { detail: { progress, enabled: active } }));
  }
  function resize() {
    const rect = host.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 1.5, 1920 / Math.max(1,rect.width));
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    current = -1;
    update();
  }
  function setMode() {
    active = !!(config.ready && context && !paused && !reduced.matches && !mobile.matches);
    track.classList.toggle('is-static', !active);
    track.dataset.motion = active ? 'enabled' : 'static';
    motionButton.disabled = reduced.matches || mobile.matches;
    motionButton.setAttribute('aria-pressed', String(paused || reduced.matches));
    motionButton.querySelector('.motion-icon').textContent = active ? 'Ⅱ' : '▷';
    motionButton.querySelector('.motion-label').textContent = reduced.matches ? 'Reduced motion' : mobile.matches ? 'Still scene' : paused ? 'Resume motion' : 'Pause motion';
    if (!active) {
      bitmaps.forEach(b => b.close()); bitmaps.clear(); queue.clear();
      host.classList.remove('has-frames'); current = -1;
    }
    resize();
    if (active && !navigator.connection?.saveData && !/2g/.test(navigator.connection?.effectiveType || '')) {
      if (!idle) idle = window.requestIdleCallback ? requestIdleCallback(prefetch, { timeout:2500 }) : setTimeout(prefetch, 1800);
    }
  }
  async function prefetch() {
    idle = 0;
    if (prefetching || !active || !alive) return;
    prefetching = true;
    let next = 0;
    async function worker() {
      while (alive && active && visible && !document.hidden && next < config.count) {
        const i = next++;
        if (blobs.has(i) || pending.has(i)) continue;
        try { await getBlob(i); } catch { if (signal.aborted) break; }
      }
    }
    await Promise.all([worker(), worker()]);
    prefetching = false;
  }
  function toggle() {
    const wasInView = track.getBoundingClientRect().top < 0;
    paused = !paused;
    try { sessionStorage.setItem('anime_journey_paused', String(paused)); } catch {}
    setMode();
    if (wasInView) track.scrollIntoView({ behavior:'instant', block:'start' });
  }
  const ro = new ResizeObserver(resize);
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) update(); });
  ro.observe(host); io.observe(track);
  motionButton.addEventListener('click', toggle, { signal });
  window.addEventListener('scroll', update, { passive:true, signal });
  document.addEventListener('visibilitychange', update, { signal });
  reduced.addEventListener('change', setMode, { signal });
  mobile.addEventListener('change', setMode, { signal });
  setMode();
  return () => {
    alive = false; active = false; controller.abort();
    cancelAnimationFrame(raf);
    window.cancelIdleCallback?.(idle); clearTimeout(idle);
    ro.disconnect(); io.disconnect();
    bitmaps.forEach(b => b.close()); bitmaps.clear(); blobs.clear(); queue.clear();
  };
}
