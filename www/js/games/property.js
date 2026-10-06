// Town Tycoon: a kid-sized property board game. Roll two dice, hop around a
// ring of 24 town squares, buy places, collect rent, build houses on full
// color sets. Ends after a set number of rounds (by age) or when only one
// player still has coins. Self-contained module; see CONTRACT.md.
// The engine (newGame / runGame) is pure and talks to the screen through an
// `io` object, so node tests can play whole games instantly.

export const meta = { id: 'property', title: 'Town Tycoon', blurb: 'Roll, buy and build your town', color: 'grass' };

export const icon = `<svg viewBox="0 0 120 100" aria-hidden="true">
<rect x="12" y="6" width="88" height="88" rx="12" fill="var(--surface)" stroke="var(--ink)" stroke-width="4"/>
<rect x="31" y="25" width="50" height="50" rx="6" fill="var(--grass)" opacity=".35" stroke="var(--ink)" stroke-width="3"/>
<rect x="16" y="10" width="15" height="7" rx="2" fill="var(--tomato)"/><rect x="48" y="10" width="15" height="7" rx="2" fill="var(--sun)"/>
<rect x="81" y="10" width="15" height="7" rx="2" fill="var(--sky)"/><rect x="16" y="45" width="7" height="12" rx="2" fill="var(--grass)"/>
<path d="M40 56 L56 42 L72 56 V70 H40 Z" fill="var(--sun)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/>
<rect x="52" y="58" width="9" height="12" rx="2" fill="var(--ink)"/>
<g transform="rotate(12 98 74)"><rect x="82" y="58" width="32" height="32" rx="8" fill="#fff" stroke="var(--ink)" stroke-width="4"/>
<circle cx="91" cy="67" r="3.4" fill="#1b2554"/><circle cx="98" cy="74" r="3.4" fill="#1b2554"/><circle cx="105" cy="81" r="3.4" fill="#1b2554"/></g>
</svg>`;

// ---------- board ----------
const GROUPS = {
  // [price, rent, houseCost, houseRent] for age 6+, [price, rent] for little kids
  a: { color: 'color-mix(in srgb, var(--tomato) 50%, var(--sky))', big: [4, 1, 4, 4], small: [2, 1] },
  b: { color: 'var(--sky)', big: [6, 1, 4, 5], small: [3, 1] },
  c: { color: 'var(--sun)', big: [8, 2, 4, 6], small: [4, 1] },
  d: { color: 'color-mix(in srgb, var(--sun) 45%, var(--tomato))', big: [10, 2, 6, 7], small: [5, 1] },
  e: { color: 'var(--grass)', big: [12, 3, 6, 8], small: [6, 2] },
  f: { color: 'var(--tomato)', big: [14, 3, 8, 10], small: [7, 2] },
  g: { color: 'color-mix(in srgb, var(--grass-dk) 45%, var(--sky-dk))', big: [16, 4, 8, 12], small: [8, 2] },
};
const P = (g, name, e) => ({ k: 'place', g, name, e });
const SURPRISE = { k: 'surprise', name: 'Surprise', e: '🎁' };
export const SQUARES = [
  { k: 'start', name: 'Start', e: '🏁' },
  P('a', 'Lemonade Stand', '🍋'), SURPRISE, P('a', 'Cookie Cart', '🍪'), P('b', 'Bakery', '🥐'), P('b', 'Ice Cream Shop', '🍦'),
  { k: 'nap', name: 'Nap time', e: '😴' },
  P('c', 'Candy Shop', '🍭'), P('c', 'Toy Store', '🧸'), SURPRISE, P('c', 'Book Nook', '📚'), P('d', 'Pet Shop', '🐶'),
  { k: 'free', name: 'Picnic', e: '🧺' },
  P('d', 'Pizza Place', '🍕'), P('e', 'Park', '🌳'), SURPRISE, P('e', 'Playground', '🎠'), P('e', 'Garden', '🌻'),
  { k: 'wish', name: 'Wishing Well', e: '⛲' },
  P('f', 'Pool', '🏊'), P('f', 'Aquarium', '🐠'), SURPRISE, P('g', 'Zoo', '🦁'), P('g', 'Fun Fair', '🎡'),
];
const N = SQUARES.length; // 24 -> a 7 x 7 ring
const NAP = 6, PARK = 14, ZOO = 22;

const CARDS = [
  { type: 'gain', big: 2, small: 1, text: 'You found a shiny coin on the sidewalk! Get {n}.' },
  { type: 'pay', big: 2, small: 1, text: 'Oh no, your bike tire popped! Pay {n} to fix it.' },
  { type: 'move', to: PARK, text: 'Hop on the bus to the Park!' },
  { type: 'birthday', text: 'Happy birthday! Everyone gives you 1.' },
  { type: 'gain', big: 4, small: 2, text: 'You helped a neighbor rake leaves. Get {n}!' },
  { type: 'treat', text: 'You share ice cream with everyone. Give each player 1.' },
  { type: 'move', to: 0, text: 'Zoom back to Start!' },
  { type: 'nap', text: 'Yawn! Go straight to Nap time.' },
  { type: 'forward', n: 3, text: 'Skip ahead 3 squares!' },
  { type: 'gain', big: 3, small: 2, text: 'Your lemonade sale was a hit! Get {n}.' },
  { type: 'pay', big: 3, small: 1, text: 'Oops, you lost your lunch money. Pay {n}.' },
  { type: 'move', to: ZOO, text: 'Class trip to the Zoo!' },
];

export const LEVELS = {
  easy: { label: 'Easy', blurb: 'Buys things just for fun' },
  medium: { label: 'Medium', blurb: 'Saves coins and builds' },
  hard: { label: 'Hard', blurb: 'Collects sets and plays to win' },
};
const COLORS = ['tomato', 'sky', 'sun', 'grass'];
const BOTS = [{ name: 'Robo', token: '🤖' }, { name: 'Beep', token: '👾' }, { name: 'Zap', token: '🦖' }];
const FRIENDS = [{ token: '🦊' }, { name: 'Frog', token: '🐸' }, { name: 'Panda', token: '🐼' }, { name: 'Tiger', token: '🐯' }];

// ---------- engine ----------
function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function newGame({ players, age, rng = Math.random, vsComputer = false }) {
  const young = age <= 5;
  const rules = young ? { start: 15, pass: 2, wish: 1 } : { start: 30, pass: 4, wish: 2 };
  const sq = SQUARES.map((s, i) => {
    const o = { ...s, i, owner: null, house: false };
    if (s.k === 'place') {
      const [price, rent, houseCost = 0, houseRent = 0] = young ? GROUPS[s.g].small : GROUPS[s.g].big;
      Object.assign(o, { price, rent, houseCost, houseRent, color: GROUPS[s.g].color });
    }
    return o;
  });
  return {
    young, houses: !young, rounds: age <= 6 ? 8 : 15, round: 1, turn: 0, sq, rules, rng, vsComputer, over: false,
    deck: [],
    players: players.map((p, i) => ({ id: i, name: p.name, token: p.token, color: p.color || COLORS[i], ai: p.ai || null, coins: rules.start, pos: 0, nap: false, out: false })),
  };
}

const placesOf = (g, pid) => g.sq.filter((s) => s.k === 'place' && s.owner === pid);
const groupOf = (g, grp) => g.sq.filter((s) => s.g === grp);
export const ownsGroup = (g, pid, grp) => pid != null && groupOf(g, grp).every((s) => s.owner === pid);
export function rentOf(g, s) {
  if (s.house) return s.houseRent;
  return ownsGroup(g, s.owner, s.g) ? s.rent * 2 : s.rent;
}
const value = (s) => s.price + (s.house ? s.houseCost : 0);
export const worth = (g, p) => p.coins + placesOf(g, p.id).reduce((t, s) => t + value(s), 0);
export const buildable = (g, p) => (g.houses ? placesOf(g, p.id).filter((s) => !s.house && ownsGroup(g, p.id, s.g)) : []);
const active = (g) => g.players.filter((p) => !p.out);

// ---- computer brains ----
function cushion(g, p) {
  if (p.ai === 'medium') return Math.round(g.rules.start * 0.3);
  // hard: keep enough to pay the biggest rent anyone could charge right now
  let max = 0;
  for (const s of g.sq) if (s.k === 'place' && s.owner != null && s.owner !== p.id) max = Math.max(max, rentOf(g, s));
  return Math.max(max, Math.round(g.rules.start * 0.15));
}
export function aiWantsBuy(g, p, s) {
  if (p.coins < s.price) return false;
  const left = p.coins - s.price;
  if (p.ai === 'easy') return g.rng() < 0.5;
  if (p.ai === 'medium') return left >= cushion(g, p);
  const others = groupOf(g, s.g).filter((x) => x !== s);
  const opp = others.map((x) => x.owner).filter((o) => o != null && o !== p.id);
  if (others.every((x) => x.owner === p.id)) return left >= 1; // finishes my set
  if (opp.length === others.length && opp.every((o) => o === opp[0])) return left >= 1; // stops someone finishing theirs
  if (opp.some((o) => !g.players[o].ai)) return left >= cushion(g, p) / 2; // get in the kid's way
  if (others.some((x) => x.owner === p.id)) return left >= cushion(g, p) / 2; // working on a set
  if (g.round > g.rounds - 3) return left >= cushion(g, p) / 2; // places count toward the final score
  if (opp.length) return left >= cushion(g, p) * 1.5; // a set nobody can finish is worth less
  return left >= cushion(g, p);
}
export function aiBuild(g, p) {
  if (p.ai === 'easy') return null;
  const c = cushion(g, p);
  const opts = buildable(g, p).filter((s) => p.coins - s.houseCost >= c).sort((a, b) => b.houseRent - a.houseRent);
  return opts[0] || null;
}
// Sell loose places first (cheapest first), whole sets last.
function sellOrder(g, p) {
  return placesOf(g, p.id).sort((a, b) => (ownsGroup(g, p.id, a.g) - ownsGroup(g, p.id, b.g)) || value(a) - value(b));
}

// ---- turn ----
async function pay(g, from, to, amount, io, why, opts) {
  if (from.coins < amount) {
    for (const s of sellOrder(g, from)) {
      if (from.coins >= amount) break;
      const back = Math.ceil(value(s) / 2), b = from.coins;
      s.owner = null; s.house = false; from.coins += back;
      await io.say(`${from.name} needs coins and sells the ${s.name} back for ${back}.`, `${b} + ${back} = ${from.coins}`, { tone: 'sad' });
    }
  }
  if (from.coins < amount) {
    const got = from.coins;
    if (to) to.coins += got;
    from.coins = 0; from.out = true; from.nap = false;
    await io.say(`${why} ${from.name} has run out of coins and is out of the game.`, to && got ? `${to.name} gets the last ${got}.` : '', { tone: 'sad', ...opts });
    return false;
  }
  const b = from.coins;
  from.coins -= amount; if (to) to.coins += amount;
  await io.say(why, `${b} − ${amount} = ${from.coins}`, opts);
  return true;
}

async function collectStart(g, p, io) {
  const b = p.coins;
  p.coins += g.rules.pass;
  await io.say(`${p.name} passes Start and gets ${g.rules.pass}!`, `${b} + ${g.rules.pass} = ${p.coins}`, { tone: 'happy' });
}
async function walk(g, p, steps, io) {
  for (let k = 0; k < steps; k++) {
    p.pos = (p.pos + 1) % N;
    await io.hop(p);
    if (p.pos === 0) await collectStart(g, p, io);
  }
}
async function jump(g, p, to, io, collect) {
  const passes = to <= p.pos;
  p.pos = to;
  await io.hop(p);
  if (passes && collect) await collectStart(g, p, io);
}
function build(g, p, s) {
  const b = p.coins;
  p.coins -= s.houseCost; s.house = true;
  return [`${p.name} builds a house on the ${s.name}! Rent there is now ${s.houseRent}.`, `${b} − ${s.houseCost} = ${p.coins}`];
}

async function doCard(g, p, io, depth) {
  if (!g.deck.length) g.deck = shuffle(CARDS.map((_, i) => i), g.rng);
  const c = CARDS[g.deck.pop()];
  const n = g.young ? c.small : c.big;
  const text = `Surprise! ${c.text.replace('{n}', n)}`;
  const card = { card: true };
  if (c.type === 'gain') {
    const b = p.coins; p.coins += n;
    await io.say(text, `${b} + ${n} = ${p.coins}`, card);
  } else if (c.type === 'pay') {
    await pay(g, p, null, n, io, text, card);
  } else if (c.type === 'move') {
    await io.say(text, '', card);
    await jump(g, p, c.to, io, true);
    if (depth < 2) await land(g, p, io, depth + 1);
  } else if (c.type === 'forward') {
    await io.say(text, '', card);
    await walk(g, p, c.n, io);
    if (depth < 2) await land(g, p, io, depth + 1);
  } else if (c.type === 'nap') {
    await io.say(text, '', card);
    await jump(g, p, NAP, io, false);
    p.nap = true;
    await io.say(`${p.name} will skip the next turn. Sweet dreams!`, '', { tone: 'nap' });
  } else if (c.type === 'birthday') {
    await io.say(text, '', card);
    for (const o of active(g)) if (o !== p) await pay(g, o, p, 1, io, `${o.name} gives ${p.name} 1.`);
  } else if (c.type === 'treat') {
    await io.say(text, '', card);
    for (const o of active(g)) if (o !== p && !p.out) await pay(g, p, o, 1, io, `${p.name} gives ${o.name} 1.`);
  }
}

async function land(g, p, io, depth = 0) {
  const s = g.sq[p.pos];
  if (s.k === 'place') {
    if (s.owner == null) {
      if (p.coins < s.price) {
        await io.say(`The ${s.name} costs ${s.price}. ${p.name} needs more coins.`, `${p.coins} is less than ${s.price}`);
        return;
      }
      const yes = p.ai ? aiWantsBuy(g, p, s) : await io.ask(p, 'buy', s);
      if (yes) {
        const b = p.coins;
        p.coins -= s.price; s.owner = p.id;
        const set = ownsGroup(g, p.id, s.g);
        await io.say(`${p.name} bought the ${s.name}!${set ? ' That is the whole color set, so rent there is doubled!' : ''}`, `${b} − ${s.price} = ${p.coins}`, { tone: 'happy' });
      } else {
        await io.say(`${p.name} says no thanks to the ${s.name}.`);
      }
    } else if (s.owner === p.id) {
      await io.say(`${p.name} visits their own ${s.name}. Hello!`);
    } else {
      const o = g.players[s.owner], r = rentOf(g, s);
      const extra = s.house ? ' (it has a house)' : ownsGroup(g, s.owner, s.g) ? ' (double, whole set)' : '';
      await pay(g, p, o, r, io, `${p.name} pays ${o.name} ${r} rent for the ${s.name}${extra}.`);
    }
  } else if (s.k === 'surprise') {
    await doCard(g, p, io, depth);
  } else if (s.k === 'nap') {
    p.nap = true;
    await io.say(`Nap time! ${p.name} curls up for a nap and skips the next turn.`, '', { tone: 'nap' });
  } else if (s.k === 'wish') {
    const b = p.coins; p.coins += g.rules.wish;
    await io.say(`${p.name} makes a wish at the Wishing Well and finds ${g.rules.wish}!`, `${b} + ${g.rules.wish} = ${p.coins}`, { tone: 'happy' });
  } else if (s.k === 'free') {
    await io.say(`${p.name} has a picnic. A free rest!`);
  }
}

export const rollDie = (g) => 1 + Math.floor(g.rng() * 6);

export async function playTurn(g, io) {
  const p = g.players[g.turn];
  await io.turnStart(p);
  if (p.nap) {
    p.nap = false;
    await io.say(`${p.name} is still napping. Zzz… no turn this time.`, '', { tone: 'nap' });
    await io.endTurn(p);
    return;
  }
  if (p.ai) {
    await io.pause(p);
    for (let s = aiBuild(g, p); s; s = aiBuild(g, p)) await io.say(...build(g, p, s), { tone: 'happy' });
  } else {
    for (;;) {
      const v = await io.preRoll(p, buildable(g, p).filter((s) => p.coins >= s.houseCost));
      if (v === 'roll') break;
      if (v != null) await io.say(...build(g, p, g.sq[v]), { tone: 'happy' });
    }
  }
  const d = [rollDie(g), rollDie(g)];
  await io.dice(p, d);
  await walk(g, p, d[0] + d[1], io);
  await land(g, p, io, 0);
  await io.endTurn(p);
}

function checkOver(g) {
  if (active(g).length <= 1) g.over = 'one';
  else if (g.vsComputer && g.players.some((p) => !p.ai && p.out)) g.over = 'kidout';
  return g.over;
}
function advance(g) {
  const n = g.players.length;
  let t = g.turn;
  for (let guard = 0; guard < n * 2; guard++) {
    t++;
    if (t >= n) { t = 0; g.round++; }
    if (!g.players[t].out) break;
  }
  g.turn = t;
  if (g.round > g.rounds) g.over = 'rounds';
}

export async function runGame(g, io) {
  while (!g.over) {
    await playTurn(g, io);
    if (checkOver(g)) break;
    const r = g.round;
    advance(g);
    if (!g.over && g.round !== r) await io.newRound(g.round);
  }
  return results(g);
}

export function results(g) {
  const rows = g.players.map((p) => ({ p, coins: p.coins, places: worth(g, p) - p.coins, total: worth(g, p) }));
  rows.sort((a, b) => b.total - a.total);
  const top = rows[0].total;
  rows.forEach((r) => { r.win = r.total === top; });
  return rows;
}

// ---------- screen ----------
const CSS = `
.g-property { display: flex; flex-direction: column; gap: 16px; }
.g-property .pg-ask { text-align: center; font-family: var(--display); font-weight: 800; font-size: 1.5rem; margin: 0; }
.g-property .pg-sub { text-align: center; margin: 0; color: var(--muted); font-weight: 700; }
.g-property .pg-tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; background: var(--surface); padding: 6px; border-radius: 22px; align-self: center; }
.g-property .pg-tab { border: 0; background: none; border-radius: 16px; padding: 10px 18px; min-height: 52px; font-weight: 800; font-size: 1.1rem; }
.g-property .pg-tab.on { background: var(--ink); color: var(--bg); }
.g-property .pg-count { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: center; }
.g-property .pg-count .chips-label { flex-basis: 100%; text-align: center; padding: 0; }
.g-property .pg-count .chip { min-height: 52px; min-width: 60px; font-size: 1.25rem; }
.g-property .pg-levels { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 18px; }
.g-property .pg-level { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 18px 14px 20px; }
.g-property .pg-level svg { width: 68px; height: 68px; }
.g-property .pg-lname { font-size: 1.6rem; }
.g-property .pg-lblurb { font-family: var(--body); font-weight: 700; font-size: .95rem; }
.g-property .pg-wins { font-family: var(--body); font-size: .85rem; font-weight: 800; background: rgba(255,255,255,.55); border-radius: 999px; padding: 2px 10px; }
.g-property .pg-lineup { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 0; padding: 0; list-style: none; }
.g-property .pg-lineup li { display: flex; align-items: center; gap: 8px; background: var(--surface); border-radius: 999px; padding: 6px 16px 6px 6px; font-weight: 800; max-width: 100%; overflow-wrap: anywhere; }

.g-property .pg-tok { --pc: var(--sun); width: 40px; height: 40px; border-radius: 50%; background: color-mix(in srgb, var(--pc) 70%, var(--surface)); display: inline-grid; place-items: center; font-size: 24px; line-height: 1; flex: none; box-shadow: inset 0 -3px 0 rgba(0,0,0,.15); }
.g-property .pg-coin { display: inline-block; width: .8em; height: .8em; border-radius: 50%; background: var(--sun); box-shadow: inset 0 0 0 .13em var(--sun-dk); vertical-align: -.06em; margin-left: .15em; flex: none; }

.g-property .pg-game { position: relative; display: grid; gap: 14px; justify-items: center; align-items: start; }
.g-property .pg-board {
  container-type: inline-size; width: min(100%, max(300px, calc(100dvh - 150px)), 720px); aspect-ratio: 1;
  display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); grid-template-rows: repeat(7, minmax(0, 1fr));
  gap: 3px; padding: 4px; background: var(--line); border-radius: 18px; box-shadow: 0 6px 0 var(--line);
}
.g-property .pg-sq {
  position: relative; border: 0; padding: 0; margin: 0; min-width: 0; min-height: 0; overflow: hidden;
  background: var(--surface); color: var(--ink); border-radius: max(4px, 1.3cqw);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .3cqw; font-family: var(--body);
}
.g-property .pg-sq.k-start { background: color-mix(in srgb, var(--grass) 30%, var(--surface)); }
.g-property .pg-sq.k-nap { background: color-mix(in srgb, var(--sky) 28%, var(--surface)); }
.g-property .pg-sq.k-surprise { background: color-mix(in srgb, var(--sun) 30%, var(--surface)); }
.g-property .pg-sq.k-free, .g-property .pg-sq.k-wish { background: color-mix(in srgb, var(--grass) 16%, var(--surface)); }
.g-property .pg-strip { position: absolute; top: 0; left: 0; right: 0; height: 20%; background: var(--gc); }
.g-property .k-place .pg-emo { margin-top: 16%; }
.g-property .pg-emo { font-size: 5.4cqw; line-height: 1; }
.g-property .pg-name { display: none; font-size: 1.75cqw; font-weight: 800; line-height: 1.05; text-align: center; padding: 0 3px; overflow-wrap: anywhere; }
.g-property .pg-price { font-size: max(10px, 2.2cqw); font-weight: 800; color: var(--muted); line-height: 1; display: flex; align-items: center; }
.g-property .pg-sq.has-tok .pg-emo, .g-property .pg-sq.has-tok .pg-name, .g-property .pg-sq.has-tok .pg-price { opacity: .28; }
.g-property .pg-own { position: absolute; top: 1px; right: 1px; width: 4.8cqw; height: 4.8cqw; border-radius: 50%; background: var(--pc); display: grid; place-items: center; font-size: 3cqw; line-height: 1; box-shadow: 0 0 0 2px var(--surface); }
.g-property .pg-house { position: absolute; top: 1px; left: 1px; font-size: 3.6cqw; line-height: 1; filter: drop-shadow(0 0 1px var(--surface)); }
.g-property .pg-toks { position: absolute; inset: 0; display: flex; flex-wrap: wrap; align-items: center; align-content: center; justify-content: center; gap: 0; pointer-events: none; }
.g-property .pg-toks span { font-size: 5.6cqw; line-height: 1.05; filter: drop-shadow(0 0 1.5px var(--surface)) drop-shadow(0 2px 1px rgba(0,0,0,.35)); }
.g-property .pg-toks .hop { animation: pg-hop .26s ease-out; }
@keyframes pg-hop { 0% { transform: translateY(0) scale(1); } 45% { transform: translateY(-38%) scale(1.15); } 100% { transform: translateY(0) scale(1); } }
.g-property .pg-sq.here { box-shadow: inset 0 0 0 3px var(--ink); }
@container (max-width: 419px) { .g-property .pg-board .pg-who { display: none; } }
.g-property .pg-center.tight .pg-die { display: none; }
.g-property .pg-center.tight { gap: 3px; }
.g-property .pg-center.tight .pg-acts .toy { font-size: 1rem; padding: .3em .7em; min-height: 44px; }
@container (min-width: 520px) {
  .g-property .pg-name { display: block; }
  .g-property .pg-emo { font-size: 4.4cqw; }
  .g-property .k-place .pg-emo { margin-top: 12%; }
}

.g-property .pg-center {
  grid-area: 2 / 2 / 7 / 7; min-width: 0; min-height: 0; overflow: auto; border-radius: 14px;
  background: color-mix(in srgb, var(--grass) 16%, var(--bg));
  display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: max(4px, 1.6cqw);
  padding: max(6px, 2cqw); text-align: center; font-size: clamp(.85rem, 3.5cqw, 1.3rem); line-height: 1.25;
}
.g-property .pg-who { display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; font-weight: 800; }
.g-property .pg-who .pg-tok { width: max(30px, 7cqw); height: max(30px, 7cqw); font-size: max(18px, 4.2cqw); }
.g-property .pg-dicerow { display: flex; align-items: center; justify-content: center; gap: max(6px, 1.6cqw); }
.g-property .pg-die {
  width: clamp(32px, 9cqw, 64px); aspect-ratio: 1; border-radius: 22%; background: #fff; box-shadow: inset 0 -4px 0 #cfd6ea, 0 3px 0 rgba(0,0,0,.25);
  position: relative; flex: none;
}
.g-property .pg-die i { position: absolute; width: 20%; height: 20%; border-radius: 50%; background: #1b2554; transform: translate(-50%, -50%); }
.g-property .pg-die.spin { animation: pg-spin .14s linear infinite; }
@keyframes pg-spin { 0% { transform: rotate(-12deg); } 50% { transform: rotate(12deg) translateY(-3px); } 100% { transform: rotate(-12deg); } }
.g-property .pg-sum { font-family: var(--display); font-weight: 800; font-size: 1.35em; white-space: nowrap; }
.g-property .pg-msg { margin: 0; font-weight: 700; max-width: 30ch; text-wrap: balance; }
.g-property .pg-msg.card { background: var(--surface); border: 3px dashed var(--sun-dk); border-radius: 14px; padding: 6px 10px; }
.g-property .pg-msg.happy::before { content: "🎉 "; }
.g-property .pg-math { margin: 0; font-family: var(--display); font-weight: 800; font-size: 1.35em; color: var(--ink); }
.g-property .pg-math:empty, .g-property .pg-msg:empty, .g-property .pg-sum:empty { display: none; }
.g-property .pg-acts { display: flex; flex-wrap: wrap; justify-content: center; gap: max(8px, 1.6cqw); }
.g-property .pg-acts:empty { display: none; }
.g-property .pg-acts .toy { font-size: clamp(1rem, 4.2cqw, 1.5rem); padding: .4em .85em; min-height: 48px; border-radius: 22px; box-shadow: 0 5px 0 var(--edge); }
.g-property .pg-acts .toy:active { transform: translateY(4px); box-shadow: 0 1px 0 var(--edge); }
.g-property .pg-acts .toy-small { --edge: var(--line); background: var(--surface); }
.g-property .pg-acts .pg-roll { font-size: clamp(1.3rem, 5.6cqw, 2rem); padding: .4em 1.3em; }

.g-property .pg-side { width: min(100%, 720px); display: flex; flex-direction: column; gap: 10px; }
.g-property .pg-round { margin: 0; text-align: center; font-family: var(--display); font-weight: 800; font-size: 1.25rem; }
.g-property .pg-round.last { color: var(--tomato); }
.g-property .pg-players { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 155px), 1fr)); gap: 8px; }
.g-property .pg-pl { --pc: var(--sun); display: flex; align-items: center; gap: 8px; background: var(--surface); border-radius: 18px; padding: 8px 10px; border: 3px solid transparent; min-width: 0; }
.g-property .pg-pl.cur { border-color: var(--pc); box-shadow: 0 4px 0 var(--pc); }
.g-property .pg-pl.out { opacity: .45; }
.g-property .pg-pl-main { display: flex; flex-direction: column; min-width: 0; gap: 2px; flex: 1; }
.g-property .pg-pl-name { font-weight: 800; line-height: 1.1; overflow-wrap: anywhere; }
.g-property .pg-pl-coins { font-family: var(--display); font-weight: 800; font-size: 1.35rem; line-height: 1; display: flex; align-items: center; gap: 2px; flex-wrap: wrap; }
.g-property .pg-pl-props { display: flex; flex-wrap: wrap; gap: 3px; }
.g-property .pg-pl-props i { width: 12px; height: 12px; border-radius: 3px; background: var(--gc); }
.g-property .pg-pl-props i.h { outline: 2px solid var(--ink); outline-offset: 0; }
.g-property .pg-tag { font-size: .8rem; font-weight: 800; color: var(--muted); }
.g-property .pg-help { margin: 0; color: var(--muted); font-size: .92rem; text-align: center; }

.g-property .pg-over { position: absolute; top: -6px; left: -6px; right: -6px; min-height: calc(100% + 12px); background: var(--overlay); border-radius: 22px; display: flex; justify-content: center; align-items: flex-start; padding: 16px; z-index: 5; }
.g-property .pg-card { background: var(--surface); border-radius: 28px; padding: 22px 18px; width: min(460px, 100%); display: flex; flex-direction: column; gap: 12px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,.3); margin-top: min(6vh, 50px); }
.g-property .pg-card .pg-big { font-size: 3.4rem; line-height: 1; }
.g-property .pg-res { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.g-property .pg-res li { --pc: var(--sun); display: flex; align-items: center; gap: 10px; border: 2px solid var(--line); border-radius: 16px; padding: 8px 10px; text-align: left; }
.g-property .pg-res li.win { border-color: var(--sun-dk); background: color-mix(in srgb, var(--sun) 22%, var(--surface)); }
.g-property .pg-res .pg-pl-main span { color: var(--muted); font-weight: 700; font-size: .95rem; }
.g-property .pg-res b { font-family: var(--display); font-size: 1.6rem; margin-left: auto; display: flex; align-items: center; }

@media (min-width: 860px) {
  .g-property .pg-game { grid-template-columns: auto minmax(230px, 290px); justify-content: center; }
  .g-property .pg-board { width: min(calc(100vw - 380px), max(300px, calc(100dvh - 140px)), 760px); }
  .g-property .pg-players { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) { .g-property .pg-toks .hop, .g-property .pg-die.spin { animation: none; } }
`;

const PIPS = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
const PIP_AT = [24, 50, 76];
const dieFace = (n) => PIPS[n].map((k) => `<i style="top:${PIP_AT[Math.ceil(k / 3) - 1]}%;left:${PIP_AT[(k - 1) % 3]}%"></i>`).join('');
// ring position -> [row, col] in the 7 x 7 grid; 0 = bottom-right, going clockwise (left along the bottom)
function cell(i) {
  if (i <= 6) return [7, 7 - i];
  if (i <= 12) return [7 - (i - 6), 1];
  if (i <= 18) return [1, 1 + (i - 12)];
  return [1 + (i - 18), 7];
}
function botFace(level) {
  const mouth = ['M18 32 Q24 37 30 32', 'M18 33 H30', 'M18 34 Q24 29 30 34'][level];
  return `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 V10" stroke="#1b2554" stroke-width="3"/><circle cx="24" cy="4" r="3" fill="#1b2554"/><rect x="8" y="10" width="32" height="30" rx="9" fill="#fff" stroke="#1b2554" stroke-width="3"/><circle cx="18" cy="23" r="4" fill="#1b2554"/><circle cx="30" cy="23" r="4" fill="#1b2554"/>${level === 2 ? '<path d="M13 16 L21 19 M35 16 L27 19" stroke="#1b2554" stroke-width="3" stroke-linecap="round"/>' : ''}<path d="${mouth}" stroke="#1b2554" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
}

export function mount(root, ctx) {
  if (!document.getElementById('g-property')) {
    const st = document.createElement('style');
    st.id = 'g-property';
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  const esc = ctx.esc;
  const kid = ctx.kid || { name: 'You', age: 7 };
  const age = +kid.age || 7;
  const COIN = '<i class="pg-coin" role="img" aria-label="coins"></i>';
  const speed = () => (typeof globalThis.__pgSpeed === 'number' ? globalThis.__pgSpeed : 1);
  const timers = new Set();
  let dead = false, pending = null, game = null, lastSetup = null;
  const saved = () => { try { return ctx.load('property') || {}; } catch { return {}; } };
  const store = (patch) => { try { ctx.save('property', { ...saved(), ...patch }); } catch { /* storage off */ } };
  const prefs = saved();
  const setup = { mode: prefs.mode === 'friends' ? 'friends' : 'bots', bots: prefs.bots || 1, friends: prefs.friends || 2 };

  const sleep = (ms) => new Promise((res) => {
    if (dead) return;
    const t = setTimeout(() => { timers.delete(t); if (!dead) res(); }, Math.max(0, ms * speed()));
    timers.add(t);
  });
  const $ = (sel) => root.querySelector(sel);
  const tok = (p) => `<span class="pg-tok" style="--pc:var(--${p.color})" aria-hidden="true">${p.token}</span>`;

  // ---- setup screen ----
  function showSetup() {
    game = null; pending = null;
    const wins = saved().wins || {};
    const lineup = [{ name: kid.name, token: FRIENDS[0].token, color: COLORS[0] }, ...FRIENDS.slice(1, setup.friends).map((f, i) => ({ ...f, color: COLORS[i + 1] }))];
    root.innerHTML = `<div class="g-property">
      <p class="pg-ask">Who's playing?</p>
      <div class="pg-tabs" role="tablist">
        <button class="pg-tab ${setup.mode === 'bots' ? 'on' : ''}" data-mode="bots" role="tab" aria-selected="${setup.mode === 'bots'}">🤖 Computer</button>
        <button class="pg-tab ${setup.mode === 'friends' ? 'on' : ''}" data-mode="friends" role="tab" aria-selected="${setup.mode === 'friends'}">👫 Friends</button>
      </div>
      ${setup.mode === 'bots' ? `
        <div class="pg-count"><span class="chips-label">How many robots?</span>${[1, 2, 3].map((n) => `<button class="chip ${setup.bots === n ? 'on' : ''}" data-bots="${n}">${n}</button>`).join('')}</div>
        <section class="pg-levels">
          ${Object.entries(LEVELS).map(([id, l], i) => `
          <button class="toy pg-level ${['toy-grass', 'toy-sun', 'toy-tomato'][i]}" data-start="${id}">
            ${botFace(i)}<span class="pg-lname">${l.label}</span><span class="pg-lblurb">${l.blurb}</span>
            ${wins[id] ? `<span class="pg-wins">You won ${wins[id]} time${wins[id] === 1 ? '' : 's'}</span>` : ''}
          </button>`).join('')}
        </section>` : `
        <div class="pg-count"><span class="chips-label">How many players?</span>${[2, 3, 4].map((n) => `<button class="chip ${setup.friends === n ? 'on' : ''}" data-friends="${n}">${n}</button>`).join('')}</div>
        <ul class="pg-lineup">${lineup.map((p) => `<li>${tok(p)}${esc(p.name)}</li>`).join('')}</ul>
        <p class="pg-sub">Pass the device. Each player taps Roll on their turn.</p>
        <div class="row-center"><button class="toy toy-sky toy-big" data-start="friends">Start!</button></div>`}
      <p class="pg-help">Buy places, collect rent, and build houses. After ${age <= 6 ? 8 : 15} rounds, the most coins plus places wins!</p>
    </div>`;
  }

  // ---- game screen ----
  function startGame(mode) {
    lastSetup = mode;
    store({ mode: setup.mode, bots: setup.bots, friends: setup.friends });
    const me = { name: kid.name, token: FRIENDS[0].token };
    const players = mode === 'friends' ? [me, ...FRIENDS.slice(1, setup.friends)] : [me, ...BOTS.slice(0, setup.bots).map((b) => ({ ...b, ai: mode }))];
    const g = newGame({ players, age, vsComputer: mode !== 'friends' });
    game = g;
    if (globalThis.__pgSpeed != null) globalThis.__pgGame = g; // test hook only
    root.innerHTML = `<div class="g-property"><div class="pg-game">
      <div class="pg-board" role="group" aria-label="Town board">
        ${g.sq.map((s) => {
          const [r, c] = cell(s.i);
          return `<button class="pg-sq k-${s.k}" data-sq="${s.i}" style="grid-area:${r} / ${c};${s.color ? `--gc:${s.color}` : ''}" aria-label="${esc(s.name)}">
            ${s.k === 'place' ? '<span class="pg-strip"></span>' : ''}<span class="pg-emo" aria-hidden="true">${s.e}</span>
            <span class="pg-name">${esc(s.name)}</span>${s.k === 'place' ? `<span class="pg-price">${s.price}${COIN}</span>` : ''}<span class="pg-dyn"></span></button>`;
        }).join('')}
        <div class="pg-center">
          <div class="pg-who"></div>
          <div class="pg-dicerow"><div class="pg-die">${dieFace(1)}</div><div class="pg-die">${dieFace(1)}</div><span class="pg-sum"></span></div>
          <p class="pg-msg" aria-live="polite"></p>
          <p class="pg-math"></p>
          <div class="pg-acts"></div>
        </div>
      </div>
      <aside class="pg-side"><p class="pg-round"></p><div class="pg-players"></div></aside>
      <div class="pg-over" hidden></div>
    </div></div>`;
    renderSquares(); renderPlayers();
    runGame(g, io).then((rows) => { if (!dead && game === g) showResults(rows); });
  }

  function renderSquares(moving = null) {
    const g = game;
    const cur = g.players[g.turn];
    for (const s of g.sq) {
      const el = root.querySelector(`[data-sq="${s.i}"]`);
      if (!el) continue;
      const here = g.players.filter((p) => !p.out && p.pos === s.i);
      const owner = s.owner != null ? g.players[s.owner] : null;
      el.querySelector('.pg-dyn').innerHTML =
        (s.house ? '<span class="pg-house" aria-hidden="true">🏠</span>' : '') +
        (owner ? `<span class="pg-own" style="--pc:var(--${owner.color})" aria-hidden="true">${owner.token}</span>` : '') +
        (here.length ? `<span class="pg-toks">${here.map((p) => `<span class="${p.id === moving ? 'hop' : ''}">${p.token}</span>`).join('')}</span>` : '');
      el.classList.toggle('has-tok', here.length > 0);
      el.classList.toggle('here', !cur.out && cur.pos === s.i);
    }
  }
  function renderPlayers() {
    const g = game;
    const r = $('.pg-round');
    if (!r) return;
    r.textContent = g.round >= g.rounds ? `Last round! (${g.rounds} of ${g.rounds})` : `Round ${g.round} of ${g.rounds}`;
    r.classList.toggle('last', g.round >= g.rounds);
    $('.pg-players').innerHTML = g.players.map((p) => {
      const props = g.sq.filter((s) => s.owner === p.id);
      return `<div class="pg-pl ${p.id === g.turn && !g.over ? 'cur' : ''} ${p.out ? 'out' : ''}" style="--pc:var(--${p.color})">
        ${tok(p)}<div class="pg-pl-main"><span class="pg-pl-name">${esc(p.name)}${p.ai ? ` <span class="pg-tag">${LEVELS[p.ai].label}</span>` : ''}${p.nap ? ' 😴' : ''}</span>
        <span class="pg-pl-coins">${p.out ? '<span class="pg-tag">Out</span>' : `${p.coins}${COIN}`}</span>
        ${props.length ? `<span class="pg-pl-props" aria-label="${props.length} places">${props.map((s) => `<i class="${s.house ? 'h' : ''}" style="--gc:${s.color}" title="${esc(s.name)}"></i>`).join('')}</span>` : ''}</div></div>`;
    }).join('');
    const p = g.players[g.turn];
    $('.pg-who').innerHTML = `${tok(p)}<span>${esc(p.name)}'s turn · ${p.coins}${COIN}</span>`;
  }
  function setMsg(text, math = '', opts = {}) {
    const m = $('.pg-msg');
    if (!m) return;
    m.textContent = text;
    m.className = `pg-msg ${opts.card ? 'card' : ''} ${opts.tone === 'happy' ? 'happy' : ''}`;
    $('.pg-math').textContent = math;
    fit();
  }
  // In a small board with big system fonts the middle can overflow: drop the dice pictures first.
  function fit() {
    const c = $('.pg-center');
    if (!c) return;
    c.classList.remove('tight');
    if (c.scrollHeight > c.clientHeight + 1) c.classList.add('tight');
  }
  function choose(buttons) {
    $('.pg-acts').innerHTML = buttons.map((b, k) => `<button class="toy ${b.cls || 'toy-sun'}" data-v="${k}">${b.label}</button>`).join('');
    fit();
    return new Promise((res) => { pending = (k) => { pending = null; $('.pg-acts').innerHTML = ''; res(buttons[k].v); }; });
  }
  const sayTime = (text) => Math.min(2800, 900 + text.length * 22);

  const io = {
    async turnStart(p) {
      renderPlayers(); renderSquares();
      $('.pg-sum').textContent = '';
      root.querySelectorAll('.pg-die').forEach((d) => { d.style.opacity = '.45'; });
      setMsg(p.ai ? `${p.name} is thinking…` : `${p.name}'s turn!`);
    },
    pause: () => sleep(700),
    async preRoll(p, builds) {
      setMsg(game.vsComputer ? `Your turn, ${p.name}!` : `${p.name}'s turn!`, builds.length ? 'You can build a house!' : '');
      const acts = [{ v: 'roll', label: '🎲 Roll', cls: 'toy-sun pg-roll' }];
      if (builds.length) acts.push({ v: 'build', label: '🏠 Build', cls: 'toy-sky' });
      const v = await choose(acts);
      if (v !== 'build') return 'roll';
      setMsg('Build a house on which place? A house makes rent bigger.', `You have ${p.coins}`);
      const pick = await choose([...builds.map((s) => ({ v: s.i, label: `${s.e} ${esc(s.name)} <span style="white-space:nowrap">· ${s.houseCost}${COIN}</span>`, cls: 'toy-grass' })), { v: null, label: 'Back', cls: 'toy-small' }]);
      return pick;
    },
    async dice(p, d) {
      const dice = root.querySelectorAll('.pg-die');
      setMsg(`${p.name} rolls…`);
      dice.forEach((el) => { el.style.opacity = '1'; el.classList.add('spin'); });
      for (let k = 0; k < 8; k++) {
        dice.forEach((el) => { el.innerHTML = dieFace(1 + Math.floor(Math.random() * 6)); });
        await sleep(75);
      }
      dice.forEach((el, k) => { el.classList.remove('spin'); el.innerHTML = dieFace(d[k]); });
      $('.pg-sum').textContent = `${d[0]} + ${d[1]} = ${d[0] + d[1]}`;
      setMsg(`${p.name} hops ${d[0] + d[1]} squares.`);
      await sleep(650);
    },
    async hop(p) { renderSquares(p.id); await sleep(260); },
    async say(text, math = '', opts = {}) {
      setMsg(text, math, opts); renderPlayers(); renderSquares();
      await sleep(sayTime(text));
    },
    async ask(p, kind, s) {
      const left = p.coins - s.price;
      setMsg(`Buy the ${s.e} ${s.name} for ${s.price}?`, `${p.coins} − ${s.price} = ${left}`);
      return choose([{ v: true, label: `Buy ${s.price}${COIN}`, cls: 'toy-grass' }, { v: false, label: 'No thanks', cls: 'toy-small' }]);
    },
    async endTurn(p) {
      renderPlayers();
      if (p.ai || p.out) { await sleep(500); return; }
      await choose([{ v: 1, label: game.vsComputer ? 'OK 👍' : 'Next player ➜', cls: 'toy-sky' }]);
    },
    async newRound(r) {
      renderPlayers();
      if (r === game.rounds) await io.say('Last round! Make it count!');
    },
  };

  function showResults(rows) {
    const g = game;
    renderPlayers(); renderSquares();
    const winners = rows.filter((r) => r.win);
    const kidRow = rows.find((r) => r.p.id === 0);
    let head, big;
    if (winners.length > 1) { head = `It's a tie between ${winners.map((r) => esc(r.p.name)).join(' and ')}!`; big = '🤝'; }
    else if (g.vsComputer) { head = kidRow.win ? `You win, ${esc(kid.name)}!` : `${esc(winners[0].p.name)} wins this time!`; big = kidRow.win ? '🏆' : winners[0].p.token; }
    else { head = `${esc(winners[0].p.name)} wins!`; big = '🏆'; }
    if (g.vsComputer && kidRow.win) {
      const s = saved();
      const wins = { ...(s.wins || {}) };
      wins[lastSetup] = (wins[lastSetup] || 0) + 1;
      store({ wins });
    }
    const why = g.over === 'one' ? 'Only one player has coins left.' : g.over === 'kidout' ? 'You ran out of coins.' : `All ${g.rounds} rounds are done.`;
    const over = $('.pg-over');
    over.hidden = false;
    over.innerHTML = `<div class="pg-card" role="dialog" aria-label="Results">
      <div class="pg-big" aria-hidden="true">${big}</div>
      <p class="quiz-prompt">${head}</p>
      <p class="pg-sub">${why} Coins + places = total.</p>
      <ul class="pg-res">${rows.map((r) => `<li class="${r.win ? 'win' : ''}" style="--pc:var(--${r.p.color})">${tok(r.p)}
        <div class="pg-pl-main"><strong class="pg-pl-name">${r.win ? '👑 ' : ''}${esc(r.p.name)}</strong><span>${r.coins} + ${r.places} = ${r.total}</span></div><b>${r.total}${COIN}</b></li>`).join('')}</ul>
      <div class="row-center"><button class="toy toy-sun" data-again>Play again</button><button class="toy toy-sky" data-change>Change players</button></div>
    </div>`;
    over.querySelector('[data-again]').focus({ preventScroll: true });
  }

  function infoFor(s) {
    if (s.k === 'start') return `Start: get ${game.rules.pass} coins every time you pass it.`;
    if (s.k === 'nap') return 'Nap time: land here and you skip your next turn.';
    if (s.k === 'surprise') return 'Surprise: pick a surprise card!';
    if (s.k === 'wish') return `Wishing Well: land here to find ${game.rules.wish} coins.`;
    if (s.k === 'free') return 'Picnic: a free rest spot.';
    const o = s.owner != null ? game.players[s.owner].name : null;
    return `${s.e} ${s.name}: costs ${s.price}, rent ${rentOf(game, s)}${game.houses ? `, house ${s.houseCost} (rent ${s.houseRent})` : ''}. ${o ? `Owned by ${o}.` : 'Nobody owns it yet.'}`;
  }

  function onClick(e) {
    const b = e.target.closest('button');
    if (!b || !root.contains(b)) return;
    const d = b.dataset;
    if (d.v != null && pending) return pending(+d.v);
    if (d.mode) { setup.mode = d.mode; return showSetup(); }
    if (d.bots) { setup.bots = +d.bots; return showSetup(); }
    if (d.friends) { setup.friends = +d.friends; return showSetup(); }
    if (d.start) return startGame(d.start);
    if (d.sq != null && game) return ctx.toast(infoFor(game.sq[+d.sq]));
    if (b.hasAttribute('data-again')) return startGame(lastSetup);
    if (b.hasAttribute('data-change')) return showSetup();
  }
  root.addEventListener('click', onClick);
  showSetup();

  return () => {
    dead = true;
    timers.forEach(clearTimeout); timers.clear();
    pending = null; game = null;
    root.removeEventListener('click', onClick);
  };
}
