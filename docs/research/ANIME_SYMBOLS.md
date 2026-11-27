# Anime motifs and scroll highlights

12 November 2026.

The repeated generic starbursts in the cinematic landing were replaced by original inline SVG drawings. Every placement has a different motif: an orbital seal in the opening, a horned bull crest in the introduction, a torii in the workspace benefits, a straw hat in the first ritual step, an alchemical diagram beside custom worlds, a leaf spiral in the manifesto, and paired wings in the finale.

The bull crest responds to the user's Black Bulls / Black Clover reference. The official film's [character page](https://bclover-movie.jp/character/) and [world page](https://bclover-movie.jp/world/) establish the Black Bulls squad. The new vector is an original interpretation of a horned bull skull, not a traced or official studio emblem. No remote logo files were downloaded or licensed. Other motifs likewise evoke familiar anime themes without claiming official affiliation.

`src/anime-symbols.mjs` supplies reusable decorative motifs. Their surrounding text and controls remain the accessible names; the SVGs are hidden from assistive technology.

The introduction now reveals a color layer across each word in reading order as the visitor scrolls. A GSAP ScrollTrigger timeline maps the paragraph's passage from 83% to 40% of viewport height to the full word sequence. Scrolling backward reverses the highlight. Wheel/touch scrolling is unchanged and the section is not pinned. The text remains readable before the animation code loads. Reduced motion reveals every word without movement, including after a live preference change.

The source build and whitespace checks passed. In-app browser verification must be performed by the parent session; the delegated session only exposed an unrelated Chrome connection and did not use it.

## App-wide symbol audit

The later dashboard audit removed the remaining generic sparkle call sites from world switching, the empty task state, the focus reminder, settings, and task-completion copy. The daily reminder now uses an alchemical diagram; the focus footnote uses a crescent; the empty task page uses a grimoire; world switching uses the selected world's motif. The brand mark is unchanged.

The large radial shape behind the dashboard heading came from `.dashboard-main::before`, a CSS `repeating-conic-gradient`, rather than a text glyph. `app-symbols.css` disables that old decoration and sizes each replacement explicitly. The hidden `.featured-copy::after` starburst was removed too. The generic icon helper no longer falls back to a sparkle.

The helper now has an explicit motif assignment for every one of the 64 catalog titles across 36 motif families. Golden Kamuy uses a compass, Dr. STONE an orbital diagram, BLUE LOCK a football, Haikyu!! a volleyball, Bocchi a guitar, and Apothecary Diaries a potion bottle. Related worlds may share an appropriate motif family; these remain original vector interpretations, not official logos. The only catalog worlds using the grimoire motif are Frieren and Ascendance of a Bookworm.

All 64 emitted SVGs were parsed as XML and checked for decorative accessibility attributes. JavaScript syntax and whitespace checks passed. A static search finds no `✳`, `✦`, or `icon("spark")` calls in the modern page markup or style/utility icon sources. The old activity icon values in `store.mjs` remain as historical saved-data metadata; the modern activity list displays colored dots and does not render those glyphs. No stored records were changed.
