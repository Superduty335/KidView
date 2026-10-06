// Tic tac toe against the computer (Easy, Medium, Hard) or a friend.

const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

// Returns { who: 'X' | 'O' | 'draw', line } or null while the game goes on.
function result(b) {
  for (const line of LINES) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { who: b[a], line };
  }
  return b.every(Boolean) ? { who: 'draw', line: null } : null;
}

const empty = (b) => b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function minimax(b, me, turn, depth) {
  const r = result(b);
  if (r) return r.who === 'draw' ? 0 : r.who === me ? 10 - depth : depth - 10;
  const other = turn === 'X' ? 'O' : 'X';
  let best = turn === me ? -Infinity : Infinity;
  for (const i of empty(b)) {
    b[i] = turn;
    const v = minimax(b, me, other, depth + 1);
    b[i] = null;
    best = turn === me ? Math.max(best, v) : Math.min(best, v);
  }
  return best;
}

function winningCell(b, who) {
  return empty(b).find((i) => { b[i] = who; const w = result(b)?.who === who; b[i] = null; return w; });
}

const LEVELS = {
  easy: { label: 'Easy', blurb: 'Picks squares at random' },
  medium: { label: 'Medium', blurb: 'Wins and blocks when it sees it' },
  hard: { label: 'Hard', blurb: 'Never makes a mistake' },
};

function computerMove(board, me, level) {
  const b = board.slice();
  const them = me === 'X' ? 'O' : 'X';
  const open = empty(b);
  if (level === 'easy') {
    const win = winningCell(b, me);
    return win !== undefined && Math.random() < 0.4 ? win : pick(open);
  }
  if (level === 'medium') {
    const win = winningCell(b, me);
    if (win !== undefined) return win;
    const block = winningCell(b, them);
    if (block !== undefined && Math.random() < 0.85) return block;
    if (!b[4] && Math.random() < 0.5) return 4;
    return pick(open);
  }
  let best = -Infinity, moves = [];
  for (const i of open) {
    b[i] = me;
    const v = minimax(b, me, them, 1);
    b[i] = null;
    if (v > best) { best = v; moves = [i]; } else if (v === best) moves.push(i);
  }
  return pick(moves);
}

export const meta = { id: 'tictactoe', title: 'Tic Tac Toe', blurb: 'Get three in a row', color: 'tomato' };
export const icon = `<svg viewBox="0 0 120 100" aria-hidden="true"><rect x="18" y="8" width="84" height="84" rx="16" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/><path d="M46 16 V84 M74 16 V84 M22 39 H98 M22 61 H98" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="M27 17 L42 32 M42 17 L27 32" stroke="var(--tomato)" stroke-width="7" stroke-linecap="round"/><circle cx="60" cy="50" r="8" fill="none" stroke="var(--sky)" stroke-width="6"/><path d="M79 69 L94 84 M94 69 L79 84" stroke="var(--tomato)" stroke-width="7" stroke-linecap="round"/></svg>`;

const CSS = `
.g-ttt { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.g-ttt .levels { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 16px; width: 100%; }
.g-ttt .level { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 18px 14px; }
.g-ttt .level b { font-size: 1.6rem; }
.g-ttt .level small { font-family: var(--body); font-weight: 700; font-size: .95rem; }
.g-ttt .level i { font-style: normal; font-family: var(--body); font-size: .85rem; font-weight: 800; background: rgba(255,255,255,.55); border-radius: 999px; padding: 2px 10px; }
.g-ttt .status { font-weight: 800; font-size: 1.3rem; margin: 0; text-align: center; min-height: 1.5em; }
.g-ttt .board { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 10px; width: min(100%, 58vh, 460px); aspect-ratio: 1; max-width: 100%; background: var(--ink); padding: 10px; border-radius: 26px; }
.g-ttt .cell { border: 0; border-radius: 16px; background: var(--surface); display: grid; place-items: center; padding: 0; min-width: 0; }
.g-ttt .cell svg { width: 72%; height: 72%; }
.g-ttt .cell.win { background: var(--sun); }
.g-ttt .cell path, .g-ttt .cell circle { stroke-dasharray: 200; stroke-dashoffset: 200; animation: g-ttt-draw .35s ease-out forwards; }
@keyframes g-ttt-draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .g-ttt .cell path, .g-ttt .cell circle { animation: none; stroke-dashoffset: 0; } }
.g-ttt .tally { display: flex; gap: 18px; flex-wrap: wrap; justify-content: center; font-weight: 800; color: var(--muted); }
.g-ttt .tally span { font-variant-numeric: tabular-nums; }
`;
const X_SVG = '<svg viewBox="0 0 100 100"><path d="M20 20 L80 80 M80 20 L20 80" stroke="var(--tomato)" stroke-width="16" stroke-linecap="round" fill="none"/></svg>';
const O_SVG = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" stroke="var(--sky)" stroke-width="16" fill="none" transform="rotate(-90 50 50)"/></svg>';

export function mount(root, ctx) {
  if (!document.getElementById('g-ttt')) {
    const st = document.createElement('style'); st.id = 'g-ttt'; st.textContent = CSS; document.head.appendChild(st);
  }
  let mode = null, board, turn, first = 'X', over = null, busy = false, timer = null;
  const tally = { X: 0, O: 0, draw: 0 };
  const vsComputer = () => mode !== 'friend';
  const wins = () => ctx.load('ttt-wins') || {};

  function picker() {
    const w = wins();
    root.innerHTML = `<div class="g-ttt">
      <p class="quiz-prompt">Who do you want to play?</p>
      <div class="levels">
        ${Object.entries(LEVELS).map(([id, l], i) => `<button class="toy level ${['toy-grass', 'toy-sun', 'toy-tomato'][i]}" data-mode="${id}"><b>${l.label}</b><small>${l.blurb}</small>${w[id] ? `<i>You won ${w[id]} time${w[id] === 1 ? '' : 's'}</i>` : ''}</button>`).join('')}
        <button class="toy level toy-sky" data-mode="friend"><b>A friend</b><small>Take turns on this device</small></button>
      </div></div>`;
  }
  function start() {
    board = Array(9).fill(null); turn = first; over = null; busy = false;
    draw();
    if (vsComputer() && turn === 'O') computerTurn();
  }
  function draw() {
    const res = over;
    const winSet = new Set(res?.line || []);
    let status;
    if (res) status = res.who === 'draw' ? "It's a tie!" : vsComputer() ? (res.who === 'X' ? `You win, ${ctx.esc(ctx.kid.name)}! 🎉` : 'The computer got three in a row.') : `${res.who} wins! 🎉`;
    else if (vsComputer()) status = turn === 'X' ? 'Your turn: you are X' : 'Thinking…';
    else status = `${turn}'s turn`;
    root.innerHTML = `<div class="g-ttt">
      <p class="status" aria-live="polite">${status}</p>
      <div class="board" role="grid">${board.map((v, i) => `<button class="cell ${winSet.has(i) ? 'win' : ''}" data-i="${i}" aria-label="${v || 'empty'}">${v === 'X' ? X_SVG : v === 'O' ? O_SVG : ''}</button>`).join('')}</div>
      <div class="tally"><span>${vsComputer() ? 'You' : 'X'}: ${tally.X}</span><span>Ties: ${tally.draw}</span><span>${vsComputer() ? 'Computer' : 'O'}: ${tally.O}</span></div>
      ${res ? `<div class="row-center"><button class="toy toy-sun" data-act2="again">Play again</button><button class="toy toy-sky" data-act2="levels">${vsComputer() ? 'Change level' : 'Back'}</button></div>` : ''}
    </div>`;
  }
  function place(i) {
    board[i] = turn;
    over = result(board);
    if (over) {
      tally[over.who]++;
      if (vsComputer() && over.who === 'X') { const w = wins(); w[mode] = (w[mode] || 0) + 1; ctx.save('ttt-wins', w); }
      first = first === 'X' ? 'O' : 'X'; // take turns going first
    } else turn = turn === 'X' ? 'O' : 'X';
    draw();
    if (!over && vsComputer() && turn === 'O') computerTurn();
  }
  function computerTurn() {
    busy = true; draw();
    timer = setTimeout(() => { busy = false; place(computerMove(board, 'O', mode)); }, 550);
  }
  function onClick(e) {
    const lv = e.target.closest('[data-mode]');
    if (lv) { mode = lv.dataset.mode; first = 'X'; tally.X = tally.O = tally.draw = 0; return start(); }
    const a = e.target.closest('[data-act2]');
    if (a) return a.dataset.act2 === 'again' ? start() : (mode = null, picker());
    const c = e.target.closest('.cell');
    if (!c || over || busy || board[+c.dataset.i] || (vsComputer() && turn !== 'X')) return;
    place(+c.dataset.i);
  }
  root.addEventListener('click', onClick);
  picker();
  return () => { clearTimeout(timer); root.removeEventListener('click', onClick); };
}
