import { db, uid } from './db.js';
import { makePage, pageFromId, svgUrl, THEMES } from './generator.js';
import { Painter, TOOLS } from './paint.js';
import { makeQuestion } from './challenge.js';
import * as CK from './checkers.js';

const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const AVATARS = ['🦊', '🐼', '🦄', '🐯', '🐸', '🐙', '🦖', '🐰', '🐵', '🦁', '🐧', '🐝', '🚀', '🌈', '⭐', '🌻'];
const KID_COLORS = ['#ff5a4e', '#ff9f1c', '#f5c400', '#2fb67c', '#16b5c4', '#3a8dff', '#8c5cf5', '#ff6fae'];
const PALETTE = [
  '#e63946', '#ff7b00', '#ffd000', '#9bd93c', '#2a9d3f', '#00b4d8', '#1e5bff', '#7b2ff7',
  '#ff70a6', '#8b5a2b', '#000000', '#7d7d7d', '#ffffff', '#f9d7b9', '#d9a37c', '#7a4a2c',
];

const S = {
  settings: { pinHash: null, lock: false, quiz: 'mix', quizSongs: false, liftTip: true },
  profiles: [],
  kid: null,
  stack: [],
  view: null,
  locked: false,
  wake: null,
  audio: new Audio(),
  queue: [],
  qIdx: -1,
  seedBase: Math.floor(Math.random() * 100000),
  painter: null,
  urls: [],
  installEvt: null,
};

// ---------- helpers ----------
function hashPin(pin) {
  let h = 5381;
  for (const ch of 'kidview:' + pin) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
  return h.toString(16);
}
const saveSettings = () => db.put('kv', S.settings, 'settings');
const saveProfiles = () => db.put('kv', S.profiles, 'profiles');
function objUrl(blob) { const u = URL.createObjectURL(blob); S.urls.push(u); return u; }
function freeUrls() { S.urls.forEach((u) => URL.revokeObjectURL(u)); S.urls = []; }
function toast(msg, ms = 2400) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), ms);
}
const avatar = (p, cls = '') => `<span class="avatar ${cls}" style="--kid:${p.color}">${esc(p.avatar)}</span>`;
const prettyName = (file) => file.name.replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' ').trim();
const fmtTime = (s) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '');
const forKid = (m, kid) => !m.kids || m.kids.includes(kid.id);

// ---------- modal + pin pad ----------
function modal(html, cls = '') {
  const m = $('#modal');
  m.innerHTML = `<div class="sheet ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  m.hidden = false;
  return m.firstElementChild;
}
function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; }

function pinPad(title, sub = '') {
  return new Promise((resolve) => {
    let val = '';
    const el = modal(`
      <h2 class="sheet-title">${esc(title)}</h2>
      ${sub ? `<p class="sheet-sub">${esc(sub)}</p>` : ''}
      <div class="pin-dots" aria-live="polite">${'<i></i>'.repeat(4)}</div>
      <div class="pin-grid">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="pin-key" data-k="${n}">${n}</button>`).join('')}
        <button class="pin-key pin-ghost" data-k="x">Cancel</button>
        <button class="pin-key" data-k="0">0</button>
        <button class="pin-key pin-ghost" data-k="b" aria-label="Delete">⌫</button>
      </div>`, 'pin-sheet');
    const dots = [...el.querySelectorAll('.pin-dots i')];
    el.addEventListener('click', (e) => {
      const k = e.target.closest('[data-k]')?.dataset.k;
      if (!k) return;
      if (k === 'x') { closeModal(); resolve(null); return; }
      if (k === 'b') val = val.slice(0, -1);
      else if (val.length < 4) val += k;
      dots.forEach((d, i) => d.classList.toggle('on', i < val.length));
      if (val.length === 4) setTimeout(() => { closeModal(); resolve(val); }, 120);
    });
  });
}
async function askPin(title = 'Grown-ups only') {
  if (!S.settings.pinHash) return true;
  const v = await pinPad(title, 'Enter the parent PIN');
  if (v === null) return false;
  if (hashPin(v) === S.settings.pinHash) return true;
  toast('That PIN is not right. Try again.');
  return false;
}
async function choosePin() {
  const a = await pinPad('Choose a parent PIN', 'Four numbers. Kids will need it to leave locked mode.');
  if (a === null) return false;
  const b = await pinPad('Type the PIN again');
  if (b === null) return false;
  if (a !== b) { toast('The two PINs did not match. Try again.'); return choosePin(); }
  S.settings.pinHash = hashPin(a);
  await saveSettings();
  return true;
}
function confirmBox(title, sub, yes = 'Yes', danger = false) {
  return new Promise((resolve) => {
    const el = modal(`<h2 class="sheet-title">${esc(title)}</h2><p class="sheet-sub">${esc(sub)}</p>
      <div class="row-end"><button class="btn" data-c="0">Cancel</button><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-c="1">${esc(yes)}</button></div>`);
    el.addEventListener('click', (e) => {
      const c = e.target.closest('[data-c]')?.dataset.c;
      if (c === undefined) return;
      closeModal(); resolve(c === '1');
    });
  });
}

// A math or spelling question the kid answers before a video starts.
function quiz(kid) {
  return new Promise((resolve) => {
    const q = makeQuestion(kid.age, S.settings.quiz);
    let built = [];
    const el = modal(`
      <p class="quiz-prompt">${esc(q.prompt)}</p>
      ${q.picture ? `<div class="quiz-pic ${q.kind === 'math' ? 'quiz-count' : ''}">${esc(q.picture)}</div>` : ''}
      ${q.kind === 'missing' ? `<div class="quiz-word">${[...q.word].map((ch, i) => i === q.gap ? '<span class="gap">?</span>' : `<span>${esc(ch)}</span>`).join('')}</div>` : ''}
      ${q.kind === 'build' ? `<div class="quiz-word slots">${[...q.word].map(() => '<span class="slot"></span>').join('')}</div>` : ''}
      <div class="quiz-options ${q.kind === 'build' ? 'tiles' : ''}">
        ${(q.kind === 'build' ? q.tiles : q.options).map((o, i) => `<button class="toy quiz-opt ${['toy-sun', 'toy-sky', 'toy-grass', 'toy-tomato'][i % 4]}" data-o="${esc(o)}" data-i="${i}">${esc(o)}</button>`).join('')}
      </div>
      <button class="btn btn-quiet quiz-skip" data-skip>Not now</button>`, 'quiz-sheet');
    const done = (ok) => { closeModal(); resolve(ok); };
    const wrong = () => {
      el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
      toast('Almost! Try again.', 1400);
    };
    const win = () => {
      el.innerHTML = `<div class="quiz-win"><div class="quiz-pic">🎉</div><p class="quiz-prompt">Great job, ${esc(kid.name)}!</p></div>`;
      setTimeout(() => done(true), 900);
    };
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-skip]')) return done(false);
      const slot = e.target.closest('.slot.filled');
      if (slot) {
        const idx = [...el.querySelectorAll('.slot')].indexOf(slot);
        const removed = built.splice(idx);
        removed.forEach((r) => { el.querySelector(`.quiz-opt[data-i="${r.i}"]`).disabled = false; });
        paintSlots();
        return;
      }
      const b = e.target.closest('.quiz-opt');
      if (!b || b.disabled) return;
      if (q.kind !== 'build') return b.dataset.o === q.answer ? win() : wrong();
      built.push({ ch: b.dataset.o, i: b.dataset.i });
      b.disabled = true;
      paintSlots();
      if (built.length === q.word.length) {
        if (built.map((x) => x.ch).join('') === q.word) win();
        else setTimeout(() => {
          wrong();
          built.forEach((r) => { el.querySelector(`.quiz-opt[data-i="${r.i}"]`).disabled = false; });
          built = []; paintSlots();
        }, 350);
      }
    });
    function paintSlots() {
      el.querySelectorAll('.slot').forEach((s, i) => { s.textContent = built[i]?.ch || ''; s.classList.toggle('filled', !!built[i]); });
    }
  });
}

function kidForm(p) {
  const isNew = !p;
  p = p || { id: uid(), name: '', age: 5, avatar: AVATARS[S.profiles.length % AVATARS.length], color: KID_COLORS[S.profiles.length % KID_COLORS.length], fav: [] };
  return new Promise((resolve) => {
    const el = modal(`
      <h2 class="sheet-title">${isNew ? 'Add a kid' : 'Edit ' + esc(p.name)}</h2>
      <form id="kidform" class="form">
        <label for="kf-name">Name</label>
        <input id="kf-name" name="name" maxlength="20" required value="${esc(p.name)}" autocomplete="off">
        <label for="kf-age">Age (sets how detailed coloring pages are)</label>
        <select id="kf-age" name="age">${[2, 3, 4, 5, 6, 7, 8, 9, 10].map((a) => `<option ${a === p.age ? 'selected' : ''}>${a}</option>`).join('')}</select>
        <span class="label">Picture</span>
        <div class="choice-grid">${AVATARS.map((a) => `<button type="button" class="choice ${a === p.avatar ? 'on' : ''}" data-av="${a}">${a}</button>`).join('')}</div>
        <span class="label">Color</span>
        <div class="choice-grid">${KID_COLORS.map((c) => `<button type="button" class="choice swatch ${c === p.color ? 'on' : ''}" data-col="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join('')}</div>
        <div class="row-end"><button type="button" class="btn" data-cancel>Cancel</button><button class="btn btn-primary">${isNew ? 'Add' : 'Save'}</button></div>
      </form>`);
    el.addEventListener('click', (e) => {
      const av = e.target.closest('[data-av]'), col = e.target.closest('[data-col]');
      if (av) { p.avatar = av.dataset.av; el.querySelectorAll('[data-av]').forEach((b) => b.classList.toggle('on', b === av)); }
      if (col) { p.color = col.dataset.col; el.querySelectorAll('[data-col]').forEach((b) => b.classList.toggle('on', b === col)); }
      if (e.target.closest('[data-cancel]')) { closeModal(); resolve(null); }
    });
    $('#kidform').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      p.name = String(f.get('name')).trim() || 'Kid';
      p.age = +f.get('age');
      if (isNew) S.profiles.push(p);
      await saveProfiles();
      closeModal(); resolve(p);
    });
  });
}

// ---------- navigation ----------
function go(view, params = {}, push = true) {
  leaveView();
  if (push && S.view) S.stack.push(S.view);
  S.view = { name: view, params };
  render();
}
function back() {
  if (S.view?.name === 'home') { if (!S.locked) exitKidMode(); return; }
  if (S.view?.name === 'checkers' && S.ck) { if (S.ck.busy) return; S.ck = null; render(); return; }
  const prev = S.stack.pop();
  if (!prev) return;
  leaveView();
  S.view = prev;
  render();
}
function leaveView() {
  if (S.view?.name === 'paint' && S.painter) { saveArt(); }
  if (S.view?.name !== 'paint') S.painter = null;
  if (S.gameUnmount) { try { S.gameUnmount(); } catch {} S.gameUnmount = null; }
  freeUrls();
}

const VIEWS = {};
function render() {
  const v = S.view;
  document.body.dataset.view = v.name;
  app.innerHTML = VIEWS[v.name](v.params);
  VIEWS[v.name].after?.(v.params);
  renderChrome();
}

function renderChrome() {
  const badge = $('#lockbadge');
  badge.hidden = !(S.locked && S.kid);
  document.body.classList.toggle('locked', !badge.hidden);
  const np = $('#nowplaying');
  const song = S.queue[S.qIdx];
  np.hidden = !(S.kid && song && S.view.name !== 'songs' && S.view.name !== 'paint' && !S.audio.paused);
  if (!np.hidden) np.querySelector('.np-title').textContent = song.name;
}

// ---------- views ----------
VIEWS.welcome = () => `
  <section class="welcome">
    <div class="brand-mark" aria-hidden="true">${logoSvg()}</div>
    <h1 class="display">KidView</h1>
    <p class="lede">Videos, songs and coloring that you choose. Everything stays on this device and works without internet.</p>
    <ol class="steps">
      <li>Pick a parent PIN</li>
      <li>Add your kids</li>
      <li>Add videos and songs from this device</li>
    </ol>
    <button class="toy toy-big toy-sun" data-act="setup">Set up KidView</button>
  </section>`;

VIEWS.profiles = () => `
  <header class="bar"><h1 class="display bar-title">Who's playing?</h1></header>
  <section class="kids">
    ${S.profiles.map((p) => `
      <button class="kid-card" data-act="pickKid" data-id="${p.id}" style="--kid:${p.color}">
        ${avatar(p, 'avatar-xl')}<span class="kid-name">${esc(p.name)}</span>
      </button>`).join('')}
    ${S.profiles.length ? '' : `<p class="empty">No kids yet. Tap Grown-ups to add one.</p>`}
  </section>
  <footer class="foot"><button class="btn btn-quiet" data-act="parent">${lockIcon()} Grown-ups</button></footer>`;

VIEWS.home = () => {
  const k = S.kid;
  return `
  <header class="bar">
    <button class="icon-btn" data-act="switchKid" aria-label="Switch kid">${avatar(k)}</button>
    <h1 class="display bar-title">Hi, ${esc(k.name)}!</h1>
    <span></span>
  </header>
  <section class="tiles">
    <button class="toy tile toy-tomato" data-act="nav" data-to="videos"><span class="tile-art">${tileArt('video')}</span><span class="tile-label">Watch</span></button>
    <button class="toy tile toy-sun" data-act="nav" data-to="coloring"><span class="tile-art">${tileArt('color')}</span><span class="tile-label">Color</span></button>
    <button class="toy tile toy-grass" data-act="nav" data-to="songs"><span class="tile-art">${tileArt('music')}</span><span class="tile-label">Songs</span></button>
    <button class="toy tile toy-sky" data-act="nav" data-to="games"><span class="tile-art">${tileArt('games')}</span><span class="tile-label">Games</span></button>
  </section>`;
};

const backBtn = `<button class="icon-btn toy-small" data-act="back" aria-label="Back">${arrowIcon()}</button>`;

VIEWS.videos = () => `
  <header class="bar">${backBtn}<h1 class="display bar-title">Watch</h1><span></span></header>
  <section id="vgrid" class="media-grid"><p class="empty">Loading videos…</p></section>`;
VIEWS.videos.after = async () => {
  const list = (await db.all('media')).filter((m) => m.type === 'video' && forKid(m, S.kid)).sort((a, b) => a.added - b.added);
  const g = $('#vgrid');
  if (!g) return;
  g.innerHTML = list.length ? list.map((m) => `
    <button class="video-card" data-act="playVideo" data-id="${m.id}">
      <span class="poster">${m.poster ? `<img src="${m.poster}" alt="">` : `<span class="poster-fallback">${playIcon()}</span>`}<span class="poster-play">${playIcon()}</span></span>
      <span class="video-title">${esc(m.name)}</span>
    </button>`).join('') : `<p class="empty">No videos yet. Ask a grown-up to add some.</p>`;
};

VIEWS.songs = ({ tab = 'all' } = {}) => `
  <header class="bar">${backBtn}<h1 class="display bar-title">Songs</h1><span></span></header>
  <nav class="tabs" role="tablist">
    <button class="tab ${tab === 'all' ? 'on' : ''}" data-act="songTab" data-tab="all">All songs</button>
    <button class="tab ${tab === 'mine' ? 'on' : ''}" data-act="songTab" data-tab="mine">${heartIcon(true)} My songs</button>
  </nav>
  <section id="slist" class="song-list"><p class="empty">Loading songs…</p></section>
  <div id="player" class="player"></div>`;
VIEWS.songs.after = async ({ tab = 'all' } = {}) => {
  const all = (await db.all('media')).filter((m) => m.type === 'song' && forKid(m, S.kid)).sort((a, b) => a.added - b.added);
  const fav = S.kid.fav || [];
  const list = tab === 'mine' ? all.filter((m) => fav.includes(m.id)) : all;
  S.songList = list;
  const el = $('#slist');
  if (!el) return;
  const cur = S.queue[S.qIdx];
  el.innerHTML = list.length ? list.map((m, i) => `
    <div class="song ${cur?.id === m.id ? 'playing' : ''}">
      <button class="song-play toy-small" data-act="playSong" data-i="${i}" aria-label="Play ${esc(m.name)}">${cur?.id === m.id && !S.audio.paused ? pauseIcon() : playIcon()}</button>
      <span class="song-title">${esc(m.name)}</span>
      <button class="heart ${fav.includes(m.id) ? 'on' : ''}" data-act="fav" data-id="${m.id}" aria-label="Save to my songs">${heartIcon(fav.includes(m.id))}</button>
    </div>`).join('')
    : `<p class="empty">${tab === 'mine' ? 'Tap a heart to save a song here.' : 'No songs yet. Ask a grown-up to add some.'}</p>`;
  renderPlayer();
};

function renderPlayer() {
  const el = $('#player');
  if (!el) return;
  const song = S.queue[S.qIdx];
  if (!song) { el.innerHTML = ''; el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = `
    <div class="pl-title">${esc(song.name)}</div>
    <div class="pl-bar"><i style="width:${S.audio.duration ? (S.audio.currentTime / S.audio.duration) * 100 : 0}%"></i></div>
    <div class="pl-ctrls">
      <button class="icon-btn" data-act="prevSong" aria-label="Previous">${skipIcon(true)}</button>
      <button class="icon-btn pl-main toy-small" data-act="toggleSong" aria-label="Play or pause">${S.audio.paused ? playIcon() : pauseIcon()}</button>
      <button class="icon-btn" data-act="nextSong" aria-label="Next">${skipIcon(false)}</button>
    </div>`;
}

VIEWS.coloring = ({ tab = 'new', age, theme = 'all' } = {}) => {
  age = age || S.kid.age;
  const themes = THEMES.filter((t) => !t.minAge || age >= t.minAge);
  if (!themes.find((t) => t.id === theme)) theme = 'all';
  const pages = tab === 'new' ? Array.from({ length: 11 }, (_, i) => makePage(age, S.seedBase + i, theme)) : [];
  return `
  <header class="bar">${backBtn}<h1 class="display bar-title">Color</h1><span></span></header>
  <nav class="tabs" role="tablist">
    <button class="tab ${tab === 'new' ? 'on' : ''}" data-act="colorTab" data-tab="new">New pages</button>
    <button class="tab ${tab === 'art' ? 'on' : ''}" data-act="colorTab" data-tab="art">My art</button>
  </nav>
  ${tab === 'new' ? `
  <div class="chips" aria-label="Age">
    <span class="chips-label">Age</span>
    ${[2, 3, 4, 5, 6, 7, 8, 9, 10].map((a) => `<button class="chip ${a === age ? 'on' : ''}" data-act="colorAge" data-age="${a}">${a}</button>`).join('')}
  </div>
  <div class="chips">${themes.map((t) => `<button class="chip ${t.id === theme ? 'on' : ''}" data-act="colorTheme" data-theme="${t.id}">${t.label}</button>`).join('')}</div>
  <section class="page-grid">
    <button class="page-card blank" data-act="openPage" data-page="blank"><span class="page-thumb blank-thumb">${brushIcon()}</span><span class="page-name">Blank page</span></button>
    ${pages.map((p) => `<button class="page-card" data-act="openPage" data-page="${p.id}"><img class="page-thumb" src="${svgUrl(p.svg)}" alt="${esc(p.title)} coloring page"><span class="page-name">${esc(p.title)}</span></button>`).join('')}
  </section>
  <div class="center"><button class="toy toy-sky" data-act="morePages">More pages</button></div>`
  : `<section id="artgrid" class="page-grid"><p class="empty">Loading your art…</p></section>`}`;
};
VIEWS.coloring.after = async ({ tab = 'new' } = {}) => {
  if (tab !== 'art') return;
  const art = (await db.byIndex('art', 'profileId', S.kid.id)).sort((a, b) => b.updated - a.updated);
  const g = $('#artgrid');
  if (!g) return;
  g.innerHTML = art.length ? art.map((a) => `
    <div class="page-card art-card">
      <button class="art-open" data-act="openPage" data-page="${esc(a.pageId)}"><img class="page-thumb" src="${objUrl(a.thumb)}" alt="Saved art"></button>
      <button class="art-del" data-act="delArt" data-id="${esc(a.id)}" aria-label="Delete this picture">×</button>
    </div>`).join('') : `<p class="empty">Pictures you color are saved here.</p>`;
};

const TOOL_ORDER = ['finger', 'brush', 'crayon', 'marker', 'fill', 'eraser'];
// ---------- games ----------
// Games other than checkers are self-contained modules in js/games (see CONTRACT.md).
const GAME_IDS = ['tictactoe', 'wordsearch', 'crossword', 'wordtiles', 'property'];
let gameMods = null;
async function loadGames() {
  if (!gameMods) {
    const res = await Promise.allSettled(GAME_IDS.map((id) => import(`./games/${id}.js`)));
    gameMods = res.filter((r) => r.status === 'fulfilled' && r.value.meta).map((r) => r.value);
  }
  return gameMods;
}
VIEWS.games = () => `
  <header class="bar">${backBtn}<h1 class="display bar-title">Games</h1><span></span></header>
  <section class="game-grid" id="game-grid">
    <button class="toy game-tile toy-sky" data-act="nav" data-to="checkers"><span class="tile-art">${tileArt('games')}</span><span class="game-name">Checkers</span><span class="game-blurb">Jump and crown your pieces</span></button>
  </section>`;
VIEWS.games.after = async () => {
  const mods = await loadGames();
  const grid = $('#game-grid');
  if (!grid) return;
  grid.insertAdjacentHTML('beforeend', mods.map((m) => `
    <button class="toy game-tile toy-${m.meta.color || 'sun'}" data-act="openGame" data-id="${m.meta.id}">
      <span class="tile-art">${m.icon || ''}</span><span class="game-name">${esc(m.meta.title)}</span><span class="game-blurb">${esc(m.meta.blurb)}</span>
    </button>`).join(''));
};
VIEWS.game = ({ id }) => {
  const m = (gameMods || []).find((g) => g.meta.id === id);
  return `<header class="bar">${backBtn}<h1 class="display bar-title">${esc(m?.meta.title || '')}</h1><span></span></header>
  <div id="game-root" class="game-root"></div>`;
};
VIEWS.game.after = ({ id }) => {
  const m = (gameMods || []).find((g) => g.meta.id === id);
  if (!m) return;
  const kid = S.kid;
  S.gameUnmount = m.mount($('#game-root'), {
    kid: { id: kid.id, name: kid.name, age: kid.age },
    toast, esc, back,
    save: (k, v) => { kid.games = { ...(kid.games || {}), [k]: v }; saveProfiles(); },
    load: (k) => (kid.games || {})[k] ?? null,
  });
};

// ---------- checkers ----------
const CK_NAMES = { r: 'Red', b: 'Yellow' };
VIEWS.checkers = () => {
  const g = S.ck;
  if (!g) {
    const wins = S.kid.ckWins || {};
    return `
  <header class="bar">${backBtn}<h1 class="display bar-title">Checkers</h1><span></span></header>
  <p class="ck-ask">Who do you want to play?</p>
  <section class="ck-levels">
    ${Object.entries(CK.LEVELS).map(([id, l], i) => `
      <button class="toy ck-level ${['toy-grass', 'toy-sun', 'toy-tomato'][i]}" data-act="ckStart" data-mode="${id}">
        <span class="ck-bot">${botFace(i)}</span>
        <span class="ck-level-name">${l.label}</span>
        <span class="ck-level-blurb">${l.blurb}</span>
        ${wins[id] ? `<span class="ck-wins">You won ${wins[id]} time${wins[id] === 1 ? '' : 's'}</span>` : ''}
      </button>`).join('')}
    <button class="toy ck-level toy-sky" data-act="ckStart" data-mode="friend">
      <span class="ck-bot">${friendFace()}</span>
      <span class="ck-level-name">A friend</span>
      <span class="ck-level-blurb">Take turns on this device</span>
    </button>
  </section>`;
  }
  return `
  <header class="bar">${backBtn}<h1 class="display bar-title">Checkers</h1>
    <button class="icon-btn" data-act="ckUndo" aria-label="Undo">${undoIcon()}</button></header>
  <div class="ck-wrap">
    <p class="ck-status" id="ck-status" aria-live="polite"></p>
    <div class="ck-board" id="ck-board" role="grid" aria-label="Checkers board"></div>
    <p class="ck-score" id="ck-score"></p>
    <div class="ck-over" id="ck-over" hidden></div>
  </div>`;
};
VIEWS.checkers.after = () => { if (S.ck) ckRender(); };

function ckNewGame(mode) {
  S.ck = { mode, board: CK.newBoard(), turn: CK.RED, partial: [], history: [], over: null, busy: false };
}
const ckVsComputer = () => S.ck.mode !== 'friend';
function ckCandidates() {
  const g = S.ck;
  const moves = CK.legalMoves(g.board, g.turn);
  return g.partial.length ? moves.filter((m) => g.partial.every((sq, k) => m.path[k] === sq)) : moves;
}
function ckDisplayBoard(move, steps) {
  const g = S.ck;
  if (!move || steps < 1) return g.board;
  return CK.applyMove(g.board, { path: move.path.slice(0, steps + 1), caps: move.caps.slice(0, steps) });
}
function ckRender(animMove = null, animSteps = 0) {
  const g = S.ck;
  const el = $('#ck-board');
  if (!el) return;
  const cands = animMove ? [] : ckCandidates();
  const showing = animMove ? ckDisplayBoard(animMove, animSteps) : ckDisplayBoard(cands[0], g.partial.length - 1);
  const targets = new Set(g.partial.length ? cands.map((m) => m.path[g.partial.length]) : []);
  const mustJump = !animMove && !g.partial.length && cands[0]?.caps.length ? new Set(cands.map((m) => m.path[0])) : new Set();
  const selected = g.partial[g.partial.length - 1];
  let html = '';
  for (let i = 0; i < 64; i++) {
    const dark = ((i >> 3) + (i & 7)) % 2 === 1;
    const p = showing[i];
    const cls = ['ck-sq', dark ? 'dark' : 'light', targets.has(i) ? 'target' : '', i === selected && !animMove ? 'sel' : ''].join(' ');
    html += `<button class="${cls}" data-act="ckSq" data-i="${i}" ${dark ? '' : 'tabindex="-1"'} aria-label="${p ? CK_NAMES[p.toLowerCase()] + (p === p.toUpperCase() ? ' king' : '') : dark ? 'empty' : ''}">${p ? `<span class="ck-piece ${p.toLowerCase() === 'r' ? 'red' : 'yel'} ${mustJump.has(i) ? 'must' : ''}">${p === p.toUpperCase() ? crownIcon() : ''}</span>` : ''}</button>`;
  }
  el.innerHTML = html;
  const vs = ckVsComputer();
  const status = $('#ck-status');
  if (g.over) status.textContent = '';
  else if (g.busy) status.innerHTML = `${dot('yel')} Thinking…`;
  else if (vs) status.innerHTML = `${dot('red')} Your turn${mustJump.size ? '. You have to jump!' : ''}`;
  else status.innerHTML = `${dot(g.turn === 'r' ? 'red' : 'yel')} ${CK_NAMES[g.turn]}'s turn${mustJump.size ? '. Jump!' : ''}`;
  $('#ck-score').innerHTML = `${dot('red')} ${vs ? 'You' : 'Red'}: ${CK.countPieces(g.board, 'r')} &nbsp; ${dot('yel')} ${vs ? CK.LEVELS[g.mode].label + ' computer' : 'Yellow'}: ${CK.countPieces(g.board, 'b')}`;
  const over = $('#ck-over');
  over.hidden = !g.over;
  if (g.over) {
    const youWon = g.over === 'r';
    over.innerHTML = `<div class="ck-over-card">
      <div class="quiz-pic">${vs ? (youWon ? '🏆' : '🤖') : '🎉'}</div>
      <p class="quiz-prompt">${vs ? (youWon ? `You win, ${esc(S.kid.name)}!` : 'The computer won this time.') : `${CK_NAMES[g.over]} wins!`}</p>
      <div class="row-center"><button class="toy toy-sun" data-act="ckAgain">Play again</button><button class="toy toy-sky" data-act="ckLevels">${vs ? 'Change level' : 'Back'}</button></div>
    </div>`;
  }
}
const dot = (c) => `<i class="ck-dot ${c}"></i>`;

function ckCommit(move) {
  const g = S.ck;
  g.history.push({ board: g.board, turn: g.turn });
  g.board = CK.applyMove(g.board, move);
  g.turn = g.turn === 'r' ? 'b' : 'r';
  g.partial = [];
  if (!CK.legalMoves(g.board, g.turn).length) {
    g.over = g.turn === 'r' ? 'b' : 'r';
    if (ckVsComputer() && g.over === 'r') {
      S.kid.ckWins = { ...(S.kid.ckWins || {}), [g.mode]: ((S.kid.ckWins || {})[g.mode] || 0) + 1 };
      saveProfiles();
    }
  }
  ckRender();
  if (!g.over && ckVsComputer() && g.turn === 'b') ckComputerTurn();
}
async function ckComputerTurn() {
  const g = S.ck;
  g.busy = true;
  ckRender();
  await new Promise((r) => setTimeout(r, 450));
  const move = CK.computerMove(g.board, 'b', g.mode);
  for (let k = 1; k < move.path.length; k++) {
    if (S.ck !== g) return;
    ckRender(move, k);
    await new Promise((r) => setTimeout(r, 380));
  }
  if (S.ck !== g) return;
  g.busy = false;
  ckCommit(move);
}
function ckTap(i) {
  const g = S.ck;
  if (!g || g.busy || g.over || (ckVsComputer() && g.turn !== 'r')) return;
  const moves = CK.legalMoves(g.board, g.turn);
  const mine = g.board[i] && g.board[i].toLowerCase() === g.turn;
  if (mine && g.partial.length <= 1) {
    if (moves.some((m) => m.path[0] === i)) g.partial = [i];
    else { g.partial = []; toast(moves[0]?.caps.length ? 'You have to jump! Try a glowing piece.' : "That piece can't move right now.", 1800); }
    return ckRender();
  }
  if (!g.partial.length) return;
  const next = ckCandidates().filter((m) => m.path[g.partial.length] === i);
  if (!next.length) return;
  g.partial.push(i);
  const done = next.find((m) => m.path.length === g.partial.length);
  if (done) ckCommit(done);
  else ckRender();
}

VIEWS.paint = () => `
  <div class="paint-layout">
    <header class="paint-top">
      <button class="icon-btn toy-small" data-act="back" aria-label="Done">${arrowIcon()}</button>
      <div class="paint-actions">
        <button class="icon-btn" data-act="undo" aria-label="Undo">${undoIcon()}</button>
        <button class="icon-btn" data-act="clearPaint" aria-label="Start over">${trashIcon()}</button>
        <button class="icon-btn lift-btn ${S.settings.liftTip ? 'on' : ''}" data-act="liftTip" aria-pressed="${S.settings.liftTip}" aria-label="Show the tip above my finger" title="Show the tip above my finger">${liftIcon()}</button>
      </div>
      <span class="saved" id="saved">Saved</span>
    </header>
    <div class="paint-stage"><div id="canvas" class="canvas-box"></div></div>
    <div class="paint-tools" role="toolbar" aria-label="Tools">
      ${TOOL_ORDER.map((t) => `<button class="tool ${t === 'finger' ? 'on' : ''}" data-act="tool" data-tool="${t}" aria-label="${TOOLS[t].label}" title="${TOOLS[t].label}">${toolIcon(t)}<span>${TOOLS[t].label}</span></button>`).join('')}
      <div class="sizes">${[0, 1, 2].map((i) => `<button class="size ${i === 1 ? 'on' : ''}" data-act="size" data-size="${i}" aria-label="Size ${i + 1}"><i style="--d:${8 + i * 9}px"></i></button>`).join('')}</div>
    </div>
    <div class="palette" role="radiogroup" aria-label="Colors">
      ${PALETTE.map((c, i) => `<button class="color ${i === 0 ? 'on' : ''}" data-act="color" data-color="${c}" style="--c:${c}" aria-label="Color ${c}"></button>`).join('')}
      <button class="color rainbow" data-act="color" data-color="rainbow" aria-label="Rainbow"></button>
    </div>
  </div>`;
VIEWS.paint.after = async ({ pageId }) => {
  const host = $('#canvas');
  const savedEl = $('#saved');
  S.painter = new Painter(host, {
    onChange: () => {
      savedEl.textContent = 'Saving…';
      clearTimeout(S.saveTimer);
      S.saveTimer = setTimeout(saveArt, 1200);
    },
  });
  S.painter.pageId = pageId;
  S.painter.setColor(PALETTE[0]);
  S.painter.setLift(S.settings.liftTip);
  const rec = await db.get('art', `${S.kid.id}:${pageId}`);
  const svg = pageId.startsWith('blank') ? null : pageFromId(pageId).svg;
  await S.painter.load(svg, rec?.paint);
  sizeCanvas();
};
function sizeCanvas() {
  const stage = $('.paint-stage');
  const box = $('#canvas');
  if (!stage || !box) return;
  const s = Math.floor(Math.min(stage.clientWidth, stage.clientHeight));
  box.style.width = box.style.height = s + 'px';
}
window.addEventListener('resize', sizeCanvas);

async function saveArt() {
  const P = S.painter;
  if (!P || !S.kid) return;
  clearTimeout(S.saveTimer);
  const [paint, thumb] = await Promise.all([P.exportPaint(), P.exportImage(360)]);
  await db.put('art', { id: `${S.kid.id}:${P.pageId}`, profileId: S.kid.id, pageId: P.pageId, paint, thumb, updated: Date.now() });
  const el = $('#saved');
  if (el) el.textContent = 'Saved';
}

VIEWS.parent = () => `
  <header class="bar">
    <button class="btn" data-act="exitParent">${arrowIcon()} Done</button>
    <h1 class="display bar-title">Grown-ups</h1><span></span>
  </header>
  <div class="parent">
    <section class="panel">
      <div class="panel-head"><h2>Kids</h2><button class="btn btn-primary" data-act="addKid">Add a kid</button></div>
      <ul class="rows">${S.profiles.map((p) => `
        <li class="row">${avatar(p)}<span class="row-main"><b>${esc(p.name)}</b><small>Age ${p.age}</small></span>
          <button class="btn" data-act="editKid" data-id="${p.id}">Edit</button>
          <button class="btn btn-quiet" data-act="delKid" data-id="${p.id}">Remove</button></li>`).join('') || '<li class="empty">Add your first kid.</li>'}</ul>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Videos</h2><label class="btn btn-primary file-btn">Add videos<input type="file" id="add-video" accept="video/*" multiple data-type="video"></label></div>
      <p class="hint">Pick video files saved on this device (for example, ones you downloaded or recorded). Kids only see what you add here.</p>
      <ul class="rows" id="list-video"></ul>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Songs</h2><label class="btn btn-primary file-btn">Add songs<input type="file" id="add-song" accept="audio/*" multiple data-type="song"></label></div>
      <p class="hint">Pick music files saved on this device. Kids can save the ones they love to "My songs".</p>
      <ul class="rows" id="list-song"></ul>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Screen lock</h2>
        <label class="switch"><input type="checkbox" id="lock-toggle" ${S.settings.lock ? 'checked' : ''}><span></span><span class="sr">Screen lock</span></label></div>
      <p>When on, KidView goes full screen, keeps the screen awake, ignores the back button, and asks for your PIN before a kid can leave or switch profiles. To unlock, press and hold the lock in the corner.</p>
      ${kidLock ? '<p><b>In the KidView Android app, screen lock also pins the app</b>, so the Home and Recents buttons and notifications can\'t take a kid out. Android asks once to confirm pinning.</p>' : ''}
      <details class="how">
        <summary>Block calls and the home button too</summary>
        <p>A web app can't stop the phone's own buttons or incoming calls. Your phone has a built-in feature that can:</p>
        <h3>iPhone and iPad: Guided Access</h3>
        <ol><li>Open Settings, then Accessibility, then Guided Access, and turn it on. Set a passcode.</li>
        <li>Open KidView and triple-click the side (or Home) button, then tap Start.</li>
        <li>Triple-click again and enter the passcode to finish.</li></ol>
        <h3>Android: App pinning</h3>
        <ol><li>Open Settings, then Security (or Security and privacy, then More), then App pinning, and turn it on. Turn on "Ask for PIN before unpinning".</li>
        <li>Open KidView, open the recent apps view, tap the KidView icon at the top of its card, then tap Pin.</li>
        <li>To unpin, hold Back and Overview (or swipe up and hold), then enter your PIN.</li></ol>
        <p>To stop calls and messages from popping up, also turn on Airplane mode or Do Not Disturb. Downloaded videos and songs still play offline.</p>
      </details>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Learning questions</h2></div>
      <p>Before a video starts, your kid answers a quick question that matches their age: counting and adding for little ones, times tables and longer words for older kids.</p>
      <div class="form">
        <label for="quiz-mode">Ask before each video</label>
        <select id="quiz-mode">${[['off', 'Off'], ['math', 'Math questions'], ['spell', 'Spelling words'], ['mix', 'Math and spelling']].map(([v, l]) => `<option value="${v}" ${S.settings.quiz === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
        <label class="check"><input type="checkbox" id="quiz-songs" ${S.settings.quizSongs ? 'checked' : ''}> Also ask before songs</label>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Parent PIN</h2><button class="btn" data-act="changePin">Change PIN</button></div>
      <p class="hint">Forgot it? Clearing this site's data in the browser settings resets KidView, including the PIN, kids and files.</p>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Storage</h2>${S.installEvt ? '<button class="btn" data-act="install">Install app</button>' : ''}</div>
      <p id="storage" class="hint">Checking space…</p>
      <p class="hint">To add KidView to the home screen: on iPhone or iPad tap Share, then Add to Home Screen. On Android tap the browser menu, then Install app.</p>
    </section>
  </div>`;
VIEWS.parent.after = async () => {
  await renderMediaRows();
  try {
    const persisted = await navigator.storage?.persist?.();
    const est = await navigator.storage?.estimate?.();
    if (est) $('#storage').textContent = `Using ${(est.usage / 1e6).toFixed(0)} MB of about ${(est.quota / 1e9).toFixed(1)} GB available.${persisted ? ' Files are protected from automatic cleanup.' : ''}`;
  } catch { $('#storage').textContent = ''; }
};
async function renderMediaRows() {
  const media = (await db.all('media')).sort((a, b) => a.added - b.added);
  for (const type of ['video', 'song']) {
    const ul = $('#list-' + type);
    if (!ul) continue;
    const list = media.filter((m) => m.type === type);
    ul.innerHTML = list.length ? list.map((m) => `
      <li class="row media-row">
        ${type === 'video' ? `<span class="mini-poster">${m.poster ? `<img src="${m.poster}" alt="">` : playIcon()}</span>` : `<span class="mini-poster">${noteIcon()}</span>`}
        <span class="row-main">
          <input class="name-input" id="name-${m.id}" data-act-change="rename" data-id="${m.id}" value="${esc(m.name)}" aria-label="Title">
          <span class="who">${S.profiles.map((p) => `<button class="who-chip ${forKid(m, p) ? 'on' : ''}" data-act="toggleWho" data-id="${m.id}" data-kid="${p.id}" style="--kid:${p.color}">${esc(p.avatar)} ${esc(p.name)}</button>`).join('')}</span>
        </span>
        <button class="btn btn-quiet" data-act="delMedia" data-id="${m.id}">Remove</button>
      </li>`).join('') : `<li class="empty">Nothing added yet.</li>`;
  }
}

async function importFiles(files, type) {
  if (!files.length) return;
  toast(`Adding ${files.length} ${type === 'video' ? 'video' : 'song'}${files.length > 1 ? 's' : ''}…`, 60000);
  let n = 0;
  for (const f of files) {
    try {
      const rec = { id: uid(), type, name: prettyName(f), blob: f, mime: f.type, kids: null, added: Date.now() + n };
      if (type === 'video') Object.assign(rec, await videoPoster(f));
      await db.put('media', rec);
      n++;
    } catch (err) {
      console.error(err);
      toast(`Couldn't add ${f.name}. The device may be out of space.`);
    }
  }
  toast(`Added ${n} ${type === 'video' ? 'video' : 'song'}${n === 1 ? '' : 's'}.`);
  renderMediaRows();
}
function videoPoster(file) {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    const url = URL.createObjectURL(file);
    let done = false;
    const finish = (val) => { if (done) return; done = true; URL.revokeObjectURL(url); resolve(val); };
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
    v.onloadedmetadata = () => { v.currentTime = Math.min(2, (v.duration || 4) / 3); };
    v.onseeked = () => {
      try {
        const c = document.createElement('canvas');
        const w = 480, h = Math.round((w * (v.videoHeight || 270)) / (v.videoWidth || 480));
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(v, 0, 0, w, h);
        finish({ poster: c.toDataURL('image/jpeg', 0.7), duration: v.duration });
      } catch { finish({ poster: null, duration: v.duration }); }
    };
    v.onerror = () => finish({ poster: null });
    setTimeout(() => finish({ poster: null }), 6000);
  });
}

// ---------- kid mode + screen lock ----------
// In the Android app (Capacitor), the KidLock native plugin pins KidView with
// Android's lock task mode, which blocks Home, Recents and notifications.
const native = window.Capacitor?.isNativePlatform?.() ? window.Capacitor : null;
const kidLock = native ? (native.registerPlugin ? native.registerPlugin('KidLock') : native.Plugins?.KidLock) : null;
async function enterKidMode(kid) {
  S.kid = kid;
  if (S.settings.lock) await startLock();
  go('home');
}
async function startLock() {
  S.locked = true;
  if (kidLock) { try { await kidLock.start(); } catch {} }
  else { try { await document.documentElement.requestFullscreen?.({ navigationUI: 'hide' }); } catch {} }
  await keepAwake();
  history.pushState({ kv: 1 }, '');
}
async function keepAwake() {
  try { S.wake = await navigator.wakeLock?.request('screen'); } catch {}
}
async function exitKidMode() {
  S.audio.pause();
  S.queue = []; S.qIdx = -1;
  if (S.locked) {
    S.locked = false;
    try { S.wake?.release(); } catch {}
    if (kidLock) { try { await kidLock.stop(); } catch {} }
    if (document.fullscreenElement) try { await document.exitFullscreen(); } catch {}
  }
  S.kid = null;
  S.stack = [];
  go('profiles', {}, false);
}
document.addEventListener('fullscreenchange', () => {
  $('#refocus').hidden = !(S.locked && !kidLock && !document.fullscreenElement && document.fullscreenEnabled);
});
document.addEventListener('visibilitychange', () => { if (S.locked && document.visibilityState === 'visible') keepAwake(); });
window.addEventListener('popstate', () => {
  if (S.locked) { history.pushState({ kv: 1 }, ''); return; }
  if (S.stack.length) { history.pushState({ kv: 1 }, ''); back(); }
});
window.addEventListener('beforeunload', (e) => { if (S.locked) e.preventDefault(); });
document.addEventListener('contextmenu', (e) => { if (S.kid) e.preventDefault(); });
document.addEventListener('gesturestart', (e) => e.preventDefault());

// Press and hold the lock badge to reach the PIN pad.
(() => {
  const b = $('#lockbadge');
  let t = null;
  const start = (e) => {
    e.preventDefault();
    b.classList.add('holding');
    t = setTimeout(async () => {
      b.classList.remove('holding');
      if (await askPin('Unlock KidView')) exitKidMode();
    }, 1800);
  };
  const stop = () => { clearTimeout(t); b.classList.remove('holding'); };
  b.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, stop));
  $('#refocus').addEventListener('click', async () => {
    try { await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch {}
    $('#refocus').hidden = true;
  });
})();

// ---------- songs ----------
async function playQueue(list, i) {
  S.queue = list; S.qIdx = i;
  const m = list[i];
  if (!m) return;
  const rec = await db.get('media', m.id);
  if (S.audio.src) URL.revokeObjectURL(S.audio.src);
  S.audio.src = URL.createObjectURL(rec.blob);
  try { await S.audio.play(); } catch {}
  refreshSongs();
}
function refreshSongs() {
  if (S.view?.name === 'songs') VIEWS.songs.after(S.view.params);
  renderChrome();
}
S.audio.addEventListener('ended', () => {
  if (S.qIdx < S.queue.length - 1) playQueue(S.queue, S.qIdx + 1);
  else refreshSongs();
});
S.audio.addEventListener('timeupdate', () => {
  const bar = $('.pl-bar i');
  if (bar && S.audio.duration) bar.style.width = (S.audio.currentTime / S.audio.duration) * 100 + '%';
});
S.audio.addEventListener('pause', renderChrome);

// ---------- video player ----------
async function playVideo(id) {
  const m = await db.get('media', id);
  if (!m) return;
  if (S.settings.quiz !== 'off' && !(await quiz(S.kid))) return;
  S.audio.pause();
  const url = URL.createObjectURL(m.blob);
  const el = modal(`
    <video class="vplayer" src="${url}" controls autoplay playsinline controlslist="nodownload noremoteplayback" disablepictureinpicture></video>
    <button class="close-video toy-small" aria-label="Close video">×</button>`, 'video-sheet');
  const close = () => { URL.revokeObjectURL(url); closeModal(); };
  el.querySelector('.close-video').addEventListener('click', close);
}

// ---------- actions ----------
const ACT = {
  async setup() {
    if (!(await choosePin())) return;
    const p = await kidForm();
    go(p ? 'profiles' : 'profiles', {}, false);
  },
  pickKid({ id }) { const k = S.profiles.find((p) => p.id === id); if (k) enterKidMode(k); },
  async switchKid() {
    if (S.locked && !(await askPin('Switch kid'))) return;
    exitKidMode();
  },
  async parent() { if (await askPin()) go('parent'); },
  exitParent() { S.stack = []; go('profiles', {}, false); },
  nav({ to }) { go(to); },
  back() { back(); },
  songTab({ tab }) { S.view.params.tab = tab; render(); },
  colorTab({ tab }) { S.view.params.tab = tab; render(); },
  colorAge({ age }) { S.view.params.age = +age; render(); },
  colorTheme({ theme }) { S.view.params.theme = theme; render(); },
  morePages() { S.seedBase += 11; render(); app.scrollTo?.(0, 0); window.scrollTo(0, 0); },
  openPage({ page }) { go('paint', { pageId: page === 'blank' ? 'blank-' + uid() : page }); },
  async delArt({ id }) {
    if (!(await confirmBox('Delete this picture?', 'It will be gone for good.', 'Delete', true))) return;
    await db.del('art', id); render();
  },
  playVideo({ id }) { playVideo(id); },
  async playSong({ i }) {
    const m = S.songList[+i];
    if (S.queue[S.qIdx]?.id === m.id) return ACT.toggleSong();
    if (S.settings.quiz !== 'off' && S.settings.quizSongs && !(await quiz(S.kid))) return;
    playQueue(S.songList, +i);
  },
  toggleSong() { if (S.audio.paused) S.audio.play().catch(() => {}); else S.audio.pause(); setTimeout(refreshSongs, 50); },
  nextSong() { if (S.qIdx < S.queue.length - 1) playQueue(S.queue, S.qIdx + 1); },
  prevSong() { if (S.audio.currentTime > 3 || S.qIdx === 0) { S.audio.currentTime = 0; } else playQueue(S.queue, S.qIdx - 1); },
  async fav({ id }) {
    const k = S.kid; k.fav = k.fav || [];
    k.fav = k.fav.includes(id) ? k.fav.filter((x) => x !== id) : [...k.fav, id];
    await saveProfiles();
    VIEWS.songs.after(S.view.params);
  },
  tool({ tool }, el) {
    S.painter?.setTool(tool);
    document.querySelectorAll('.tool').forEach((b) => b.classList.toggle('on', b === el));
    $('.sizes').style.visibility = tool === 'fill' ? 'hidden' : '';
  },
  size({ size }, el) { S.painter?.setSize(+size); document.querySelectorAll('.size').forEach((b) => b.classList.toggle('on', b === el)); },
  color({ color }, el) {
    S.painter?.setColor(color);
    document.querySelectorAll('.color').forEach((b) => b.classList.toggle('on', b === el));
    document.documentElement.style.setProperty('--tip', color === 'rainbow' ? '#e63946' : color);
  },
  undo() { S.painter?.undo(); },
  async liftTip(_, el) {
    S.settings.liftTip = !S.settings.liftTip;
    S.painter?.setLift(S.settings.liftTip);
    el.classList.toggle('on', S.settings.liftTip);
    el.setAttribute('aria-pressed', S.settings.liftTip);
    toast(S.settings.liftTip ? 'The tip now draws just above your finger.' : 'Now it draws right under your finger.', 1800);
    await saveSettings();
  },
  async clearPaint() { if (await confirmBox('Start over?', 'This clears your colors. You can undo it.', 'Clear')) S.painter?.clear(); },
  async addKid() { await kidForm(); render(); },
  async editKid({ id }) { await kidForm(S.profiles.find((p) => p.id === id)); render(); },
  async delKid({ id }) {
    const p = S.profiles.find((x) => x.id === id);
    if (!(await confirmBox(`Remove ${p.name}?`, 'Their saved pictures will be deleted too.', 'Remove', true))) return;
    S.profiles = S.profiles.filter((x) => x.id !== id);
    await saveProfiles();
    for (const a of await db.byIndex('art', 'profileId', id)) await db.del('art', a.id);
    render();
  },
  async toggleWho({ id, kid }) {
    const m = await db.get('media', id);
    let kids = m.kids || S.profiles.map((p) => p.id);
    kids = kids.includes(kid) ? kids.filter((k) => k !== kid) : [...kids, kid];
    m.kids = S.profiles.every((p) => kids.includes(p.id)) ? null : kids;
    await db.put('media', m);
    renderMediaRows();
  },
  async delMedia({ id }) {
    const m = await db.get('media', id);
    if (!(await confirmBox(`Remove "${m.name}"?`, 'It will be deleted from KidView on this device.', 'Remove', true))) return;
    await db.del('media', id);
    for (const p of S.profiles) if (p.fav) p.fav = p.fav.filter((x) => x !== id);
    await saveProfiles();
    renderMediaRows();
  },
  async changePin() { if (await choosePin()) toast('PIN changed.'); },
  async install() { S.installEvt?.prompt(); S.installEvt = null; },
  npToggle() { ACT.toggleSong(); },
  openGame({ id }) { go('game', { id }); },
  ckStart({ mode }) { ckNewGame(mode); render(); },
  ckSq({ i }) { ckTap(+i); },
  ckAgain() { ckNewGame(S.ck.mode); render(); },
  ckLevels() { S.ck = null; render(); },
  ckUndo() {
    const g = S.ck;
    if (!g || g.busy || !g.history.length) return;
    let h = g.history.pop();
    if (ckVsComputer()) while (h.turn !== 'r' && g.history.length) h = g.history.pop();
    if (ckVsComputer() && h.turn !== 'r') return;
    Object.assign(g, { board: h.board, turn: h.turn, partial: [], over: null });
    ckRender();
  },
};

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]');
  if (!t || t.disabled) return;
  ACT[t.dataset.act]?.(t.dataset, t, e);
});
document.addEventListener('change', async (e) => {
  const t = e.target;
  if (t.matches('input[type=file][data-type]')) { await importFiles([...t.files], t.dataset.type); t.value = ''; }
  if (t.id === 'lock-toggle') { S.settings.lock = t.checked; await saveSettings(); toast(t.checked ? 'Screen lock is on. It starts when a kid picks their profile.' : 'Screen lock is off.'); }
  if (t.id === 'quiz-mode') { S.settings.quiz = t.value; await saveSettings(); }
  if (t.id === 'quiz-songs') { S.settings.quizSongs = t.checked; await saveSettings(); }
  if (t.dataset.actChange === 'rename') {
    const m = await db.get('media', t.dataset.id);
    m.name = t.value.trim() || m.name;
    await db.put('media', m);
  }
});
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); S.installEvt = e; });

// ---------- icons ----------
function logoSvg() {
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="8" y="8" width="104" height="104" rx="30" fill="var(--sun)"/><circle cx="44" cy="52" r="9" fill="var(--ink)"/><circle cx="76" cy="52" r="9" fill="var(--ink)"/><path d="M38 74 Q60 96 82 74" stroke="var(--ink)" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M8 38 Q30 20 60 26" stroke="var(--tomato)" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`;
}
function svg(inner, vb = '0 0 48 48') { return `<svg viewBox="${vb}" aria-hidden="true" class="ico">${inner}</svg>`; }
function arrowIcon() { return svg('<path d="M30 10 L16 24 L30 38" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'); }
function playIcon() { return svg('<path d="M16 10 L38 24 L16 38 Z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'); }
function pauseIcon() { return svg('<rect x="12" y="10" width="9" height="28" rx="3" fill="currentColor"/><rect x="27" y="10" width="9" height="28" rx="3" fill="currentColor"/>'); }
function skipIcon(prev) { return svg(`<g ${prev ? 'transform="matrix(-1 0 0 1 48 0)"' : ''}><path d="M10 12 L30 24 L10 36 Z" fill="currentColor"/><rect x="32" y="12" width="6" height="24" rx="2" fill="currentColor"/></g>`); }
function heartIcon(on) { return svg(`<path d="M24 40 C10 30 6 24 6 17 C6 11 11 7 16 7 C20 7 22 9 24 12 C26 9 28 7 32 7 C37 7 42 11 42 17 C42 24 38 30 24 40 Z" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>`); }
function lockIcon() { return svg('<rect x="10" y="22" width="28" height="20" rx="5" fill="currentColor"/><path d="M16 22 V16 a8 8 0 0 1 16 0 V22" fill="none" stroke="currentColor" stroke-width="5"/>'); }
function noteIcon() { return svg('<path d="M18 34 V10 L38 6 V30" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="13" cy="35" r="6" fill="currentColor"/><circle cx="33" cy="31" r="6" fill="currentColor"/>'); }
function undoIcon() { return svg('<path d="M14 18 H30 a10 10 0 0 1 0 20 H20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M20 10 L12 18 L20 26" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'); }
function trashIcon() { return svg('<path d="M10 14 H38 M20 14 V9 H28 V14 M14 14 L16 40 H32 L34 14" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'); }
function brushIcon() { return svg('<path d="M30 6 L42 18 L24 30 L18 24 Z" fill="currentColor"/><path d="M18 24 L24 30 C22 38 14 42 6 42 C8 36 8 28 18 24 Z" fill="var(--tomato)"/>'); }
function toolIcon(t) {
  const tip = 'var(--tip, #e63946)';
  const icons = {
    finger: `<path d="M17 44 C10 40 8 33 9 27 L11 21 C12 18 16 18 16 22 L16 26 L16 8 C16 4 22 4 22 8 L22 20 L22 6 C22 2 28 2 28 6 L28 20 L28 9 C28 5 34 5 34 9 L34 22 L34 14 C34 10 40 10 40 14 L40 30 C40 39 34 44 26 44 Z" fill="var(--hand)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><circle cx="19" cy="7" r="4.5" fill="${tip}"/>`,
    brush: `<path d="M34 4 L44 14 L22 30 L18 26 Z" fill="#b07a45" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M18 26 L22 30 C20 39 12 44 4 44 C6 37 7 29 18 26 Z" fill="${tip}" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>`,
    crayon: `<g transform="rotate(45 24 24)"><rect x="17" y="12" width="14" height="32" rx="2" fill="${tip}" stroke="currentColor" stroke-width="2.5"/><path d="M17 12 L24 0 L31 12 Z" fill="${tip}" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M17 22 H31 M17 34 H31" stroke="currentColor" stroke-width="2.5"/></g>`,
    marker: `<g transform="rotate(45 24 24)"><rect x="16" y="16" width="16" height="30" rx="4" fill="var(--surface)" stroke="currentColor" stroke-width="2.5"/><rect x="16" y="30" width="16" height="6" fill="${tip}"/><path d="M19 16 L19 8 L29 4 L29 16 Z" fill="${tip}" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></g>`,
    fill: `<path d="M8 20 L24 6 L40 22 L26 38 Z" fill="var(--surface)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M8 20 L40 22 L26 38 Z" fill="${tip}" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M42 30 C46 36 44 42 40 42 C36 42 35 36 42 30 Z" fill="${tip}" stroke="currentColor" stroke-width="2.5"/>`,
    eraser: `<g transform="rotate(-35 24 24)"><rect x="6" y="15" width="36" height="18" rx="4" fill="#ff9db8" stroke="currentColor" stroke-width="2.5"/><path d="M26 15 V33" stroke="currentColor" stroke-width="2.5"/><rect x="26" y="15" width="16" height="18" rx="2" fill="#7fb8ff" stroke="currentColor" stroke-width="2.5"/></g>`,
  };
  return svg(icons[t]);
}
function liftIcon() { return svg('<path d="M16 46 C10 42 9 36 10 31 L12 27 C13 25 16 25 16 28 V20 C16 17 21 17 21 20 V30" fill="var(--hand)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 6 L36 18 L28 26 L16 14 Z" fill="var(--tip, #e63946)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 12 L10 8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="9" cy="7" r="3" fill="var(--tip, #e63946)"/>'); }
function crownIcon() { return svg('<path d="M8 34 L6 14 L17 23 L24 10 L31 23 L42 14 L40 34 Z" fill="currentColor"/><rect x="8" y="36" width="32" height="5" rx="2" fill="currentColor"/>'); }
function botFace(level) {
  const mouth = ['M18 32 Q24 37 30 32', 'M18 33 H30', 'M18 34 Q24 29 30 34'][level];
  return `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 V10" stroke="#1b2554" stroke-width="3"/><circle cx="24" cy="4" r="3" fill="#1b2554"/><rect x="8" y="10" width="32" height="30" rx="9" fill="#fff" stroke="#1b2554" stroke-width="3"/><circle cx="18" cy="23" r="4" fill="#1b2554"/><circle cx="30" cy="23" r="4" fill="#1b2554"/>${level === 2 ? '<path d="M13 16 L21 19 M35 16 L27 19" stroke="#1b2554" stroke-width="3" stroke-linecap="round"/>' : ''}<path d="${mouth}" stroke="#1b2554" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
}
function friendFace() {
  return `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="16" cy="24" r="12" fill="#ff5a4e" stroke="#1b2554" stroke-width="3"/><circle cx="32" cy="24" r="12" fill="#ffc93c" stroke="#1b2554" stroke-width="3"/><circle cx="13" cy="22" r="2" fill="#1b2554"/><circle cx="19" cy="22" r="2" fill="#1b2554"/><circle cx="29" cy="22" r="2" fill="#1b2554"/><circle cx="35" cy="22" r="2" fill="#1b2554"/><path d="M12 28 Q16 31 20 28 M28 28 Q32 31 36 28" stroke="#1b2554" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;
}
function tileArt(kind) {
  if (kind === 'games') return `<svg viewBox="0 0 120 100" aria-hidden="true"><rect x="20" y="10" width="80" height="80" rx="10" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/><path d="M40 12 V88 M60 12 V88 M80 12 V88 M22 30 H98 M22 50 H98 M22 70 H98" stroke="var(--ink)" stroke-width="2" opacity=".35"/><circle cx="50" cy="40" r="11" fill="var(--tomato)" stroke="var(--ink)" stroke-width="4"/><circle cx="70" cy="60" r="11" fill="var(--sun)" stroke="var(--ink)" stroke-width="4"/></svg>`;
  if (kind === 'video') return `<svg viewBox="0 0 120 100" aria-hidden="true"><rect x="10" y="14" width="100" height="70" rx="14" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/><path d="M50 34 L76 49 L50 64 Z" fill="var(--tomato)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/><path d="M40 92 H80" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/></svg>`;
  if (kind === 'color') return `<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M60 10 C30 10 10 30 10 52 C10 74 28 90 50 90 C58 90 60 84 56 78 C52 72 56 66 64 66 H78 C96 66 110 56 110 42 C110 24 88 10 60 10 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/><circle cx="36" cy="40" r="9" fill="#e63946"/><circle cx="58" cy="28" r="9" fill="#1e5bff"/><circle cx="82" cy="34" r="9" fill="#2a9d3f"/><circle cx="32" cy="64" r="9" fill="#7b2ff7"/></svg>`;
  return `<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M44 74 V20 L96 10 V64" fill="none" stroke="var(--ink)" stroke-width="7" stroke-linejoin="round"/><ellipse cx="34" cy="76" rx="14" ry="11" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/><ellipse cx="86" cy="66" rx="14" ry="11" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/><path d="M44 32 L96 22" stroke="var(--ink)" stroke-width="6"/></svg>`;
}

// ---------- start ----------
async function start() {
  try {
    S.settings = { ...S.settings, ...((await db.get('kv', 'settings')) || {}) };
    S.profiles = (await db.get('kv', 'profiles')) || [];
  } catch (err) {
    console.error(err);
    app.innerHTML = `<p class="empty">KidView needs browser storage to work. Private browsing can block it; try a regular window.</p>`;
    return;
  }
  $('#nowplaying').addEventListener('click', () => ACT.toggleSong());
  history.replaceState({ kv: 0 }, '');
  history.pushState({ kv: 1 }, '');
  go(S.settings.pinHash ? 'profiles' : 'welcome', {}, false);
  if (!native && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
start();
