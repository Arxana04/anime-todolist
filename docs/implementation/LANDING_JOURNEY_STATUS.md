# Cinematic landing — verified local result

12 November 2026. Preview: http://127.0.0.1:5173/ . Research and direction: [LANDING_JOURNEY.md](../research/LANDING_JOURNEY.md).

## Delivered

- Rebuilt landing composition: cinematic opening, editorial introduction, five-world gallery, interactive workspace, getting-started ritual, full searchable catalog, manifesto, FAQ and sanctuary finale.
- The supplied `Anime.mp4` is integrated as a 239-frame, native-24-fps WebP sequence. Desktop uses a 400vh track with a sticky scene. Opening and destination text change with scroll; semantic HTML actions stay outside both canvases.
- Real Three.js particles and energy curves add depth. Rendering stops offscreen, on hidden tabs, on pause, and in mobile/reduced-motion modes. Responsive changes can initialize or dispose the effects.
- Clash Display 500/600 and Satoshi 400/500/700 replace the previous landing typography. Original WOFF2 files are self-hosted; source URLs are recorded in `public/fonts/landing-font-sources.json`.
- The user-marked corner graphic is excluded by 1.24× framing; the vertical decorative rail was removed. The supplied original is untouched.
- Static mobile/reduced-motion path; explicit pause/resume and live preference listeners. A paused desktop hero shrinks to one viewport. Existing account, onboarding, dashboard, legacy and persistence code paths remain available.
- `scripts/prepare-hero-sequence.py` now reproduces this media format using FFmpeg; replacement and activation require explicit flags.

## Measured assets and budgets

- 239 compressed frames: 10,797,522 bytes (10.30 MiB).
- City poster: 85,052 bytes. Sanctuary poster: 66,714 bytes.
- Audio-free fast-start H.264 film derivative: 3,554,153 bytes; not eagerly loaded by the landing.
- Five new font files: 106,996 bytes combined.
- Decoded cache: maximum 10 × 1280 × 720 × 4 ≈ 35.16 MiB of bitmap pixels. Browser overhead and GPU allocations are additional. Browser DOM instrumentation reached the configured 10-frame limit during scrolling.
- Concurrent on-demand decoding/fetch workers: three. Compressed prefetch workers: two. Compressed in-memory budget: 20 MiB. No frame prefetch/WebGL import on the initial mobile/reduced-motion path.
- Production main JS: 146.03 kB / 48.38 kB gzip; Three.js lazy chunk: 742.80 kB / 187.70 kB gzip. Vite still reports its >500 kB chunk warning for Three.js. These are bundle sizes, not measured Core Web Vitals or a frame-rate benchmark.

## Verification performed

- `npm run build`: passed after final CSS changes.
- `npm test`: all 17 store/catalog/cloud tests passed.
- `npm run test:legacy`: all 34 legacy compatibility checks passed; these are separate from new UI browser checks.
- `git diff --check`: passed.
- The updated Python preparation script parses successfully; the shipped derivatives were generated and reviewed using the same FFmpeg commands. The destructive replacement flag was not exercised against the finished assets.
- HTTP check: all 249 frame/poster/font URLs returned 200, correct media MIME types, and exact file sizes, with no HTML fallback.
- Requested Browser integration, desktop 1440×900: WebGL initialized; console had no errors/warnings; frame scrubbing reached city, crossing and sanctuary; pause removed the renderer and shortened the track to 900px; resume restored it.
- Browser: native navigation, gallery preview modal, alias search `Sousou` → Frieren (1 result), Popular 50 filter (50 results), demo theme switching (Frieren/Solo Leveling), demo task completion (1/3 → 2/3), and start → sign-in → continue on device → onboarding all worked. No authentication provider or real account was exercised.
- Browser, 390×844: full short hero inspected, motion static, no WebGL active; navigation and preview theme controls worked; document width 390px. At 320×740, document width was 320px. Desktop document width was 1440px. No failed image loads in inspected states.
- Browser: sanctuary destination and final CTA/footer were visually inspected. The marked lower-right graphic was absent from the rendered hero framing.
- Screenshots: [desktop](screenshots/journey-desktop.jpg), [mobile](screenshots/journey-mobile.jpg), [sanctuary](screenshots/journey-sanctuary.jpg).

## Practical limits

System reduced-motion is implemented with matchMedia and preference-change listeners; the explicit static/pause path was visually checked. OS-level reduced-motion emulation, Safari, and physical mobile devices were not tested in this session. No Lighthouse/Core Web Vitals claim is made. Existing cloud sign-in is still unconfigured, as before. No deployment or Git push was requested or performed.
