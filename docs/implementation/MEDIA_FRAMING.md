# Complete artwork framing — 12 November 2026

All 64 local posters and all 64 local scene images were inspected for dimensions and viewed in labeled contact sheets. The measured dimensions are recorded in `src/data/media-framing.json`; paths, file sizes, and ratios are in `media-framing-audit.json`.

The cropping was caused by placing wide scene banners into tall `object-fit: cover` frames. Of the 64 scene sources, 61 exceed 3:1; most are 1900×400. Golden Kamuy and One Piece are both 4.75:1. Every poster is portrait. Fairy Tail and Tokyo Ghoul have smaller 230px-wide posters; their source resolution remains a limit.

The landing's featured world now uses the title-matched portrait key visual in a portrait column, with a separate caption beneath it. At narrow sizes the complete poster sits beside its caption. Neither text nor a gradient obscures faces. The image's measured native aspect sets the layout, and `object-fit: contain` prevents any extra cropping.

The workspace demonstration now places the complete scene in a full-width row above its tasks and timer. That gives the landscape art the width it needs. On phones, a `<picture>` source switches to the complete portrait poster beside its caption. The caption is separate from the artwork. Fixed 150px/167px heights and foreground `cover` cropping have been removed from both components.

## Checks

- Dimensions decoded from all 128 source image headers (JPEG and PNG); every catalog ID resolves to a poster and scene entry.
- 64/64 measured records checked against catalog paths, on-disk assets, and the audit manifest.
- All 128 images visually inspected in labeled contact sheets. Recognizable series identities matched their labels; no obvious cross-series substitutions were found. This is a visual audit, not independent verification of every original image's provenance.
- `npm run build` passed. The existing lazy Three.js chunk-size warning remains.
- `git diff --check` passed.
- Browser verification is handled by the primary session. This delegated session did not connect to the user's unrelated Chrome browser.

Contact sheets: [posters](screenshots/all-world-posters-framing.jpg) and [scenes](screenshots/all-world-scenes-framing.jpg).

No source artwork was changed or regenerated. A source image may itself have an intentional editorial crop; these components now preserve the complete supplied image rather than adding another crop.
