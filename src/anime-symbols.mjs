/** Original vector motifs inspired by anime worlds, not official studio logos.
 * All symbols are decorative; the surrounding control supplies its own name. */
const motifs = {
  bull: '<path d="M27 27C15 26 10 19 11 10 2 19 7 34 23 36M53 27c12-1 17-8 16-17 9 9 4 24-12 26"/><path d="m24 26 16-7 16 7-3 18-8 14H35l-8-14Z"/><path d="m28 34 8 4-7 3m23-7-8 4 7 3M35 49h10m-10 9-3 8 8-4 8 4-3-8"/><path d="m35 26 5 7 5-7-5-4Z"/>',
  leaf: '<path d="M58 19C35 10 12 22 16 42c3 16 24 20 35 8 8-8 6-20-3-23-9-4-18 3-17 11 1 7 9 9 13 5M20 50l-8 12M17 32 9 22m14 1-1-11M57 40l12 5"/>',
  alchemy: '<circle cx="40" cy="40" r="28"/><circle cx="40" cy="40" r="22"/><path d="m40 15 22 38H18ZM40 65 18 27h44ZM26 40h28M40 26v28"/><circle cx="40" cy="40" r="8"/>',
  strawhat: '<path d="M12 45c0-5 12-9 28-9s28 4 28 9-12 10-28 10-28-5-28-10ZM23 39l3-16c8-8 20-8 28 0l3 16M24 33c11 5 21 5 32 0M22 51l-5 11m41-11 5 11"/>',
  torii: '<path d="M10 16c20 5 40 5 60 0l-2 7H12ZM17 32h46M24 24l-3 42m35-42 3 42M34 26v6m12-6v6M15 66h13m24 0h13"/>',
  wings: '<path d="m40 68-3-40L15 12v24l10 16ZM40 68l3-40 22-16v24L55 52ZM18 23l17 14M18 33l17 12M24 45l12 9M62 23 45 37m17-4L45 45m11 0L44 54"/>',
  grimoire: '<path d="M13 18c10-3 20-1 27 5 7-6 17-8 27-5v43c-10-3-20-1-27 5-7-6-17-8-27-5ZM40 23v43M20 12c9-1 15 2 20 6 5-4 11-7 20-6M21 30l10 2m-10 7 10 2m-10 7 10 2M51 31c-7-5-9 5 0 9 9-4 7-14 0-9Zm0 9v11"/>',
  kunai: '<path d="m38 10-9 26 9 10 10-10ZM38 46v15m-7-10h14"/><circle cx="38" cy="67" r="6"/><path d="m14 26 7 9-9 7m44-20 9 8-7 9M8 52l13 2m38-5 11-3"/>',
  butterfly: '<path d="M39 33C14 7 7 21 17 39 6 54 23 64 39 46m2-13c25-26 32-12 22 6 11 15-6 25-22 7M40 28v31m0-29-5-8m5 8 5-8M20 32l12 9m-9 11 9-7m28-13-12 9m9 11-9-7"/>',
  blade: '<path d="m55 9 8 9-30 34-10-9ZM23 43l-7-6m17 15 6 7M13 40l23 20M26 53 14 67m-7-5 13 12M44 22l10 10M38 29l10 10"/>',
  moon: '<path d="M52 10c-7 6-11 13-11 22 0 16 12 29 28 30-7 7-16 10-26 8C23 67 11 49 14 30c3-13 14-23 27-24 4-1 8 1 11 4Z"/><path d="M56 20v14m-7-7h14M62 40v8m-4-4h8"/>',
  orbit: '<ellipse cx="40" cy="40" rx="32" ry="12" transform="rotate(-28 40 40)"/><circle cx="40" cy="40" r="19"/><circle cx="40" cy="40" r="7"/><circle cx="65" cy="25" r="4"/><path d="M20 17 13 9m43 52 9 10"/>',
  compass: '<circle cx="40" cy="40" r="29"/><circle cx="40" cy="40" r="23"/><path d="m48 22-4 22-22 14 14-22ZM40 5v12m0 46v12M5 40h12m46 0h12M17 17l8 8m30 30 8 8M17 63l8-8m30-30 8-8"/>',
  flame: '<path d="M41 8c7 15-10 20-4 32 2-7 11-9 15-18 2 15 15 21 13 33-2 17-14 21-25 19-16-1-25-12-24-25 0-9 6-15 11-20-1 10 2 12 6 15-6-16 11-22 8-36Z"/><path d="M39 50c-1 9-8 11-5 18m10-18c7 8 9 11 4 18"/>',
  gate: '<path d="M18 68V14h44v54M25 68V21h30v47M12 68h56M36 21v47m8-47v47M18 14l8-7h28l8 7M30 40h3m14 0h3"/><path d="m31 55 9-9 9 9-9 9Z"/>',
  shield: '<path d="M14 14h52v25c-3 16-13 27-26 34-13-7-23-18-26-34ZM23 23h34v15c-2 11-8 19-17 25-9-6-15-14-17-25Z"/><path d="m40 30 8 10-8 13-8-13Z"/>',
  potion: '<path d="M31 8h18v8H31Zm3 8v15L19 52c-8 16 3 20 21 20s29-4 21-20L46 31V16M22 49h36M31 59h1m17-2h1m-8 8h1"/><path d="M56 14c7-9 14-5 11 1-2 4-7 5-11-1Z"/>',
  clover: '<path d="M40 39c-20-3-29-17-18-23 8-4 15 4 18 15 3-11 10-19 18-15 11 6 2 20-18 23 20 3 29 17 18 23-8 4-15-4-18-15-3 11-10 19-18 15-11-6-2-20 18-23Zm0 8v26"/>',
  volleyball: '<circle cx="40" cy="40" r="29"/><path d="M16 24c21-5 37 4 44 24M12 37c18-3 33 7 37 29M43 12c-7 18-3 33 12 45M58 17c-8 18-5 33 7 42M14 51c17 6 32 1 42-17M23 64c18 2 31-7 38-25"/>',
  football: '<circle cx="40" cy="40" r="29"/><path d="m40 26 14 10-5 16H31l-5-16Zm0-15v15M14 30l12 6M23 64l8-12m18 0 8 12m-3-28 12-6M29 14l-8 10 2 11m28-21 8 10-2 11M15 48l11 12h10m29-12L54 60H44"/>',
  music: '<path d="M30 56V15l33-6v41M30 27l33-6"/><ellipse cx="20" cy="58" rx="10" ry="7" transform="rotate(-20 20 58)"/><ellipse cx="53" cy="52" rx="10" ry="7" transform="rotate(-20 53 52)"/><path d="M9 15v16m-6-8h12"/>',
  guitar: '<path d="m48 31 15-21 7 5-17 20m-8-1c-8-8-18-4-16 6-13-3-22 8-14 20 8 13 23 12 26-2 12 4 19-4 11-13Z"/><circle cx="36" cy="48" r="7"/><path d="m29 57 9 6M35 48l31-34m-9 5 9 7M60 14l9 7"/>',
  clock: '<circle cx="40" cy="43" r="27"/><circle cx="40" cy="43" r="21"/><path d="M34 9h12m-6 0v7M40 26v17l12 7M22 43h4m28 0h4M40 61v-4M57 17l5 5"/>',
  crown: '<path d="m12 22 10 36h36l10-36-17 12L40 12 29 34ZM22 58h36v9H22Z"/><circle cx="12" cy="18" r="4"/><circle cx="40" cy="8" r="4"/><circle cx="68" cy="18" r="4"/><path d="m34 45 6-7 6 7-6 6Z"/>',
  chalice: '<path d="M22 12h36v14c-1 14-8 21-18 21s-17-7-18-21ZM22 18H11v7c0 10 6 15 17 15m30-22h11v7c0 10-6 15-17 15M40 47v17m-12 4h24M29 23c1 8 4 12 11 14"/>',
  race: '<path d="M20 70V9m0 5c13-10 26 10 40 0v31c-14 10-27-10-40 0M32 12v31m14-24v30M20 29c13-10 26 10 40 0"/><path d="M9 61h11m-15-9h15M60 57h12m-17 10h12"/>',
  eye: '<path d="M8 40c20-29 44-29 64 0-20 29-44 29-64 0Z"/><circle cx="40" cy="40" r="15"/><circle cx="40" cy="40" r="6"/><path d="M29 8v10M51 8v10M16 14l7 9m41-9-7 9M29 62v10m22-10v10"/>',
  chain: '<path d="m30 23 8-8c8-8 18-8 25 0s7 17 0 24l-9 9c-6 6-14 7-20 3M50 57l-8 8c-8 8-18 8-25 0s-7-17 0-24l9-9c6-6 14-7 20-3M29 51l22-22"/>',
  scroll: '<path d="M20 16h40v48H20ZM20 16c-12 0-12 12 0 12m40 24c12 0 12 12 0 12M27 26h26M27 35h26M27 44h18M27 53h23M17 10v23m46 14v23"/>',
  feather: '<path d="M19 64 55 13C31 10 8 43 19 64Zm0 0c23 6 54-32 36-51M12 74l12-18M24 36l8 6m5-20 5 7m-5 25-6-3m17-13-7-1"/>',
  flower: '<path d="M40 34c-19-31-32-9-14 5-35 0-26 25-5 20-12 27 14 31 19 8 5 23 31 19 19-8 21 5 30-20-5-20 18-14 5-36-14-5Z"/><circle cx="40" cy="48" r="9"/>',
  ufo: '<ellipse cx="40" cy="35" rx="31" ry="10"/><path d="M23 30c1-25 33-25 34 0M16 42l8 4m12 1h8m12-1 8-4M29 49 17 70m34-21 12 21M40 52v18"/>',
  slime: '<path d="M10 49C11 31 26 23 40 11c14 12 29 20 30 38 0 16-14 22-30 22S10 65 10 49Z"/><path d="m25 48 8 2m14 0 8-2M34 60c4 3 8 3 12 0"/>',
  chess: '<path d="M27 69h26v-8H27Zm5-8 5-31h6l5 31M31 30h18l5-10-9 3-5-12-5 12-9-3ZM21 73h38M40 11V4m-5 3h10"/>',
  crystal: '<path d="m40 7 19 20-6 33-13 14-13-14-6-33ZM21 27h38L40 74 21 27Zm19-20v67M12 42l-7 8 7 9m56-17 7 8-7 9"/>',
  shuriken: '<path d="m40 7 8 22 25 11-22 8-11 25-8-22L7 40l22-8Z"/><circle cx="40" cy="40" r="7"/><path d="m16 15 6 6m36 37 6 6M16 65l6-6m36-37 6-6"/>',
  mountain: '<path d="M6 66 28 20l15 25 10-17 21 38ZM20 37l8 6 6-8m9 10 9 8 6-6M14 73h52"/><circle cx="59" cy="14" r="7"/>',
  bolt: '<path d="m47 6-25 36h18l-7 32 26-40H42Z"/>',
};

const aliases = {
  'black-bulls':'bull', 'black-clover':'bull', 'one-piece':'strawhat', naruto:'leaf', 'naruto-shippuden':'shuriken', frieren:'grimoire',
  'golden-kamuy':'compass', 'fire-force':'flame', 'fate-strange-fake':'chalice', 'cheat-skill-another-world':'gate', 'mf-ghost':'race', 'trigun-stampede':'mountain',
  'jujutsu-kaisen':'eye', 'my-hero-academia':'bolt', 'to-your-eternity':'feather', slime:'slime', 'solo-leveling':'blade', 'classroom-of-the-elite':'chess',
  'apothecary-diaries':'potion', 'dr-stone':'orbit', haikyu:'volleyball', 'demon-slayer':'butterfly', 'dragon-ball-z':'orbit', gachiakuta:'chain',
  'beginning-after-end':'crown', 'mushoku-tensei':'scroll', tsukimichi:'moon', 'shield-hero':'shield', 'blue-lock':'football', rezero:'clock',
  'fairy-tail':'flame', 'your-lie-in-april':'music', 'jojos-bizarre-adventure':'blade', 'shangri-la-frontier':'compass', 'iruma-kun':'wings', 'spy-family':'eye',
  'dragon-ball-super':'orbit', 'soul-eater':'moon', 'my-dress-up-darling':'flower', 'sword-art-online':'blade', horimiya:'flower', 'kaiju-no-8':'bolt',
  'tokyo-ghoul':'eye', 'dragon-ball':'compass', wistoria:'crystal', 'chainsaw-man':'chain', 'fullmetal-alchemist':'alchemy', 'ascendance-bookworm':'grimoire',
  konosuba:'chalice', overlord:'crown', 'wind-breaker':'bolt', 'attack-on-titan':'wings', dandadan:'ufo', 'mob-psycho-100':'orbit', 'vinland-saga':'compass',
  'kaguya-sama':'chess', 'fruits-basket':'flower', 'bocchi-the-rock':'guitar', 'cowboy-bebop':'orbit', 'steins-gate':'clock', 'code-geass':'chess',
  'hells-paradise':'flower', mashle:'clover', 'hunter-x-hunter':'compass', 'assassination-classroom':'scroll',
};

export function animeEmblem(name = 'grimoire', extraClass = '') {
  const key = aliases[name] || name;
  const safeClass = String(extraClass).replace(/[^a-zA-Z0-9_ -]/g, '');
  return `<svg class="anime-emblem anime-emblem-${motifs[key] ? key : 'grimoire'} ${safeClass}" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${motifs[key] || motifs.grimoire}</svg>`;
}
