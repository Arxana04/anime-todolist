/** Two-image poster slideshow. Artwork stays uncropped and the next title is
 * decoded before it is shown; no video, 3D engine, or full-catalog preloading. */
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function orderedWorlds(initialWorld, catalog) {
  const curated = ['one-piece','frieren','jujutsu-kaisen','solo-leveling','dandadan','demon-slayer','naruto-shippuden','apothecary-diaries','chainsaw-man','cowboy-bebop','bocchi-the-rock','attack-on-titan'];
  const byId = new Map(catalog.filter(world => world?.poster).map(world => [world.id, world]));
  const worlds = [], seen = new Set();
  const append = world => {
    if (world?.poster && !seen.has(world.id || world.poster)) {
      worlds.push(world);
      seen.add(world.id || world.poster);
    }
  };
  append(initialWorld);
  curated.forEach(id => append(byId.get(id)));
  catalog.forEach(append);
  return worlds;
}

export function posterSlideshowMarkup(initialWorld, catalog) {
  const first = orderedWorlds(initialWorld, catalog)[0];
  if (!first) return '';
  return `<div class="poster-slideshow" role="region" aria-roledescription="slideshow" aria-label="Anime world artwork" data-world="${escapeHtml(first.id)}">
    <div class="poster-slide is-active" aria-hidden="false"><img src="${escapeHtml(first.poster)}" alt="${escapeHtml(first.title)} complete key visual" decoding="async" fetchpriority="high"/></div>
    <div class="poster-slide" aria-hidden="true"><img alt="" decoding="async"/></div>
    <div class="poster-slideshow-shade" aria-hidden="true"></div>
    <button type="button" class="poster-slideshow-motion" data-action="world-motion" aria-pressed="false" aria-label="Pause poster slideshow"><span class="poster-motion-icon" aria-hidden="true">Ⅱ</span><span class="poster-motion-label">Pause</span></button>
  </div>`;
}

export function mountPosterSlideshow(host, initialWorld, catalog, {motion = true, onSlide, onMotionChange} = {}) {
  if (!host) return () => {};
  const worlds = orderedWorlds(initialWorld, catalog);
  const slots = [...host.querySelectorAll('.poster-slide')];
  if (!worlds.length || slots.length !== 2) return () => {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const {signal} = controller;
  const button = host.querySelector('.poster-slideshow-motion');
  const interval = 4000, transition = 1100;
  let alive = true, active = 0, index = 0, nextIndex = 1 % worlds.length;
  let timer = 0, fadeTimer = 0, preparing = false, prepared = false, fading = false;
  const rect = host.getBoundingClientRect();
  let visible = rect.bottom > 0 && rect.top < innerHeight && rect.width > 0;
  const canAnimate = () => alive && motion && !reduced.matches && visible && !document.hidden && worlds.length > 1;

  function setArtwork(slot, world) {
    const img = slot.querySelector('img');
    img.alt = `${world.title} complete key visual`;
    // A blurred duplicate is purely a backdrop; this same poster is reused
    // from the image cache. The sharp foreground always uses contain.
    slot.style.setProperty('--poster-image', `url(${JSON.stringify(world.poster)})`);
    if (img.getAttribute('src') !== world.poster) img.src = world.poster;
    return img;
  }
  function notify(world) {
    host.dataset.world = world.id || '';
    host.setAttribute('aria-label', `Anime world artwork · ${world.title}`);
    try { onSlide?.(world); } catch (error) { console.info('Poster caption update unavailable.', error.message); }
  }
  function updateControl() {
    const paused = !motion || reduced.matches;
    host.dataset.motion = canAnimate() ? 'playing' : 'paused';
    if (!button) return;
    button.disabled = reduced.matches || worlds.length < 2;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', reduced.matches ? 'Poster slideshow paused for reduced motion' : paused ? 'Resume poster slideshow' : 'Pause poster slideshow');
    button.querySelector('.poster-motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    button.querySelector('.poster-motion-label').textContent = reduced.matches ? 'Still artwork' : paused ? 'Resume' : 'Pause';
  }
  async function prepare() {
    if (!canAnimate() || preparing || prepared || fading) return;
    preparing = true;
    const img = setArtwork(slots[1-active], worlds[nextIndex]);
    try {
      await img.decode();
      if (alive && img.naturalWidth > 0) prepared = true;
    } catch {
      // Skip one failed asset on the next interval, keeping the current poster.
      if (alive) nextIndex = (nextIndex + 1) % worlds.length;
    } finally { preparing = false; }
  }
  function schedule() {
    clearTimeout(timer);
    if (!canAnimate()) return;
    prepare();
    timer = setTimeout(showNext, interval);
  }
  async function showNext() {
    timer = 0;
    if (!canAnimate()) return;
    if (!prepared) await prepare();
    if (!canAnimate()) return;
    if (!prepared) { schedule(); return; }
    const outgoing = slots[active], incoming = slots[1-active];
    fading = true;
    // The outgoing image remains fully opaque behind the incoming image.
    // This avoids the dark dip of fading both layers toward transparent.
    incoming.classList.add('is-entering');
    fadeTimer = setTimeout(() => {
      fadeTimer = 0;
      if (!alive) return;
      outgoing.classList.remove('is-active');
      outgoing.setAttribute('aria-hidden','true');
      incoming.classList.add('is-active');
      incoming.classList.remove('is-entering');
      incoming.setAttribute('aria-hidden','false');
      active = 1-active;
      index = nextIndex;
      nextIndex = (index+1) % worlds.length;
      prepared = false; fading = false;
      notify(worlds[index]);
      // The next decode is bounded to this newly inactive slot. Start another
      // transition four seconds after the preceding one started.
      if (canAnimate()) { prepare(); timer = setTimeout(showNext, interval-transition); }
    }, transition);
  }
  function reconcile() {
    updateControl();
    if (canAnimate()) { if (!timer && !fading) schedule(); }
    else {
      clearTimeout(timer); timer = 0;
      if (fading) {
        clearTimeout(fadeTimer); fadeTimer = 0;
        slots[1-active].classList.remove('is-entering');
        fading = false;
      }
    }
  }
  button?.addEventListener('click', event => {
    event.stopPropagation();
    if (reduced.matches) return;
    motion = !motion;
    reconcile();
    onMotionChange?.(motion);
  }, {signal});
  setArtwork(slots[active], worlds[index]);
  notify(worlds[index]);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; reconcile(); }, {threshold:.05});
  observer.observe(host);
  document.addEventListener('visibilitychange', reconcile, {signal});
  reduced.addEventListener('change', reconcile, {signal});
  reconcile();
  return () => {
    alive = false;
    clearTimeout(timer); clearTimeout(fadeTimer);
    controller.abort(); observer.disconnect();
    slots.forEach(slot => { slot.classList.remove('is-entering'); slot.style.removeProperty('--poster-image'); });
  };
}
