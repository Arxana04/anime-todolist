# AnimeTodo — cinematic landing upgrade

Research and direction recorded 12 November 2026, before implementation.

## Product and source audit

The existing Vite/vanilla JavaScript app has 64 local anime worlds, device-first tasks, activities, calendar, focus timer, custom uploads, onboarding, and optional Supabase authentication. Keep those journeys and their storage keys intact. The earlier hero-sequence configuration is inactive; no successful transition video was integrated.

The user supplied `/Users/jatin/Downloads/Anime.mp4`. FFmpeg reports 1280 × 720, 24 fps, 10.03 seconds, H.264 with AAC audio, about 8 MiB. A contact sheet was visually inspected: rainy city → canal/alley → torii passage → floating temple and luminous sanctuary. The footage is an environment journey, not a seamless ambient loop. Use the whole journey and do not invent a generator/provider attribution. The supplied file is the source; commercial redistribution rights are not independently established.

## Reference research

| Reference | Contribution | Inspection |
| --- | --- | --- |
| https://lusion.co/ | Strong typographic hierarchy, one dominant immersive scene, sparse interface and deliberate whitespace | Live desktop rendering visually inspected in Browser; text also reviewed |
| https://activetheory.net/ | Environmental storytelling reference | Public page opened; JavaScript-only response. No visual-match claim |
| https://threejs.org/manual/pages/rendering-on-demand.html | Schedule renders when needed; avoid spending GPU power on unchanged scenes | Official documentation read |
| https://threejs.org/manual/pages/responsive.html | CSS sizing, camera aspect, bounded drawing-buffer resolution | Official documentation read |
| https://threejs.org/manual/pages/textures.html | Asynchronous loading and correct color spaces | Official documentation read |
| https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | Scroll-linked timelines, scrub and lifecycle cleanup | Official documentation read |
| https://www.gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/ | Responsive and reduced-motion adaptation | Official documentation reviewed |
| https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap | Decode compressed images into explicitly disposable image bitmaps | Documentation read |

The first pass reused existing fonts; the user explicitly requested a font upgrade. The final pairing is Clash Display 500/600 for headlines and Satoshi 400/500/700 for UI and body. Original unmodified WOFF2 files were downloaded from the official Fontshare CSS/CDN; exact URLs are in `public/fonts/landing-font-sources.json` and source/license references in `public/fonts/SOURCES.md`. The five files total 106,996 bytes. Typeface pages: https://www.fontshare.com/fonts/clash-display and https://www.fontshare.com/fonts/satoshi .

## Art direction and storyboard

**Concept: Make room for your next arc.** A doorway from everyday overwhelm to a personal world and a useful daily ritual.

- Palette: near-black #0b0e11, warm ivory #f2efe7, vermilion #f06a50, quiet cyan from the footage. Maintain the product's editorial anime identity.
- Typography: expressive, wide Clash Display chapter headlines; Satoshi for navigation, controls and readable body text. Small monospaced chapter labels, fine rules, restrained symbols. No fabricated social proof.
- Opening: full-screen rainy-city footage behind legible semantic HTML, a direct start action, and a browse-worlds shortcut. No blocking loader.
- Desktop journey: 400vh track / sticky 100vh stage. Scroll maps to the whole source at its native 24 fps. City → passage → sanctuary. Opening copy fades after 30%; sanctuary copy appears late. Native wheel and touch behavior stays intact.
- WebGL: a real Three.js depth field of subtle luminous motes and curved energy paths, responding to the pointer and journey progress. This is an enhancement; headings and controls remain HTML.
- Below: editorial introduction, five curated world doorways, interactive real-workspace preview, three-step getting-started guide, searchable full catalog, honest FAQ, and a final sanctuary scene/start action.
- Mobile: one-screen introduction with a sanctuary still; no 400vh scroll cost and no heavy WebGL/frame downloads. World rail scrolls by touch; catalog remains accessible.
- Reduced motion or explicit pause: static artwork, visible copy and controls, no decorative animation. Respect preference changes during a session.

## Media and performance decisions

The provided clip already contains the required environment imagery. Generate no replacement character or scene art. Derive WebP frames, a city poster, a sanctuary poster and an audio-free fast-start MP4 locally with FFmpeg.

Extract at 24 fps / 1280 × 720 rather than duplicating the source into 30 fps or upscaling it. 239 fully decoded frames would occupy about 840 MiB (excluding overhead); cap the decoded cache at 10 frames (~35 MiB). Bound concurrent requests/decodes and compressed prefetch; cancel pending work on route changes. Cap the Three.js pixel ratio at 1.5 and suspend offscreen/hidden-tab rendering. These are implementation targets until measured.

## Verification plan

Run the existing data/catalog/cloud tests and production build. Use the requested Browser integration for rendered desktop/narrow-mobile checks, scrubbing forward/back, navigation and pause, search/filter/preview, demo interaction, account/device onboarding and task creation. Check console errors, overflow, focus, static fallback and missing media. Preserve all existing records. Record measured asset sizes and browser results separately from targets. No deployment is requested.

## User refinements

The user requested removal of the marked lower-right graphic and a complete font upgrade. The film is framed at 1.24× in CSS so the marked corner is outside the viewport; source pixels and the supplied master are preserved. The vertical decorative rail was also removed. Clash Display/Satoshi replace the previous condensed lettering in this landing.
