import { animeEmblem } from "./anime-symbols.mjs";

/** Landing composition; every product action uses the existing app handlers. */
export function landingMarkup({ header, logo, button, icon, theme, catalog, escape, shortTitle, featuredWorld, worldGrid, moreWorlds, workspaceDemo, selected, worldQuery, worldGenre, genreOptions }) {
  const highlightLine = (text, accent = false) => `<span class="highlight-line ${accent ? 'highlight-line-accent' : ''}">${text.split(' ').map(word => `<span class="highlight-word">${word}<span class="word-fill" aria-hidden="true">${word}</span></span>`).join(' ')}</span>`;
  const picks = ["one-piece", "jujutsu-kaisen", "frieren", "solo-leveling", "dandadan"];
  return `${header()}<main id="main" class="landing" tabindex="-1">
    <section class="journey-track" aria-labelledby="journey-title">
      <div class="journey-stage">
        <div class="journey-media" style="background-image:url('/media/journey/city.webp')"><canvas class="journey-frames" aria-hidden="true"></canvas></div>
        <div class="journey-shade"></div><div id="journey-webgl" aria-hidden="true"><canvas></canvas></div>
        <div class="journey-topline"><span><i></i> A PERSONAL SPACE. ANOTHER WORLD.</span><span>EST. IN YOUR IMAGINATION <b class="topline-emblem">${animeEmblem("orbit")}</b></span></div>
        <div class="journey-opening">
          <span class="journey-kicker">FOR THE LIFE YOU’RE STILL WRITING</span>
          <h1 id="journey-title">Your next arc<br>starts <em>here.</em></h1>
          <div class="journey-intro"><p>Less noise. More you.<br>Your tasks, your focus, and the worlds you love.<br>A little escape. A lot of possibility.</p><div>${button(`Enter your world ${icon("arrow")}`, "start", "journey-button")}<a href="#worlds" data-anchor="worlds" class="journey-link">Find your inspiration <span>↗</span></a></div></div>
        </div>
        <div class="journey-destination" inert aria-hidden="true"><span class="journey-kicker">LEAVE THE NOISE BEHIND</span><h2>A different world.<br><em>A little more you.</em></h2><p>Somewhere to begin. Something to work toward.<br>Make a little room for your next chapter.</p><a href="#worlds" data-anchor="worlds" class="button journey-button">Discover your world ${icon("arrow")}</a></div>
        <div class="journey-bottom"><a href="#worlds" data-anchor="worlds" class="journey-scroll"><span class="scroll-symbol">↓</span><span>SCROLL TO ANOTHER WORLD</span></a><div class="journey-chapters" aria-hidden="true"><span class="journey-chapter-name">01 — THE EVERYDAY</span><span class="journey-meter"><i></i></span><span class="journey-percent">00</span></div><button type="button" class="journey-motion" aria-pressed="false"><span class="motion-icon">Ⅱ</span><span class="motion-label">Pause motion</span></button></div>
      </div>
    </section>

    <section class="landing-intro landing-wrap"><div class="intro-index"><span class="landing-label">WELCOME TO ANIMETODO</span><span class="intro-crest" aria-hidden="true">${animeEmblem("black-bulls")}<span>BREAK YOUR LIMITS</span></span></div><div><p class="intro-statement" data-scroll-highlight>${highlightLine("Life’s a lot.")}${highlightLine("Your space should feel")}${highlightLine("a little more like you.", true)}</p><div class="intro-bottom"><p>A personal workspace for everyday adventures.<br>Pick an anime you love. Plan a day you’ll feel good about.<br>Take it one small win at a time.</p><span class="intro-seal">YOUR WORLD.<br>YOUR PACE.<br><b>YOUR STORY.</b></span></div></div></section>

    <section id="worlds" class="world-doorways landing-wrap"><div class="landing-heading" data-reveal><div><span class="landing-label">01 / FIND YOUR INSPIRATION</span><h2>Different worlds.<br><em>Same main character.</em></h2></div><div><p>Some stories stay with you.<br>Bring yours into the everyday.</p><a href="#library" data-anchor="library" class="journey-link">Explore all ${catalog.length} worlds <span>↗</span></a></div></div>
      <div class="doorway-rail">${picks.map((id, i) => { const t = theme(id); return `<button class="world-doorway" data-action="preview" data-id="${id}" style="--door-accent:${t.color}" aria-label="Preview ${escape(t.title)}"><img src="${t.poster}" alt="${escape(t.title)} key visual" loading="lazy" width="300" height="440"/><span class="doorway-number">0${i + 1} /</span><span class="doorway-bottom"><small>${escape(t.genres[0]).toUpperCase()}</small><strong>${escape(shortTitle(t))}</strong><i>↗</i></span></button>`; }).join("")}</div>
      <div class="doorway-foot"><span>FAMILIAR WORLDS. A FRESH PERSPECTIVE.</span><span>Pick a world. Make yourself at home. <b>↗</b></span></div>
    </section>

    <section id="workspace" class="workspace-section landing-wrap"><div class="landing-heading" data-reveal><div><span class="landing-label">02 / A PLACE TO MAKE PROGRESS</span><h2>A little structure.<br><em>A whole lot of soul.</em></h2></div><p>Your daily plan, with a different kind of energy.<br>Try checking off a task. Change the scenery.<br>This is your space to play.</p></div>
      <div class="preview-topline"><span><i></i> YOUR WORKSPACE, REIMAGINED</span><div class="demo-theme-tabs" role="group" aria-label="Preview a workspace">${["one-piece", "frieren", "solo-leveling"].map(id => `<button data-action="demo-theme" data-id="${id}" class="${id === selected ? "active" : ""}" aria-pressed="${id === selected}">${escape(shortTitle(theme(id)))}</button>`).join("")}</div><span class="preview-hint">GO ON, MAKE A LITTLE PROGRESS ↙</span></div>
      <div class="workspace-perspective"><div id="demo-workspace">${workspaceDemo(theme(selected))}</div></div><div class="preview-features"><span>${icon("check")} Tasks, minus the overwhelm</span><span>${icon("clock")} Your own focus ritual</span><span>${icon("calendar")} Space for the everyday</span><span>${animeEmblem("torii")} ${catalog.length} worlds to call home</span></div>
    </section>

    <section id="how-it-works" class="ritual-section landing-wrap"><div class="ritual-title" data-reveal><span class="landing-label">03 / YOUR ORIGIN STORY</span><h2>No training arc<br><em>required.</em></h2><p>Just you, a fresh page,<br>and a little forward motion.</p>${button(`Let’s begin ${icon("arrow")}`, "start", "journey-button")}</div><div class="ritual-steps">
      <article data-reveal><span>01</span><div><h3>Find a world that feels like home.</h3><p>The Grand Line, a quiet forest, or a universe of your own. Choose your anime, colors, and atmosphere.</p></div><i>${animeEmblem("strawhat")}</i></article>
      <article data-reveal><span>02</span><div><h3>Give your day a little direction.</h3><p>Big ideas become small tasks. Add your priorities, plan your day, and make room for what matters.</p></div><i>${icon("list")}</i></article>
      <article data-reveal><span>03</span><div><h3>One thing. One small win.</h3><p>Set a focus timer. Take a breath. Show up for yourself, one little mission at a time.</p></div><i>${icon("clock")}</i></article>
    </div></section>

    <section id="library" class="worlds-section landing-wrap"><div class="landing-heading" data-reveal><div><span class="landing-label">THE WORLD LIBRARY / ${catalog.length} PLACES TO BEGIN</span><h2>Your next obsession.<br><em>Your next workspace.</em></h2></div><p>Find a familiar face.<br>Or fall into something new.</p></div>
      <div class="featured-world" id="featured-world">${featuredWorld(theme(selected))}</div>
      <div class="catalog-header"><div><h3>Where do you want to go?</h3><span class="muted">${catalog.length} anime worlds. A thousand little possibilities.</span></div><label class="search-field">${icon("search")}<input id="world-search" type="search" placeholder="Search your favorite anime…" aria-label="Search anime worlds" autocomplete="off" value="${escape(worldQuery)}"/><kbd>/</kbd></label></div>
      <div class="genre-tabs" role="group" aria-label="Filter worlds by genre">${genreOptions.map(g => `<button class="genre-tab ${g === worldGenre ? "active" : ""}" data-action="genre" data-genre="${g}" aria-pressed="${g === worldGenre}">${g}</button>`).join("")}</div><p class="catalog-source-note">Popular 50 reflects titles observed on <a href="https://www.crunchyroll.com/videos/popular" target="_blank" rel="noopener noreferrer">Crunchyroll ↗</a> on 1 Nov 2026; availability and order vary.</p><div id="world-grid" class="world-grid">${worldGrid()}</div><div id="world-more" class="world-more">${moreWorlds()}</div>
      <div class="custom-world-banner"><span class="custom-world-crest" aria-hidden="true">${animeEmblem("alchemy")}</span><div><h3>Your universe doesn’t end here.</h3><p>Your art. Your colors. Your own little corner of the multiverse.</p></div>${button(`Create your own world ${icon("plus")}`, "custom", "outline")}</div>
    </section>

    <section class="landing-manifesto"><div class="landing-wrap"><span class="landing-label">A NOTE FOR YOUR NEXT CHAPTER</span><p data-reveal>You don’t have to<br>save the world today.<br><em>Just do one thing for yours.</em></p><span class="manifesto-line">SMALL WINS. REAL PROGRESS. <b class="manifesto-emblem">${animeEmblem("leaf")}</b> A STORY THAT’S YOURS.</span></div></section>
    <section class="faq-section landing-wrap"><div><span class="landing-label">BEFORE YOU STEP INSIDE</span><h2>A few little<br><em>details.</em></h2></div><div class="faq-list">${[
      ["Do I need an account?", "You can start on this device without an account. Your tasks save in this browser. Cloud sign-in becomes available when the account service is connected."],
      ["Can I change my world later?", "Whenever the mood takes you. Switch your anime from the workspace and keep your tasks, activities, and focus session."],
      ["Can I bring my own artwork?", "Yes. Upload an image, choose your colors, and name your world. You can add a video loop too. Custom media stays on this device."],
      ["What happens to my existing tasks?", "Your existing AnimeTodo tasks and activities stay with you. You can export a backup from Settings at any time."],
      ["Can I turn the animations off?", "Absolutely. Use Pause motion in the opening scene. In your workspace, switch ambient motion off. Your device’s reduced-motion preference is respected too."],
    ].map(([q,a]) => `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join("")}</div></section>
    <section class="landing-finale"><img src="/media/journey/sanctuary.webp" alt="A luminous temple sanctuary, the destination of your next arc" loading="lazy" width="1280" height="720"/><div class="finale-wash"></div><div class="finale-copy"><span class="landing-label">A NEW CHAPTER IS WAITING</span><h2>Make today<br><em>your kind of story.</em></h2>${button(`Start your next arc ${icon("arrow")}`, "start", "journey-button")}<p>No account needed to begin. Just a little curiosity.</p></div><span class="finale-corner">日々の冒険 <b class="finale-emblem">${animeEmblem("wings")}</b> THE EVERYDAY ADVENTURE</span></section>
  </main><footer class="site-footer landing-footer">${logo()}<span>A little focus. A whole new world.</span><div><button class="text-button" data-action="credits">Artwork & credits ↗</button><span>YOUR WORLD. YOUR PACE.</span></div></footer>`;
}
