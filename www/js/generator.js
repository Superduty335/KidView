// Coloring page generator. Every page is built from a seed and an age, so the
// same page id always produces the same drawing. Younger ages get one big,
// simple subject with thick lines; older ages get scenes, patterns and mandalas.

export function rng(seed) {
  let a = seed >>> 0;
  const f = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.range = (lo, hi) => lo + f() * (hi - lo);
  f.int = (lo, hi) => Math.floor(lo + f() * (hi - lo + 1));
  f.pick = (arr) => arr[Math.floor(f() * arr.length)];
  return f;
}

const { cos, sin, PI, min } = Math;
const n2 = (v) => Math.round(v * 10) / 10;
const NF = 'fill="none"';
const BK = 'fill="#000"';
const c = (x, y, r, a = '') => `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(r)}" ${a}/>`;
const e = (x, y, rx, ry, rot = 0, a = '') =>
  `<ellipse cx="${n2(x)}" cy="${n2(y)}" rx="${n2(rx)}" ry="${n2(ry)}"${rot ? ` transform="rotate(${n2(rot)} ${n2(x)} ${n2(y)})"` : ''} ${a}/>`;
const p = (d, a = '') => `<path d="${d}" ${a}/>`;
const poly = (pts, a = '') => `<polygon points="${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join(' ')}" ${a}/>`;
const mirror = (s) => `${s}<g transform="scale(-1 1)">${s}</g>`;
// Overlapping circles drawn as one outline: stroke every circle, then cover
// the inner lines with slightly smaller white circles.
const blob = (circles, sw) =>
  circles.map(([x, y, r]) => c(x, y, r)).join('') +
  circles.map(([x, y, r]) => c(x, y, Math.max(1, r - sw / 2 - 0.5), 'stroke="none"')).join('');
const scaled = (k, sw, inner) => `<g transform="scale(${k})" stroke-width="${sw / k}">${inner}</g>`;

function starPts(n, R, r, rot = -PI / 2) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i * PI) / n;
    const rr = i % 2 ? r : R;
    pts.push([cos(a) * rr, sin(a) * rr]);
  }
  return pts;
}

// Each subject draws in a local box from -100 to 100.
// ctx: { r: rng, d: detail 0..2, sw: stroke width in local units }
export const SUBJECTS = {
  sun: { theme: 'nature', setting: 'land', draw({ d }) {
    let o = '';
    const n = 8 + d * 4;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * PI * 2, w = (PI / n) * 0.6, R0 = 58, R1 = d >= 2 && i % 2 ? 80 : 96;
      o += poly([[cos(a - w) * R0, sin(a - w) * R0], [cos(a) * R1, sin(a) * R1], [cos(a + w) * R0, sin(a + w) * R0]]);
    }
    o += c(0, 0, 62);
    if (d >= 2) o += c(0, 0, 50);
    o += c(-20, -12, 6, BK) + c(20, -12, 6, BK) + p('M-24,10 Q0,34 24,10', NF);
    if (d >= 1) o += c(-36, 10, 7) + c(36, 10, 7);
    return o;
  } },

  flower: { theme: 'nature', setting: 'land', draw({ r, d }) {
    let o = p('M0,10 C-10,50 10,70 0,100', NF) + e(-22, 64, 22, 9, -30) + e(22, 76, 22, 9, 30);
    if (d >= 1) o += p('M-40,72 L-6,58', NF) + p('M40,84 L6,70', NF);
    const n = r.int(5, 7) + d;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * PI * 2;
      o += e(cos(a) * 36, -22 + sin(a) * 36, 30, d >= 1 ? 15 : 18, (a * 180) / PI);
    }
    if (d >= 2) for (let i = 0; i < n; i++) {
      const a = ((i + 0.5) / n) * PI * 2;
      o += e(cos(a) * 24, -22 + sin(a) * 24, 16, 8, (a * 180) / PI);
    }
    o += c(0, -22, 20);
    if (d >= 1) { for (let k = 0; k < 6; k++) { const a = (k / 6) * PI * 2; o += c(cos(a) * 10, -22 + sin(a) * 10, 3); } }
    return o;
  } },

  tree: { theme: 'nature', setting: 'land', draw({ r, d, sw }) {
    let o = p('M-20,100 L-14,10 L14,10 L20,100 Z');
    if (d >= 2) o += p('M-8,92 Q-4,72 -8,52 M6,84 Q10,64 6,40', NF) + e(2, 60, 6, 9);
    const leaves = [[0, -45, 52], [-46, -16, 38], [46, -16, 38], [-26, 16, 32], [26, 16, 32]];
    if (d >= 1) leaves.push([-48, -56, 26], [48, -56, 26]);
    o += blob(leaves, sw);
    if (d >= 1) {
      const spots = [[-30, -30], [20, -55], [40, -5], [-10, 0], [-50, -5], [10, -25], [25, 15], [-25, 15]];
      const k = d >= 2 ? 7 : 4;
      for (let i = 0; i < k; i++) { const [x, y] = spots[(i * 3 + r.int(0, 7)) % spots.length]; o += c(x, y, 8); }
    }
    return o;
  } },

  house: { theme: 'things', setting: 'land', draw({ d }) {
    let o = p('M34,-74 H56 V-30 H34 Z');
    o += p('M-70,-10 H70 V92 H-70 Z');
    if (d >= 2) {
      for (let y = 8; y < 90; y += 16) for (let x = -70 + ((y / 16) % 2) * 14; x < 64; x += 28) o += p(`M${x},${y} h18`, NF);
    }
    o += poly([[-90, -6], [0, -84], [90, -6]]);
    if (d >= 2) o += p('M-60,-32 H60 M-32,-56 H32', NF);
    if (d >= 1) o += c(0, -36, 12) + p('M-12,-36 H12 M0,-48 V-24', NF);
    o += p('M-15,92 V42 Q-15,28 0,28 Q15,28 15,42 V92 Z') + c(8, 64, 3, BK);
    o += p('M-58,12 H-28 V40 H-58 Z') + p('M28,12 H58 V40 H28 Z');
    if (d >= 1) o += p('M-43,12 V40 M-58,26 H-28 M43,12 V40 M28,26 H58', NF);
    if (d >= 1) o += c(48, -86, 7) + c(58, -96, 9) + c(72, -100, 6);
    return o;
  } },

  cat: { theme: 'animals', setting: 'land', draw({ d }) {
    let o = mirror(poly([[-58, -30], [-46, -96], [-10, -56]]));
    if (d >= 1) o += mirror(poly([[-46, -46], [-42, -80], [-24, -58]]));
    o += e(0, 0, 72, 60);
    if (d >= 2) o += p('M-10,-58 L-6,-40 M0,-60 L0,-42 M10,-58 L6,-40', NF) + mirror(p('M-70,0 L-54,4 M-70,14 L-56,14', NF));
    o += mirror(e(-26, -10, 13, 16) + e(-26, -8, 5, 9, 0, BK));
    o += poly([[-9, 12], [9, 12], [0, 22]]) + p('M0,22 Q-6,34 -18,30 M0,22 Q6,34 18,30', NF);
    o += mirror(p('M-30,18 L-92,8 M-30,24 L-92,28', NF));
    if (d >= 1) o += p('M-40,58 Q0,78 40,58', NF) + c(0, 74, 9);
    return o;
  } },

  dog: { theme: 'animals', setting: 'land', draw({ d }) {
    let o = mirror(e(-64, -10, 24, 50, 18));
    o += e(0, -5, 62, 66);
    if (d >= 1) o += e(30, -32, 20, 18);
    o += e(0, 32, 34, 26) + e(0, 16, 14, 10, 0, BK);
    o += p('M0,26 V40 M-18,44 Q0,56 18,44', NF);
    o += p('M-8,50 Q-8,68 0,68 Q8,68 8,50', '');
    o += mirror(c(-26, -24, 9) + c(-26, -24, 4, BK));
    if (d >= 2) o += mirror(c(-34, 32, 2.5, BK) + c(-40, 24, 2.5, BK)) + p('M-20,-60 Q0,-72 20,-60', NF);
    return o;
  } },

  bear: { theme: 'animals', setting: 'land', draw({ d }) {
    let o = mirror(c(-52, -54, 24));
    if (d >= 1) o += mirror(c(-52, -54, 12));
    o += c(0, 0, 70) + e(0, 26, 32, 24) + e(0, 14, 13, 9, 0, BK) + p('M0,22 V32 M-14,36 Q0,46 14,36', NF);
    o += mirror(c(-26, -16, 7, BK));
    if (d >= 1) o += mirror(c(-46, 20, 9));
    if (d >= 2) o += p('M-60,72 Q0,96 60,72 L60,100 H-60 Z') + c(0, 86, 7);
    return o;
  } },

  fish: { theme: 'animals', setting: 'sea', draw({ d }) {
    let o = poly([[54, 0], [100, -42], [94, 0], [100, 42]]);
    o += p('M-22,-40 Q8,-78 36,-36 Z') + p('M-6,40 Q10,64 26,38 Z');
    o += e(0, 0, 70, 46);
    if (d >= 1) o += p('M0,-45 Q14,0 0,45', NF) + p('M24,-41 Q36,0 24,41', NF);
    if (d >= 2) for (let row = -24; row <= 24; row += 16) for (let x = 34; x < 60; x += 12) o += p(`M${x},${row} q6,7 12,0`, NF);
    o += p('M-22,-32 Q-10,0 -22,32', NF) + c(-42, -10, 10) + c(-44, -10, 4, BK) + p('M-68,10 Q-60,16 -54,9', NF);
    return o;
  } },

  butterfly: { theme: 'animals', setting: 'land', draw({ d }) {
    let o = mirror(e(-36, 36, 32, 28, 20));
    o += mirror(e(-46, -30, 46, 38, -20));
    if (d >= 2) o += mirror(e(-48, -32, 28, 22, -20) + e(-36, 38, 18, 15, 20));
    if (d >= 1) o += mirror(c(-52, -36, 12) + c(-38, 40, 9));
    if (d >= 2) o += mirror(c(-76, -46, 6) + c(-22, -52, 6) + c(-58, 52, 5));
    o += e(0, 2, 10, 56);
    if (d >= 1) o += p('M-9,-12 H9 M-9,8 H9 M-8,28 H8', NF);
    o += mirror(p('M-3,-52 Q-14,-80 -28,-88', NF) + c(-28, -88, 5));
    return o;
  } },

  owl: { theme: 'animals', setting: 'land', draw({ d }) {
    let o = p('M-100,82 H100 V96 H-100 Z');
    o += mirror(poly([[-56, -50], [-52, -96], [-24, -66]]));
    o += e(0, 8, 62, 76) + e(0, 34, 40, 46);
    if (d >= 1) for (let y = 12; y <= 60; y += 16) for (let x = -24 + ((y / 16) % 2) * 8; x <= 20; x += 16) o += p(`M${x - 7},${y} q7,9 14,0`, NF);
    o += mirror(p('M-60,-2 Q-82,40 -44,72 Q-50,34 -60,-2 Z'));
    o += mirror(c(-25, -30, 22) + (d >= 2 ? c(-25, -30, 15) : '') + c(-25, -30, 8) + c(-25, -30, 3.5, BK));
    o += poly([[-8, -12], [8, -12], [0, 4]]);
    o += mirror(e(-16, 84, 9, 6));
    return o;
  } },

  turtle: { theme: 'animals', setting: 'sea', draw({ d }) {
    let o = e(-56, 50, 16, 12) + e(56, 50, 16, 12) + poly([[-76, 30], [-96, 40], [-76, 44]]);
    o += e(82, 6, 22, 18) + c(88, 0, 4, BK) + p('M86,14 Q94,18 100,12', NF);
    o += p('M-82,32 L82,32 Q82,48 70,48 L-70,48 Q-82,48 -82,32 Z');
    o += p('M-75,32 Q-75,-62 0,-62 Q75,-62 75,32 Z');
    const hex = []; for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2 + PI / 6; hex.push([cos(a) * 22, -14 + sin(a) * 22]); }
    if (d >= 1) {
      let lines = '';
      for (const [x, y] of hex) {
        if (y > 20) continue;
        const dx = x / 22, dy = (y + 14) / 22;
        let t = 0; let px = x, py = y;
        while (t < 200) { t += 1; px = x + dx * t; py = y + dy * t; if ((px / 75) ** 2 + ((py - 32) / 94) ** 2 > 1 || py >= 32) break; }
        lines += `M${n2(x)},${n2(y)} L${n2(px)},${n2(py)} `;
      }
      o += p(lines, NF);
    }
    o += poly(hex);
    if (d >= 2) o += mirror(poly(starPts(3, 10, 10).map(([x, y]) => [x - 44, y + 6])) ) + poly(starPts(3, 9, 9).map(([x, y]) => [x, y - 46]));
    return o;
  } },

  bird: { theme: 'animals', setting: 'land', draw({ d }) {
    let o = poly([[-50, 0], [-92, -20], [-88, 22]]);
    o += e(-5, 10, 52, 38) + c(38, -22, 26);
    o += poly([[60, -26], [84, -18], [60, -12]]) + c(44, -28, 5, BK);
    o += p('M-34,0 Q-6,-26 22,6 Q-4,30 -34,0 Z');
    if (d >= 1) o += p('M-20,4 Q-4,-6 10,6 M-14,14 Q0,6 12,16', NF);
    o += p('M-10,48 V70 M10,46 V70 M-18,70 H-2 M2,70 H18', NF);
    return o;
  } },

  car: { theme: 'things', setting: 'land', draw({ d }) {
    let o = p('M-95,32 V2 Q-90,-12 -70,-14 L-46,-16 L-26,-52 L36,-52 L60,-16 L86,-12 Q98,-8 98,10 V32 Z');
    o += p('M-38,-18 L-22,-44 H2 V-18 Z') + p('M10,-18 V-44 H32 L52,-18 Z');
    if (d >= 1) o += p('M6,-14 V28', NF) + p('M14,0 H26', NF) + e(90, 0, 6, 8) + p('M-98,22 H-80', NF);
    if (d >= 2) o += p('M-90,12 H92', NF);
    for (const x of [-55, 55]) {
      o += c(x, 32, 22) + c(x, 32, 9);
      if (d >= 2) for (let k = 0; k < 5; k++) { const a = (k / 5) * PI * 2; o += p(`M${n2(x + cos(a) * 9)},${n2(32 + sin(a) * 9)} L${n2(x + cos(a) * 18)},${n2(32 + sin(a) * 18)}`, NF); }
    }
    return o;
  } },

  rocket: { theme: 'things', setting: 'space', draw({ d }) {
    let o = p('M-20,70 Q0,124 20,70 Z');
    if (d >= 1) o += p('M-10,70 Q0,100 10,70 Z');
    o += mirror(p('M-30,26 L-62,76 L-30,66 Z'));
    o += p('M0,-100 C40,-60 36,20 30,70 L-30,70 C-36,20 -40,-60 0,-100 Z');
    o += p('M-23,-62 Q0,-54 23,-62', NF) + c(0, -22, 18);
    if (d >= 1) o += c(0, -22, 11);
    if (d >= 2) o += p('M-32,46 H32', NF) + p('M-6,70 V40 H6 V70', NF) + c(-18, 12, 3) + c(18, 12, 3) + c(-20, 30, 3) + c(20, 30, 3);
    return o;
  } },

  balloons: { theme: 'things', setting: 'land', draw({ r, d }) {
    let o = '';
    const set = [[-42, -24, -8], [40, -34, 10], [0, -54, 0]];
    for (const [x, y, rot] of set) {
      o += p(`M${x},${y + 62} Q${x - 10},${y + 100} 0,100`, NF);
      o += `<g transform="translate(${x} ${y}) rotate(${rot})">` + poly([[-6, 62], [6, 62], [0, 54]]) + e(0, 10, 34, 46);
      if (d >= 1) o += p('M-18,-14 Q-22,0 -16,14', NF);
      if (d >= 2) o += p('M-34,10 Q0,22 34,10', NF);
      o += '</g>';
    }
    return o;
  } },

  star: { theme: 'things', setting: 'space', draw({ d, sw }) {
    let o = poly(starPts(5, 96, 42));
    if (d === 0) o += c(-16, -4, 6, BK) + c(16, -4, 6, BK) + p('M-16,14 Q0,28 16,14', NF);
    if (d >= 1) o += poly(starPts(5, 52, 22));
    if (d >= 2) o += scaled(0.42, sw, poly(starPts(5, 52, 22)));
    return o;
  } },

  heart: { theme: 'things', setting: 'land', draw({ d, sw }) {
    const H = 'M0,85 C-60,40 -100,0 -100,-35 C-100,-75 -55,-95 -25,-80 C-12,-73 -4,-63 0,-55 C4,-63 12,-73 25,-80 C55,-95 100,-75 100,-35 C100,0 60,40 0,85 Z';
    let o = p(H);
    if (d >= 1) o += scaled(0.62, sw, p(H));
    if (d >= 2) o += scaled(0.3, sw, p(H));
    return o;
  } },
};

// Small extras used to fill a scene around the main subject.
const EXTRAS = {
  sky: ['sun', 'cloud', 'birds', 'balloon', 'rainbow'],
  ground: ['flower', 'tuft', 'mushroom', 'tree'],
  sea: ['smallfish', 'bubbles', 'seaweed', 'shell', 'starfish'],
  space: ['planet', 'moon', 'star', 'comet'],
};
const EXTRA_DRAW = {
  cloud: ({ sw }) => blob([[-40, 10, 34], [0, -14, 44], [44, 6, 36], [14, 26, 28], [-16, 28, 26]], sw),
  birds: () => p('M-60,0 Q-45,-16 -30,0 Q-15,-16 0,0 M20,-30 Q32,-42 44,-30 Q56,-42 68,-30', NF),
  balloon: () => p('M0,58 Q-12,80 4,100', NF) + poly([[-6, 62], [6, 62], [0, 54]]) + e(0, 0, 42, 56),
  rainbow: () => p('M-90,40 A90,90 0 0 1 90,40 L66,40 A66,66 0 0 0 -66,40 Z') + p('M-66,40 A66,66 0 0 1 66,40 L44,40 A44,44 0 0 0 -44,40 Z'),
  tuft: () => p('M-40,40 L-30,0 L-20,40 L-8,-10 L4,40 L14,4 L24,40 L34,-4 L44,40', NF),
  mushroom: () => p('M-18,10 L-22,70 H22 L18,10') + p('M-70,14 Q-70,-56 0,-56 Q70,-56 70,14 Z') + c(-30, -20, 10) + c(18, -30, 12) + c(40, 0, 7),
  smallfish: (ctx) => SUBJECTS.fish.draw({ ...ctx, d: Math.min(ctx.d, 1) }),
  bubbles: () => c(0, 0, 22) + c(30, -40, 14) + c(-20, -70, 10) + c(10, -98, 7),
  seaweed: () => p('M-10,100 C-40,60 20,30 -10,-10 C-30,-40 0,-70 -10,-96 C20,-70 0,-40 20,-10 C50,30 -10,60 20,100 Z'),
  shell: () => p('M-60,40 Q-70,-50 0,-60 Q70,-50 60,40 Z') + p('M0,40 L0,-58 M0,40 L-36,-44 M0,40 L36,-44 M0,40 L-56,-10 M0,40 L56,-10', NF),
  starfish: () => poly(starPts(5, 70, 30, -PI / 2 + 0.2)),
  planet: () => c(0, 0, 50) + p('M-92,20 Q0,-60 92,-20 Q0,50 -92,20 Z', NF) + p('M-70,-4 Q0,-30 70,6', NF),
  moon: () => p('M20,-80 A80,80 0 1 0 20,80 A60,60 0 1 1 20,-80 Z'),
  comet: () => p('M-90,-60 L20,-10 M-80,-20 L10,8 M-60,20 L0,26', NF) + c(36, 10, 26),
};
function drawExtra(name, ctx) {
  if (EXTRA_DRAW[name]) return EXTRA_DRAW[name](ctx);
  return SUBJECTS[name].draw(ctx);
}

function place(x, y, s, sw, inner) {
  return `<g transform="translate(${n2(x)} ${n2(y)}) scale(${n2(s)})" stroke-width="${n2(sw / s)}">${inner}</g>`;
}

function mandala(r, d, sw) {
  const rings = d >= 2 ? r.int(5, 7) : 4;
  const base = r.pick(d >= 2 ? [8, 10, 12] : [6, 8]);
  let o = '';
  const outer = 470, inner = 60;
  const step = (outer - inner) / rings;
  for (let k = 0; k < rings; k++) {
    const Ro = outer - k * step, Ri = Ro - step, Rm = (Ro + Ri) / 2;
    const n = base * (k < rings / 2 && d >= 2 ? 2 : 1);
    const type = r.pick(['petals', 'circles', 'teeth', 'scallop', 'leaf']);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * PI * 2 + (k % 2 ? PI / n : 0);
      const x = cos(a) * Rm, y = sin(a) * Rm, deg = (a * 180) / PI;
      const half = min(step / 2, (PI * Rm) / n * 0.95);
      if (type === 'petals') o += e(x, y, step / 2 + 4, half * 0.85, deg);
      else if (type === 'circles') o += c(x, y, half * 0.85) + (d >= 2 ? c(x, y, half * 0.4) : '');
      else if (type === 'leaf') {
        const a1 = a - PI / n * 0.8, a2 = a + PI / n * 0.8;
        o += p(`M${n2(cos(a) * Ri)},${n2(sin(a) * Ri)} Q${n2(cos(a1) * Rm)},${n2(sin(a1) * Rm)} ${n2(cos(a) * (Ro + 6))},${n2(sin(a) * (Ro + 6))} Q${n2(cos(a2) * Rm)},${n2(sin(a2) * Rm)} ${n2(cos(a) * Ri)},${n2(sin(a) * Ri)} Z`);
      } else if (type === 'scallop') {
        const a1 = a - PI / n, a2 = a + PI / n;
        o += p(`M${n2(cos(a1) * Ri)},${n2(sin(a1) * Ri)} Q${n2(cos(a) * (Ro + step * 0.35))},${n2(sin(a) * (Ro + step * 0.35))} ${n2(cos(a2) * Ri)},${n2(sin(a2) * Ri)} Z`);
      }
    }
    if (type === 'teeth') o += poly(starPts(n, Ro, Ri + step * 0.15, 0));
    o += c(0, 0, Ri);
  }
  o += poly(starPts(base / 2 < 4 ? 5 : base / 2, inner * 0.9, inner * 0.45)) + c(0, 0, inner * 0.3);
  let corners = '';
  if (d >= 1) for (const [x, y] of [[-500, -500], [500, -500], [-500, 500], [500, 500]]) corners += c(x, y, 120) + c(x, y, 80) + c(x, y, 40);
  return `<g transform="translate(500 500)" stroke-width="${sw}">${corners}${o}</g>`;
}

export function detailFor(age) {
  if (age <= 4) return 0;
  if (age <= 7) return 1;
  return 2;
}
const STROKE = { 2: 17, 3: 16, 4: 14, 5: 11, 6: 10, 7: 8, 8: 6, 9: 5, 10: 5 };

export const THEMES = [
  { id: 'all', label: 'Everything' },
  { id: 'animals', label: 'Animals' },
  { id: 'nature', label: 'Nature' },
  { id: 'things', label: 'Things that go' },
  { id: 'patterns', label: 'Patterns', minAge: 5 },
];

// Returns { id, age, title, svg }.
export function makePage(age, seed, theme = 'all') {
  age = Math.max(2, Math.min(10, age | 0));
  const r = rng(seed * 7919 + age * 131 + theme.length * 17);
  const d = detailFor(age);
  const sw = STROKE[age];
  const id = `${age}-${theme}-${seed}`;
  let body = '';
  let title;

  const wantPattern = theme === 'patterns' || (theme === 'all' && age >= 8 && r() < 0.18);
  if (wantPattern && age >= 5) {
    body = mandala(r, d, sw);
    title = 'Pattern';
  } else {
    const names = Object.keys(SUBJECTS).filter((k) => theme === 'all' || theme === 'patterns' || SUBJECTS[k].theme === theme);
    const name = r.pick(names);
    const subj = SUBJECTS[name];
    title = name[0].toUpperCase() + name.slice(1);
    const scale = age <= 3 ? 4.0 : age <= 4 ? 3.5 : age <= 7 ? 3.0 : 2.7;
    const cx = 500, cy = age <= 3 ? 500 : 510;
    let back = '';
    const extras = { 4: 1, 5: 2, 6: 2, 7: 3, 8: 4, 9: 6, 10: 6 }[age] || 0;

    if (age >= 4) {
      if (subj.setting === 'sea') {
        back += p('M0,110 q50,-30 100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0', NF);
        back += p('M0,880 Q250,840 500,880 T1000,870 V1000 H0 Z');
      } else if (subj.setting === 'space') {
        if (d >= 1) for (let i = 0; i < 6 + d * 4; i++) back += place(r.range(40, 960), r.range(40, 960), 0.12 + r() * 0.08, sw, poly(starPts(4, 60, 20)));
      } else {
        back += p(`M0,${r.int(790, 820)} Q250,${r.int(730, 770)} 500,${r.int(790, 810)} T1000,${r.int(770, 800)} V1000 H0 Z`);
        if (d >= 1) for (let i = 0; i < 4 + d * 3; i++) back += place(r.range(40, 960), r.range(870, 960), 0.35, sw, EXTRA_DRAW.tuft());
      }
    }

    const slots = [
      { x: 150, y: 150, s: 0.95, kind: 'top' }, { x: 850, y: 150, s: 0.95, kind: 'top' },
      { x: 140, y: 870, s: 0.8, kind: 'bottom' }, { x: 860, y: 870, s: 0.8, kind: 'bottom' },
      { x: 100, y: 520, s: 0.55, kind: 'mid' }, { x: 900, y: 520, s: 0.55, kind: 'mid' },
    ];
    const order = [0, 3, 1, 2, 4, 5];
    const pool = subj.setting === 'sea' ? { top: EXTRAS.sea, bottom: EXTRAS.sea, mid: EXTRAS.sea }
      : subj.setting === 'space' ? { top: EXTRAS.space, bottom: EXTRAS.space, mid: EXTRAS.space }
      : { top: EXTRAS.sky, bottom: EXTRAS.ground, mid: ['cloud', 'birds', 'heart', 'star', 'butterfly'] };
    const used = new Set([name]);
    for (let i = 0; i < extras; i++) {
      const slot = slots[order[i]];
      let pick = r.pick(pool[slot.kind]);
      for (let t = 0; t < 4 && used.has(pick); t++) pick = r.pick(pool[slot.kind]);
      used.add(pick);
      const s = slot.s * r.range(0.9, 1.05);
      back += place(slot.x, slot.y, s, sw, drawExtra(pick, { r, d: Math.min(d, 1), sw: sw / s }));
    }
    body = back + place(cx, cy, scale, sw, subj.draw({ r, d, sw: sw / scale }));
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">` +
    `<rect width="1000" height="1000" fill="#fff"/>` +
    `<g fill="#fff" stroke="#000" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
  return { id, age, title, svg };
}

export function svgUrl(svg) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function pageFromId(id) {
  const [age, theme, seed] = id.split('-');
  return makePage(+age, +seed, theme);
}
