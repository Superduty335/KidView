// Word Search: find hidden words by dragging (or tapping first + last letter).
// Self-contained module; see CONTRACT.md.

export const meta = { id: 'wordsearch', title: 'Word Search', blurb: 'Find the hidden words', color: 'grass' };

export const icon = `<svg viewBox="0 0 120 100" aria-hidden="true">
<rect x="14" y="8" width="92" height="84" rx="16" fill="var(--surface)" stroke="var(--ink)" stroke-width="4"/>
<rect x="22" y="20" width="76" height="20" rx="10" fill="var(--grass)" opacity=".55"/>
<line x1="34" y1="54" x2="86" y2="80" stroke="var(--sun)" stroke-width="16" stroke-linecap="round" opacity=".7"/>
<g font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="800" font-size="16" fill="var(--ink)" text-anchor="middle">
<text x="34" y="36">C</text><text x="60" y="36">A</text><text x="86" y="36">T</text>
<text x="34" y="60">S</text><text x="60" y="60">B</text><text x="86" y="60">O</text>
<text x="34" y="84">M</text><text x="60" y="84">E</text><text x="86" y="84">D</text>
</g></svg>`;

// Each theme: words written as WORD+emoji, space separated.
const THEMES = {
  animals: { name: 'Animals', emoji: '🐾', words: 'CAT🐱 DOG🐶 PIG🐷 COW🐮 HEN🐔 FOX🦊 BEE🐝 OWL🦉 BAT🦇 ANT🐜 BEAR🐻 LION🦁 FROG🐸 DUCK🦆 GOAT🐐 DEER🦌 WOLF🐺 SEAL🦭 CRAB🦀 MOUSE🐭 HORSE🐴 SHEEP🐑 TIGER🐯 ZEBRA🦓 PANDA🐼 MONKEY🐵 RABBIT🐰 TURTLE🐢 GIRAFFE🦒 ELEPHANT🐘 KOALA🐨 CAMEL🐫 SNAKE🐍 LLAMA🦙 PARROT🦜 PENGUIN🐧 HIPPO🦛 SLOTH🦥 OTTER🦦 SKUNK🦨 KANGAROO🦘 HEDGEHOG🦔 GORILLA🦍 CHICKEN🐔 SQUIRREL🐿️ BUNNY🐰 PUPPY🐶 KITTEN🐱' },
  food: { name: 'Food', emoji: '🍎', words: 'PIE🥧 EGG🥚 CAKE🎂 RICE🍚 MILK🥛 CORN🌽 PEAR🍐 KIWI🥝 SOUP🍲 TACO🌮 APPLE🍎 BREAD🍞 PIZZA🍕 GRAPE🍇 LEMON🍋 MANGO🥭 PEACH🍑 MELON🍈 BANANA🍌 CHEESE🧀 COOKIE🍪 CARROT🥕 DONUT🍩 BURGER🍔 NOODLES🍜 POPCORN🍿 PANCAKE🥞 SANDWICH🥪 BROCCOLI🥦 PRETZEL🥨 WAFFLE🧇 CHERRY🍒 TOMATO🍅 POTATO🥔 ONION🧅 HONEY🍯 JUICE🧃 FRIES🍟 CANDY🍬 BAGEL🥯 SALAD🥗 PEAS🫛 OLIVE🫒' },
  colors: { name: 'Colors', emoji: '🌈', words: 'RED🔴 TAN🟫 BLUE🔵 PINK🩷 GOLD🥇 GRAY🩶 TEAL🩵 GREEN🟢 BLACK⚫ WHITE⚪ BROWN🟤 ORANGE🟠 PURPLE🟣 YELLOW🟡 SILVER🥈 RAINBOW🌈 PAINT🎨 CRAYON🖍️' },
  space: { name: 'Space', emoji: '🚀', words: 'SUN☀️ UFO🛸 SKY🌌 MOON🌙 STAR⭐ MARS🔴 ALIEN👽 EARTH🌍 COMET☄️ ORBIT🛰️ ROCKET🚀 PLANET🪐 SATURN🪐 GALAXY🌌 METEOR☄️ CRATER🌑 COSMOS✨ TELESCOPE🔭 ASTRONAUT🧑‍🚀 SATELLITE🛰️ LAUNCH🚀 GRAVITY🍎 JUPITER🟠 NEPTUNE🔵' },
  ocean: { name: 'Ocean', emoji: '🌊', words: 'FISH🐟 CRAB🦀 SEAL🦭 WAVE🌊 SHIP🚢 SAND🏖️ BOAT⛵ WHALE🐳 SHARK🦈 SQUID🦑 CORAL🪸 SHELL🐚 OTTER🦦 OCTOPUS🐙 DOLPHIN🐬 LOBSTER🦞 SHRIMP🦐 TURTLE🐢 JELLYFISH🪼 ANCHOR⚓ PUFFER🐡 ISLAND🏝️ BEACH🏖️ DIVER🤿 PIRATE🏴‍☠️ SAIL⛵' },
  go: { name: 'Things that go', emoji: '🚗', words: 'CAR🚗 BUS🚌 VAN🚐 JET✈️ BIKE🚲 BOAT⛵ TAXI🚕 TRAM🚋 SLED🛷 SHIP🚢 TRAIN🚂 TRUCK🚚 PLANE✈️ CANOE🛶 ROCKET🚀 TRACTOR🚜 SCOOTER🛴 SUBWAY🚇 SKATES🛼 POLICE🚓 AMBULANCE🚑 FIRETRUCK🚒 HELICOPTER🚁 MOTORBIKE🏍️ BULLDOZER🚜 WAGON🛒' },
  toys: { name: 'Toys', emoji: '🧸', words: 'BALL⚽ KITE🪁 DOLL🪆 YOYO🪀 DRUM🥁 DICE🎲 GAME🎮 TEDDY🧸 ROBOT🤖 BLOCKS🧱 PUZZLE🧩 BALLOON🎈 CRAYON🖍️ MARBLE🔮 BUBBLES🫧 TRUMPET🎺 GUITAR🎸 PUPPET🧤 SWING🛝 SLIDE🛝 CARDS🃏 TRAIN🚂' },
  weather: { name: 'Weather', emoji: '⛅', words: 'SUN☀️ FOG🌫️ ICE🧊 RAIN🌧️ SNOW❄️ WIND🌬️ HOT🥵 COLD🥶 CLOUD☁️ STORM⛈️ FROST❄️ SUNNY☀️ WINDY🌬️ RAINBOW🌈 THUNDER⛈️ PUDDLE💧 UMBRELLA☂️ SNOWMAN⛄ TORNADO🌪️ LIGHTNING⚡ BREEZE🍃 SLEET🌨️' },
};
const parseWords = (s) => s.split(' ').map((t) => { const m = t.match(/^([A-Z]+)(.*)$/); return { w: m[1], e: m[2] }; });
for (const t of Object.values(THEMES)) t.list = parseWords(t.words);

const DIRS8 = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]; // [dr, dc], index = octant (angle / 45deg)
const LEVELS = {
  easy: { label: 'Easy' },
  medium: { label: 'Medium', size: 8, words: [5, 6], dirs: [[0, 1], [1, 0]], maxLen: 8 },
  hard: { label: 'Hard', dirs: DIRS8 },
};
const COLORS = ['var(--sun)', 'var(--sky)', 'var(--tomato)', 'var(--grass)',
  'color-mix(in srgb, var(--sky) 50%, var(--tomato))', 'color-mix(in srgb, var(--sun) 50%, var(--tomato))',
  'color-mix(in srgb, var(--grass) 50%, var(--sky))', 'color-mix(in srgb, var(--sun) 50%, var(--grass))'];

const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function levelSpec(level, age) {
  if (level === 'easy') return age <= 4 ? { size: 5, count: 3, dirs: [[0, 1]], maxLen: 4 } : { size: 6, count: 4, dirs: [[0, 1]], maxLen: 5 };
  if (level === 'medium') return { size: 8, count: 5 + rnd(2), dirs: [[0, 1], [1, 0]], maxLen: 7 };
  const size = 10 + rnd(3);
  return { size, count: 8 + rnd(3), dirs: DIRS8, maxLen: size };
}

// Build a puzzle: place words then fill blanks. Exported for tests.
export function generate(themeKey, level, age) {
  const theme = THEMES[themeKey] || THEMES.animals;
  const spec = levelSpec(level, age);
  const minLen = level === 'hard' ? 4 : 3;
  let pool = theme.list.filter((x) => x.w.length <= spec.maxLen && x.w.length >= minLen);
  if (level === 'easy') pool = pool.filter((x) => x.w.length <= (spec.size === 5 ? 4 : 5));
  for (let attempt = 0; attempt < 60; attempt++) {
    const n = spec.size;
    const grid = Array.from({ length: n }, () => Array(n).fill(''));
    const chosen = [];
    const seen = new Set();
    // longest first places best
    const cands = shuffle(pool).filter((x) => { if (seen.has(x.w)) return false; seen.add(x.w); return true; });
    const pick = cands.slice(0, spec.count + 4).sort((a, b) => b.w.length - a.w.length);
    for (const item of pick) {
      if (chosen.length >= spec.count) break;
      if (chosen.some((c) => c.w.includes(item.w) || item.w.includes(c.w))) continue;
      const p = place(grid, item.w, spec.dirs);
      if (p) chosen.push({ ...item, ...p });
    }
    if (chosen.length < spec.count && attempt < 59) continue;
    const letters = level === 'easy' ? 'ABCDEFGHIJKLMNOPRSTUW' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!grid[r][c]) grid[r][c] = letters[rnd(letters.length)];
    chosen.sort((a, b) => a.w.localeCompare(b.w));
    return { size: n, grid, words: chosen, dirs: spec.dirs };
  }
  return null; // unreachable: last attempt always returns
}

function place(grid, word, dirs) {
  const n = grid.length;
  const opts = [];
  for (const [dr, dc] of dirs) for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const er = r + dr * (word.length - 1), ec = c + dc * (word.length - 1);
    if (er < 0 || er >= n || ec < 0 || ec >= n) continue;
    let ok = true, overlap = 0;
    for (let i = 0; i < word.length; i++) {
      const ch = grid[r + dr * i][c + dc * i];
      if (ch && ch !== word[i]) { ok = false; break; }
      if (ch) overlap++;
    }
    if (ok && overlap < word.length) opts.push({ r, c, dr, dc, overlap });
  }
  if (!opts.length) return null;
  // mild preference for sharing letters, otherwise random
  const sh = shuffle(opts);
  const best = Math.random() < 0.4 ? sh.find((o) => o.overlap > 0) || sh[0] : sh[0];
  for (let i = 0; i < word.length; i++) grid[best.r + best.dr * i][best.c + best.dc * i] = word[i];
  return { r: best.r, c: best.c, dr: best.dr, dc: best.dc };
}

const CSS = `
.g-wordsearch { display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); align-items: start; }
.g-wordsearch .ws-board-wrap { justify-self: center; width: min(100%, 640px, calc(100dvh - 190px)); min-width: min(100%, 300px); }
.g-wordsearch .ws-board { position: relative; aspect-ratio: 1; container-type: inline-size; background: var(--surface); border-radius: 22px; box-shadow: 0 6px 0 var(--line); padding: 2.5%; touch-action: none; user-select: none; -webkit-user-select: none; cursor: pointer; }
.g-wordsearch .ws-inner { position: relative; width: 100%; height: 100%; }
.g-wordsearch .ws-lines { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.g-wordsearch .ws-lines line { stroke-linecap: round; }
.g-wordsearch .ws-grid { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(var(--n), 1fr); grid-template-rows: repeat(var(--n), 1fr); pointer-events: none; }
.g-wordsearch .ws-cell { display: grid; place-items: center; font-family: var(--display); font-weight: 800; font-size: calc(95cqi / var(--n) * 0.6); line-height: 1; color: var(--ink); }
.g-wordsearch .ws-cell.found { color: #1b2554; }
.g-wordsearch .ws-tapdot { fill: none; stroke: var(--ink); stroke-dasharray: .12 .1; }
.g-wordsearch .ws-side { display: grid; gap: 14px; align-content: start; }
.g-wordsearch .ws-words { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 0; padding: 0; list-style: none; }
.g-wordsearch .ws-word { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; min-height: 44px; border-radius: 999px; background: var(--surface); border: 2px solid var(--line); font-family: var(--display); font-weight: 800; font-size: 1.25rem; letter-spacing: .04em; overflow-wrap: anywhere; }
.g-wordsearch .ws-word .ws-pic { font-size: 1.4rem; line-height: 1; }
.g-wordsearch.easy .ws-word { font-size: 1.5rem; padding: 6px 16px; }
.g-wordsearch.easy .ws-word .ws-pic { font-size: 2rem; }
.g-wordsearch .ws-word.done { background: var(--c); border-color: var(--c); color: #1b2554; }
.g-wordsearch .ws-word.done .ws-txt { text-decoration: line-through; text-decoration-thickness: 3px; opacity: .7; }
.g-wordsearch .ws-hint { margin: 0; text-align: center; color: var(--muted); font-weight: 700; }
.g-wordsearch .ws-settings { display: grid; gap: 6px; }
.g-wordsearch .ws-settings .chips { justify-content: center; }
.g-wordsearch .chip { min-height: 44px; }
.g-wordsearch .ws-new { justify-self: center; }
.g-wordsearch .ws-win { position: fixed; inset: 0; z-index: 40; background: var(--overlay); display: grid; place-items: center; padding: 16px; }
.g-wordsearch .ws-win-card { background: var(--surface); border-radius: 28px; padding: 28px 22px; width: min(420px, 100%); text-align: center; display: grid; gap: 14px; justify-items: center; box-shadow: 0 8px 0 var(--line); animation: g-ws-pop .4s ease-out; }
.g-wordsearch .ws-win-big { font-size: 4rem; line-height: 1; }
.g-wordsearch .ws-win p { margin: 0; color: var(--muted); font-weight: 700; }
.g-wordsearch .ws-confetti { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
.g-wordsearch .ws-confetti span { position: absolute; top: -10%; font-size: 2rem; animation: g-ws-fall 2.4s linear forwards; }
.g-wordsearch .ws-board.shake { animation: g-ws-shake .3s; }
@keyframes g-ws-pop { from { transform: scale(.7); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes g-ws-fall { to { transform: translateY(120vh) rotate(540deg); } }
@keyframes g-ws-shake { 25%, 75% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }
@media (min-width: 860px) {
  .g-wordsearch { grid-template-columns: minmax(0, 1.4fr) minmax(260px, 1fr); grid-template-rows: auto 1fr; }
  .g-wordsearch .ws-board-wrap { grid-row: 1 / span 2; }
  .g-wordsearch .ws-words { justify-content: flex-start; }
  .g-wordsearch .ws-settings .chips, .g-wordsearch .ws-hint { justify-content: flex-start; text-align: left; }
  .g-wordsearch .ws-new { justify-self: start; }
}
@media (prefers-reduced-motion: reduce) { .g-wordsearch * { animation: none !important; } }
`;

export function mount(root, ctx) {
  if (!document.getElementById('g-wordsearch')) {
    const st = document.createElement('style'); st.id = 'g-wordsearch'; st.textContent = CSS; document.head.appendChild(st);
  }
  const age = Number(ctx.kid?.age) || 7;
  const prefs = safeLoad('wordsearch.prefs') || {};
  let level = LEVELS[prefs.level] ? prefs.level : age <= 5 ? 'easy' : age <= 7 ? 'medium' : 'hard';
  let theme = THEMES[prefs.theme] ? prefs.theme : 'animals';
  let solved = Number(safeLoad('wordsearch.solved')) || 0;
  let puz, found, drag = null, tapStart = null, winTimer = 0;

  function safeLoad(k) { try { return ctx.load(k); } catch { return null; } }
  function safeSave(k, v) { try { ctx.save(k, v); } catch { /* ignore */ } }

  root.innerHTML = `<div class="g-wordsearch">
    <div class="ws-board-wrap"><div class="ws-board" role="application" aria-label="Letter grid. Drag across a word, or tap its first and last letter.">
      <div class="ws-inner"><svg class="ws-lines"></svg><div class="ws-grid"></div></div></div></div>
    <div class="ws-side">
      <ul class="ws-words" aria-label="Words to find"></ul>
      <p class="ws-hint"></p>
    </div>
    <div class="ws-side ws-settings">
      <div class="chips ws-levels" role="group" aria-label="Level"></div>
      <div class="chips ws-themes" role="group" aria-label="Theme"></div>
      <button class="toy toy-grass ws-new" type="button">New puzzle</button>
    </div>
  </div>`;
  const el = root.firstElementChild;
  const board = el.querySelector('.ws-board');
  const inner = el.querySelector('.ws-inner');
  const svg = el.querySelector('.ws-lines');
  const gridEl = el.querySelector('.ws-grid');
  const wordsEl = el.querySelector('.ws-words');
  const hintEl = el.querySelector('.ws-hint');
  const levelsEl = el.querySelector('.ws-levels');
  const themesEl = el.querySelector('.ws-themes');

  function renderChips() {
    levelsEl.innerHTML = Object.entries(LEVELS).map(([k, v]) => `<button type="button" class="chip${k === level ? ' on' : ''}" data-level="${k}" aria-pressed="${k === level}">${v.label}</button>`).join('');
    themesEl.innerHTML = Object.entries(THEMES).map(([k, v]) => `<button type="button" class="chip${k === theme ? ' on' : ''}" data-theme="${k}" aria-pressed="${k === theme}">${v.emoji} ${ctx.esc(v.name)}</button>`).join('');
  }

  function newPuzzle() {
    puz = generate(theme, level, age);
    found = [];
    drag = null; tapStart = null;
    el.classList.toggle('easy', level === 'easy');
    gridEl.style.setProperty('--n', puz.size);
    board.style.setProperty('--n', puz.size);
    svg.setAttribute('viewBox', `0 0 ${puz.size} ${puz.size}`);
    gridEl.innerHTML = puz.grid.map((row) => row.map((ch) => `<div class="ws-cell">${ch}</div>`).join('')).join('');
    hintEl.textContent = level === 'easy' ? 'Words go this way ➡️' : level === 'medium' ? 'Words go ➡️ and ⬇️' : 'Words go every way, even backwards!';
    renderWords(); drawLines(); renderChips();
  }

  function renderWords() {
    wordsEl.innerHTML = puz.words.map((w, i) => {
      const f = found.find((x) => x.i === i);
      const c = f ? COLORS[f.color % COLORS.length] : '';
      return `<li class="ws-word${f ? ' done' : ''}" style="${f ? `--c:${c}` : ''}"><span class="ws-pic" aria-hidden="true">${w.e}</span><span class="ws-txt">${w.w}</span>${f ? '<span class="sr"> (found)</span>' : ''}</li>`;
    }).join('');
    const cells = gridEl.children;
    for (const cell of cells) cell.classList.remove('found');
    for (const f of found) for (const [r, c] of pathCells(f.a, f.b)) cells[r * puz.size + c]?.classList.add('found');
  }

  const lineSvg = (a, b, color, op) => `<line x1="${a[1] + 0.5}" y1="${a[0] + 0.5}" x2="${b[1] + 0.5}" y2="${b[0] + 0.5}" stroke="${color}" stroke-width=".8" opacity="${op}"/>`;
  function drawLines() {
    let s = found.map((f) => lineSvg(f.a, f.b, COLORS[f.color % COLORS.length], 0.75)).join('');
    const dragColor = COLORS[found.length % COLORS.length];
    if (drag) s += lineSvg(drag.a, drag.b, dragColor, 0.55);
    if (tapStart && !drag) s += `<circle cx="${tapStart[1] + 0.5}" cy="${tapStart[0] + 0.5}" r=".4" fill="${dragColor}" opacity=".6"/><circle class="ws-tapdot" cx="${tapStart[1] + 0.5}" cy="${tapStart[0] + 0.5}" r=".44" stroke-width=".06"/>`;
    svg.innerHTML = s;
  }

  function pathCells(a, b) {
    const dr = Math.sign(b[0] - a[0]), dc = Math.sign(b[1] - a[1]);
    const len = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
    const out = [];
    for (let i = 0; i <= len; i++) out.push([a[0] + dr * i, a[1] + dc * i]);
    return out;
  }

  function cellAt(e) {
    const rect = inner.getBoundingClientRect();
    const n = puz.size;
    const x = ((e.clientX - rect.left) / rect.width) * n, y = ((e.clientY - rect.top) / rect.height) * n;
    return { x, y, cell: [Math.min(n - 1, Math.max(0, Math.floor(y))), Math.min(n - 1, Math.max(0, Math.floor(x)))] };
  }

  // Snap the drag to the nearest of the 8 straight directions, clamped to the grid.
  function snapEnd(a, x, y) {
    const n = puz.size;
    const fy = y - (a[0] + 0.5), fx = x - (a[1] + 0.5);
    if (Math.hypot(fx, fy) < 0.5) return a;
    const oct = ((Math.round(Math.atan2(fy, fx) / (Math.PI / 4)) % 8) + 8) % 8;
    const [dr, dc] = DIRS8[oct];
    let len = Math.round((fy * dr + fx * dc) / (dr * dr + dc * dc));
    len = Math.max(0, len);
    while (len > 0) {
      const r = a[0] + dr * len, c = a[1] + dc * len;
      if (r >= 0 && r < n && c >= 0 && c < n) break;
      len--;
    }
    return [a[0] + dr * len, a[1] + dc * len];
  }

  function onDown(e) {
    if (!puz || drag || el.querySelector('.ws-win')) return;
    e.preventDefault();
    const { cell } = cellAt(e);
    drag = { id: e.pointerId, a: cell, b: cell, moved: false };
    try { board.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    drawLines();
  }
  function onMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const { x, y } = cellAt(e);
    const b = snapEnd(drag.a, x, y);
    if (b[0] !== drag.b[0] || b[1] !== drag.b[1]) {
      drag.b = b;
      if (b[0] !== drag.a[0] || b[1] !== drag.a[1]) drag.moved = true;
      drawLines();
    }
  }
  function onUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.moved && (d.a[0] !== d.b[0] || d.a[1] !== d.b[1])) {
      tapStart = null;
      trySelect(d.a, d.b);
    } else {
      const c = d.a;
      if (tapStart && tapStart[0] === c[0] && tapStart[1] === c[1]) tapStart = null;
      else if (tapStart) {
        const dr = c[0] - tapStart[0], dc = c[1] - tapStart[1];
        if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
          const a = tapStart; tapStart = null;
          if (!trySelect(a, c)) tapStart = null;
        } else tapStart = c;
      } else tapStart = c;
    }
    drawLines();
  }
  function onCancel(e) { if (drag && e.pointerId === drag.id) { drag = null; drawLines(); } }

  function trySelect(a, b) {
    const cells = pathCells(a, b);
    const s = cells.map(([r, c]) => puz.grid[r][c]).join('');
    const rev = [...s].reverse().join('');
    const i = puz.words.findIndex((w, idx) => !found.some((f) => f.i === idx) && (w.w === s || w.w === rev));
    if (i < 0) {
      if (cells.length > 1) { board.classList.remove('shake'); void board.offsetWidth; board.classList.add('shake'); }
      return false;
    }
    found.push({ i, a, b, color: found.length });
    renderWords(); drawLines();
    if (found.length === puz.words.length) win();
    else ctx.toast(`${puz.words[i].e} ${puz.words[i].w}!`);
    return true;
  }

  function win() {
    solved++;
    safeSave('wordsearch.solved', solved);
    const party = ['🎉', '⭐', '🎈', '✨', THEMES[theme].emoji];
    const conf = Array.from({ length: 18 }, (_, k) => `<span style="left:${rnd(96)}%;animation-delay:${(k % 6) * 0.15}s">${party[k % party.length]}</span>`).join('');
    winTimer = setTimeout(() => {
      const w = document.createElement('div');
      w.className = 'ws-win';
      w.innerHTML = `<div class="ws-confetti" aria-hidden="true">${conf}</div>
        <div class="ws-win-card" role="dialog" aria-label="You found them all">
          <div class="ws-win-big" aria-hidden="true">🎉</div>
          <h2 class="display quiz-prompt">You found them all!</h2>
          <p>Puzzles solved: ${solved}</p>
          <button class="toy toy-grass ws-again" type="button">New puzzle</button>
        </div>`;
      el.appendChild(w);
      w.querySelector('.ws-again').focus();
    }, 450);
  }

  function onClick(e) {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.level) { level = t.dataset.level; safeSave('wordsearch.prefs', { level, theme }); newPuzzle(); }
    else if (t.dataset.theme) { theme = t.dataset.theme; safeSave('wordsearch.prefs', { level, theme }); newPuzzle(); }
    else if (t.classList.contains('ws-new')) newPuzzle();
    else if (t.classList.contains('ws-again')) { el.querySelector('.ws-win')?.remove(); newPuzzle(); }
  }

  board.addEventListener('pointerdown', onDown);
  board.addEventListener('pointermove', onMove);
  board.addEventListener('pointerup', onUp);
  board.addEventListener('pointercancel', onCancel);
  board.addEventListener('lostpointercapture', onCancel);
  el.addEventListener('click', onClick);
  newPuzzle();

  return () => {
    clearTimeout(winTimer);
    board.removeEventListener('pointerdown', onDown);
    board.removeEventListener('pointermove', onMove);
    board.removeEventListener('pointerup', onUp);
    board.removeEventListener('pointercancel', onCancel);
    board.removeEventListener('lostpointercapture', onCancel);
    el.removeEventListener('click', onClick);
    root.innerHTML = '';
  };
}
