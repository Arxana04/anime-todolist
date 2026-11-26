/**
 * Art direction for the existing, title-matched artwork. No replacement art.
 *
 * `clip` is a hand-authored CSS polygon in ORIGINAL source-image percentages.
 * `bounds` is [left, top, right, bottom] in the same coordinates; the renderer
 * can use it to enlarge a small subject without enlarging the entire poster.
 * These are outer-contour silhouettes, not pixel-perfect alpha mattes: small
 * background islands between a bow, fingers, hair and clothing can remain.
 * `scene` means keep the full composition and feather its edges into the stage;
 * it MUST NOT become another hard rectangular poster card.
 *
 * QA: all 64 sources inspected in all-world-posters-framing.jpg. The following
 * 15 were also opened individually at source size: Frieren, Solo Leveling,
 * Golden Kamuy, JJK, Naruto, Naruto Shippuden, Demon Slayer, Dragon Ball Z,
 * Fullmetal Alchemist, Chainsaw Man, Dragon Ball, Wind Breaker, Bocchi,
 * My Dress-Up Darling, Your Lie in April. No claim of full-size inspection for
 * the other 49 sources or of browser-verified clipping for all 64.
 */
const source = id => `/media/anime/${id}/poster.jpg`;
const scene = (id, note, blend = 'normal') => ({ mode:'scene', source:source(id), blend, feather:12, note });
const cutout = (id, clip, bounds, note, blend = 'normal') => ({ mode:'cutout', source:source(id), clip, bounds, blend, note });

export const WORLD_ART_DIRECTION = {
  'frieren': cutout('frieren',
    'polygon(47% 36%, 52% 37%, 55% 40%, 57% 43%, 54% 46%, 58% 52%, 56% 59%, 53% 65%, 63% 70%, 62% 84%, 52% 84%, 49% 91%, 45% 94%, 39% 95%, 37% 92%, 39% 87%, 34% 89%, 29% 89%, 29% 85%, 31% 79%, 27% 74%, 27% 68%, 30% 64%, 32% 57%, 36% 53%, 39% 49%, 31% 47%, 23% 46%, 18% 44%, 16% 41%, 26% 43%, 35% 42%, 39% 40%, 42% 37%)',
    [16,36,63,95], 'Foreground Frieren with her suitcase and legs; Fern/Stark and the tree are excluded. An approximate outer silhouette; delicate hair tips need soft edge treatment.'),
  'golden-kamuy': cutout('golden-kamuy',
    'polygon(42% 15%, 48% 15%, 52% 18%, 56% 18%, 59% 15%, 62% 16%, 64% 20%, 62% 25%, 58% 29%, 55% 35%, 60% 39%, 64% 45%, 73% 49%, 86% 53%, 87% 58%, 82% 62%, 80% 65%, 91% 65%, 92% 69%, 78% 69%, 75% 75%, 66% 78%, 62% 85%, 61% 92%, 53% 94%, 47% 93%, 40% 94%, 39% 90%, 42% 83%, 30% 86%, 17% 89%, 7% 88%, 6% 85%, 12% 80%, 17% 73%, 22% 65%, 12% 62%, 4% 58%, 3% 54%, 9% 53%, 17% 52%, 22% 47%, 28% 42%, 32% 39%, 33% 34%, 37% 29%, 39% 24%, 39% 19%)',
    [3,15,92,94], 'Asirpa/Sugimoto foreground pair with their bow and rifle. Screen blending releases dark gaps; red collage fragments within limb gaps can remain.', 'screen'),
  'fire-force': scene('fire-force', 'Dense stacked team illustration: preserve the team and fire effects with feathered edges; no single complete foreground silhouette.'),
  'fate-strange-fake': scene('fate-strange-fake', 'Graphic interlocking red/cyan character planes form the artwork itself; isolate no arbitrary figure.'),
  'cheat-skill-another-world': scene('cheat-skill-another-world', 'Overlapping character ensemble and background diagonals need the original complete composition.'),
  'one-piece': { mode:'cutout', source:'/assets/sunny_go_ship.png', bounds:[0,0,100,100], blend:'normal', note:'Use the original native-alpha Thousand Sunny ship asset and original sailing scene. Do not replace it with the dense crew poster.' },
  'mf-ghost': scene('mf-ghost', 'The red racing car occupies approximately x0–86%, y69–97% of this source. Parent renderer owns the tighter vehicle foreground contour; retain full source until that contour is applied.'),
  'trigun-stampede': scene('trigun-stampede', 'Windblown environmental composition with the figure off-center: feather full scene rather than cutting the character off at the coat.'),
  'jujutsu-kaisen': scene('jujutsu-kaisen', 'Full-size checked: four overlapping figures, hands, energy and the large red face fill all edges. A polygon would sever people/effects; retain the full scene with soft lateral edges.'),
  'my-hero-academia': scene('my-hero-academia', 'Packed multi-character key visual with All Might at the top and overlapping bodies; preserve full cast.'),
  'to-your-eternity': scene('to-your-eternity', 'Luminous foreground youth and several ghosted background figures blend into deep black; soft screen composition preserves the existing light.', 'screen'),
  'slime': scene('slime', 'Group scene includes the wolf, Rimuru and several overlapping characters; keep its sky and lower creature visible.'),
  'solo-leveling': scene('solo-leveling', 'Full-size checked: two overlapping Jinwoo poses, extended daggers and stone foreground. Neither pose is fully unobstructed; use one blue environmental illustration with feathered edges, not a misleading isolated full-body cutout.'),
  'classroom-of-the-elite': scene('classroom-of-the-elite', 'School ensemble is deliberately layered across a bright full-frame backdrop. Retain all figures.'),
  'apothecary-diaries': scene('apothecary-diaries', 'The palace interior, light and two foreground figures are inseparable in this source; retain the setting and both people.'),
  'black-clover': scene('black-clover', 'Full group stands across a village/ruins scene; do not cut the small foreground figures from their environment.'),
  'dr-stone': scene('dr-stone', 'Crowded cast against a stone-age village; source composition is more legible intact.'),
  'haikyu': scene('haikyu', 'The team collage includes a large foreground volleyball; keep both court and players visible.'),
  'demon-slayer': scene('demon-slayer', 'Full-size checked: main four fighters overlap weapons and Nezuko clothing beneath a large background face. Preserve sword arcs and the entire fighting group with feathered black edges.', 'screen'),
  'dragon-ball-z': scene('dragon-ball-z', 'Full-size checked: giant Goku close-up above a complete foreground team. No one-person full-body silhouette exists; retain both visual layers.'),
  'gachiakuta': scene('gachiakuta', 'Red graphic ensemble forms a unified print; keep the original full composition.'),
  'beginning-after-end': scene('beginning-after-end', 'The foreground protagonist and companion group occupy a bright complete landscape; preserve context.'),
  'mushoku-tensei': scene('mushoku-tensei', 'Collage panels divide the cast and magic effects; no clean freestanding subject.'),
  'naruto-shippuden': cutout('naruto-shippuden',
    'polygon(49% 21%, 52% 20%, 55% 23%, 59% 22%, 59% 25%, 63% 25%, 61% 28%, 64% 30%, 61% 32%, 61% 35%, 68% 38%, 74% 41%, 75% 43%, 69% 42%, 64% 39%, 63% 46%, 67% 54%, 73% 63%, 78% 73%, 79% 82%, 70% 86%, 62% 86%, 63% 95%, 65% 98%, 65% 100%, 58% 100%, 56% 97%, 52% 85%, 49% 75%, 46% 85%, 43% 96%, 43% 100%, 36% 100%, 36% 96%, 37% 87%, 38% 74%, 30% 85%, 30% 81%, 34% 68%, 38% 56%, 38% 49%, 40% 43%, 42% 38%, 43% 34%, 39% 34%, 38% 30%, 43% 29%, 43% 26%, 46% 26%, 46% 22%)',
    [30,20,79,100], 'Full-size checked: colored Naruto/cloak stands cleanly above the sepia character collage. Contour preserves headband tails, cloak, hands and boots.'),
  'tsukimichi': scene('tsukimichi', 'Several figures overlap the moon and circular magic construction; preserve the complete moonlit illustration.'),
  'shield-hero': scene('shield-hero', 'Foreground shield and companion team span the source; soft-edged intact artwork avoids removing the shield rim.'),
  'blue-lock': scene('blue-lock', 'Fractured team collage; isolate no incomplete face or limb from the packed source.'),
  'rezero': scene('rezero', 'Dense red-violet magic and overlapping character group; keep as an atmospheric illustration.'),
  'fairy-tail': scene('fairy-tail', 'Four colored portrait quadrants intentionally fill the image; no natural freestanding foreground figure.'),
  'your-lie-in-april': scene('your-lie-in-april', 'Full-size checked: Kaori, violin, long bow, flowing dress and Kousei/piano form a single stage illustration. Her dress and bow exit source edges; retain the whole scene rather than implying an intact isolated figure.'),
  'jojos-bizarre-adventure': scene('jojos-bizarre-adventure', 'Several overlapping full-height protagonists share a dark backdrop; feather the original ensemble, preserving distinctive poses.', 'screen'),
  'shangri-la-frontier': scene('shangri-la-frontier', 'Action cast, weapons and environmental forms fill the source; keep the action composition.'),
  'iruma-kun': scene('iruma-kun', 'Large colorful school group and background demon silhouettes require the full illustration.'),
  'spy-family': scene('spy-family', 'The upside-down reflections and original character placement are essential; do not discard the reflection half.'),
  'dragon-ball-super': scene('dragon-ball-super', 'Full cast and foreground Goku weave across dragon balls; retain source shapes and use gentle edge feathering.'),
  'soul-eater': scene('soul-eater', 'Multiple cast portraits and foreground bodies are tiled across the visual; a clean foreground matte is unavailable.'),
  'my-dress-up-darling': cutout('my-dress-up-darling',
    'polygon(57% 17%, 64% 16%, 70% 18%, 74% 22%, 76% 27%, 78% 29%, 89% 27%, 100% 28%, 100% 34%, 88% 36%, 79% 38%, 83% 47%, 86% 51%, 89% 57%, 90% 61%, 86% 61%, 81% 58%, 82% 63%, 77% 65%, 77% 73%, 75% 83%, 78% 90%, 82% 95%, 82% 98%, 77% 98%, 73% 94%, 70% 87%, 67% 79%, 64% 88%, 61% 91%, 60% 90%, 60% 85%, 62% 77%, 60% 70%, 59% 63%, 55% 61%, 57% 55%, 58% 51%, 55% 43%, 52% 45%, 50% 47%, 47% 46%, 48% 43%, 46% 40%, 48% 38%, 48% 34%, 51% 30%, 52% 24%, 53% 20%)',
    [46,16,100,98], 'Full-size checked: foreground Marin is distinct from the smaller cosplay poses and Gojo. Her extended sleeve exits the original right edge; preserve that source-edge crop.'),
  'sword-art-online': scene('sword-art-online', 'Multiple portrait scales, faces, weapons and energy overlap; preserve complete key art with soft dark edges.', 'screen'),
  'horimiya': scene('horimiya', 'Pair pose and blossoms form a single bright scene. Full framing keeps both characters and their hands.'),
  'kaiju-no-8': scene('kaiju-no-8', 'The squad forms a distributed grid of full figures; avoid arbitrarily selecting one small body.'),
  'tokyo-ghoul': scene('tokyo-ghoul', 'Seated figure, chair and surrounding city fragments intertwine. Dark feathered composition keeps the hair, book and legs.', 'screen'),
  'dragon-ball': cutout('dragon-ball',
    'polygon(56% 21%, 61% 19%, 65% 23%, 70% 21%, 79% 23%, 87% 26%, 93% 31%, 83% 29%, 89% 34%, 92% 40%, 87% 39%, 91% 45%, 91% 48%, 84% 45%, 84% 48%, 80% 46%, 78% 51%, 83% 53%, 84% 57%, 81% 61%, 75% 62%, 72% 66%, 76% 70%, 75% 74%, 70% 77%, 70% 83%, 73% 85%, 79% 89%, 84% 96%, 86% 100%, 81% 100%, 77% 96%, 70% 92%, 63% 90%, 51% 90%, 41% 88%, 29% 85%, 21% 82%, 14% 77%, 8% 74%, 3% 69%, 2% 65%, 4% 61%, 9% 58%, 10% 56%, 17% 53%, 26% 52%, 29% 47%, 34% 45%, 36% 40%, 36% 33%, 34% 29%, 33% 26%, 36% 23%, 40% 22%, 44% 23%, 48% 26%, 48% 30%, 47% 34%, 50% 36%, 55% 34%, 55% 29%, 60% 27%)',
    [2,19,93,100], 'Full-size checked: young Goku and the Flying Nimbus are the unambiguous foreground. Keep the Nimbus tail; background dragon balls and mountains are excluded. Outer-contour approximation.'),
  'wistoria': scene('wistoria', 'Tower, protagonist and companions overlap foreground weapons and cape; keep the tower setting and full cast.'),
  'chainsaw-man': cutout('chainsaw-man',
    'polygon(47% 30%, 51% 29%, 53% 31%, 53% 34%, 58% 35%, 61% 37%, 65% 39%, 67% 41%, 73% 42%, 76% 45%, 80% 47%, 84% 50%, 83% 52%, 79% 51%, 73% 50%, 71% 47%, 64% 46%, 61% 44%, 59% 44%, 58% 49%, 57% 54%, 57% 58%, 54% 61%, 51% 61%, 50% 58%, 51% 54%, 49% 49%, 46% 53%, 45% 58%, 42% 59%, 40% 58%, 41% 54%, 42% 49%, 44% 46%, 41% 45%, 38% 47%, 35% 50%, 33% 54%, 30% 54%, 29% 51%, 32% 46%, 36% 44%, 40% 42%, 44% 40%, 46% 38%, 48% 36%, 44% 35%, 37% 36%, 30% 36%, 29% 34%, 39% 32%, 44% 31%)',
    [29,29,84,61], 'Full-size checked: the central Denji action figure is a small area of the skyscraper poster. Bounds are critical: normalize/enlarge this subject instead of showing the entire original poster box. Thin saw teeth are approximated by the outer contour.'),
  'fullmetal-alchemist': cutout('fullmetal-alchemist',
    'polygon(41% 19%, 46% 18%, 50% 20%, 55% 20%, 61% 22%, 65% 25%, 67% 29%, 71% 32%, 72% 37%, 74% 44%, 73% 50%, 73% 53%, 77% 57%, 79% 66%, 83% 77%, 85% 88%, 84% 94%, 78% 98%, 72% 99%, 62% 99%, 57% 96%, 57% 90%, 51% 85%, 44% 84%, 34% 85%, 27% 90%, 24% 97%, 20% 100%, 14% 100%, 15% 93%, 18% 87%, 23% 82%, 29% 79%, 33% 75%, 34% 69%, 28% 70%, 25% 66%, 27% 62%, 31% 61%, 33% 56%, 30% 57%, 28% 54%, 25% 56%, 23% 53%, 23% 49%, 21% 47%, 22% 45%, 27% 43%, 31% 43%, 32% 38%, 32% 34%, 35% 31%, 33% 29%, 34% 25%, 38% 24%, 39% 21%)',
    [14,18,85,100], 'Full-size checked: combined Alphonse and seated Edward silhouette with automail hand and red cloak. Their shared contour keeps the pair recognizable; debris between their limbs is not a pixel-perfect matte.'),
  'ascendance-bookworm': scene('ascendance-bookworm', 'Book and glowing cast composition is designed as one group; preserve the foreground book and surrounding faces.'),
  'konosuba': scene('konosuba', 'Four main characters, staffs and water effects span the full bright landscape; preserve the party.'),
  'overlord': scene('overlord', 'Foreground armored figure and layered bright upper silhouettes need the complete dark fantasy illustration.', 'screen'),
  'naruto': scene('naruto', 'Full-size checked: Naruto is cropped at the lower edge and overlaps the village cast; full key art retains the Hokage mountain and team rather than inventing missing legs.'),
  'wind-breaker': scene('wind-breaker', 'Full-size checked: five side-by-side profiles share a black/green aura. Keep the full profile lineup and release black edges using restrained screen blending.', 'screen'),
  'attack-on-titan': scene('attack-on-titan', 'Wall, towering titan and human action scene intentionally contrast scale; preserve the environment, not just a tiny isolated figure.'),
  'dandadan': scene('dandadan', 'Characters and effects interlock across every edge; retain the eccentric group illustration.'),
  'mob-psycho-100': scene('mob-psycho-100', 'Dense psychic collage and giant eye motif make the whole source its identity; keep the illustration intact.', 'screen'),
  'vinland-saga': scene('vinland-saga', 'Layered foreground cast and background close-ups: feathered full art preserves the somber historical composition.'),
  'kaguya-sama': scene('kaguya-sama', 'The ribbon traces between the two main characters; avoid clipping either person or the ribbon.'),
  'fruits-basket': scene('fruits-basket', 'School ensemble with a large foreground girl and both boys; retain the gentle courtyard setting.'),
  'bocchi-the-rock': cutout('bocchi-the-rock',
    'polygon(49% 21%, 55% 21%, 60% 22%, 63% 26%, 64% 31%, 67% 35%, 73% 39%, 79% 42%, 81% 46%, 79% 48%, 76% 45%, 74% 48%, 69% 52%, 70% 57%, 68% 62%, 66% 67%, 67% 74%, 71% 81%, 71% 86%, 65% 88%, 60% 87%, 58% 88%, 53% 90%, 47% 90%, 46% 88%, 48% 86%, 52% 85%, 50% 80%, 48% 73%, 46% 68%, 45% 66%, 43% 61%, 43% 56%, 44% 51%, 46% 49%, 47% 47%, 41% 47%, 36% 46%, 33% 43%, 29% 43%, 28% 41%, 31% 39%, 35% 40%, 39% 42%, 45% 43%, 47% 41%, 46% 37%, 45% 34%, 44% 30%, 43% 27%, 45% 24%)',
    [28,21,81,90], 'Full-size checked: foreground Bocchi with pink hair and pink tracksuit is separable from the stage/band. Her guitar hand and hair tips are included in the broad contour.'),
  'cowboy-bebop': scene('cowboy-bebop', 'Spike, cast and machinery share one busy vertical action composition; preserve all recognized silhouettes.'),
  'steins-gate': scene('steins-gate', 'Lab cast stands in the city street. Their bodies are partly obstructed; full city atmosphere is more faithful than rough individual mattes.'),
  'code-geass': scene('code-geass', 'Layered C.C./Lelouch portraits and mecha details are not separable full-body subjects.'),
  'hells-paradise': scene('hells-paradise', 'Stacked blade-bearing cast on white; preserve sword tips and all faces with full-art feathering.'),
  'mashle': scene('mashle', 'Cast stands beneath a large fantasy sky/castle. Keep this location-based illustration intact.'),
  'hunter-x-hunter': scene('hunter-x-hunter', 'Four protagonists overlap a printed background. Preserve complete bodies rather than clipping the foreground legs.'),
  'assassination-classroom': scene('assassination-classroom', 'The entire class surrounds the central teacher; retain the complete group so classmates are not cropped.'),
};
