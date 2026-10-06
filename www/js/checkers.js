// Checkers (American rules): men move diagonally forward, kings move both ways,
// jumps are required and chain together, and a man is crowned on the far row.
// Board: 64 squares, index = row * 8 + col. Pieces: 'r' / 'R' (red, the kid,
// starts at the bottom and moves up) and 'b' / 'B' (blue, starts at the top).

export const RED = 'r', BLUE = 'b';
const other = (s) => (s === RED ? BLUE : RED);
const sideOf = (p) => p && p.toLowerCase();
const isKing = (p) => p === 'R' || p === 'B';
const rc = (i) => [i >> 3, i & 7];
const on = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

export function newBoard() {
  const b = Array(64).fill(null);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if ((r + c) % 2 === 0) continue;
    if (r < 3) b[r * 8 + c] = BLUE;
    else if (r > 4) b[r * 8 + c] = RED;
  }
  return b;
}

function dirs(p) {
  if (isKing(p)) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  return sideOf(p) === RED ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
}
const crowns = (p, r) => !isKing(p) && ((sideOf(p) === RED && r === 0) || (sideOf(p) === BLUE && r === 7));

// A move: { path: [from, to, to2, ...], caps: [captured squares] }
export function legalMoves(board, side) {
  const jumps = [], steps = [];
  for (let i = 0; i < 64; i++) {
    const p = board[i];
    if (sideOf(p) !== side) continue;
    const before = jumps.length;
    const b = board.slice();
    b[i] = null; // the moving piece leaves its square, so a chain can pass back over it
    findJumps(b, p, i, [i], [], jumps);
    if (jumps.length > before) continue;
    const [r, c] = rc(i);
    for (const [dr, dc] of dirs(p)) {
      const nr = r + dr, nc = c + dc;
      if (on(nr, nc) && !board[nr * 8 + nc]) steps.push({ path: [i, nr * 8 + nc], caps: [] });
    }
  }
  return jumps.length ? jumps : steps;
}

function findJumps(b, p, at, path, caps, out) {
  const [r, c] = rc(at);
  let extended = false;
  for (const [dr, dc] of dirs(p)) {
    const mr = r + dr, mc = c + dc, lr = r + 2 * dr, lc = c + 2 * dc;
    if (!on(lr, lc)) continue;
    const mid = mr * 8 + mc, land = lr * 8 + lc;
    if (sideOf(b[mid]) !== other(sideOf(p)) || caps.includes(mid) || b[land]) continue;
    extended = true;
    const np = [...path, land], nc = [...caps, mid];
    if (crowns(p, lr)) out.push({ path: np, caps: nc }); // crowning ends the turn
    else findJumps(b, p, land, np, nc, out);
  }
  if (!extended && caps.length) out.push({ path, caps });
}

export function applyMove(board, move) {
  const b = board.slice();
  const from = move.path[0], to = move.path[move.path.length - 1];
  let p = b[from];
  b[from] = null;
  for (const c of move.caps) b[c] = null;
  if (crowns(p, to >> 3)) p = p.toUpperCase();
  b[to] = p;
  return b;
}

// ---------- computer player ----------
const CENTER = new Set([27, 28, 35, 36, 26, 29, 34, 37]);
function evaluate(b, side) {
  let s = 0;
  for (let i = 0; i < 64; i++) {
    const p = b[i];
    if (!p) continue;
    const r = i >> 3;
    let v = isKing(p) ? 170 : 100;
    if (!isKing(p)) {
      v += (sideOf(p) === RED ? 7 - r : r) * 4; // advancing toward a crown
      if ((sideOf(p) === RED && r === 7) || (sideOf(p) === BLUE && r === 0)) v += 8; // guarding the back row
    }
    if (CENTER.has(i)) v += 6;
    s += sideOf(p) === side ? v : -v;
  }
  return s;
}

function negamax(b, side, depth, alpha, beta, deadline, ply) {
  const moves = legalMoves(b, side);
  if (!moves.length) return -100000 + ply;
  if (depth <= 0 && !moves[0].caps.length) return evaluate(b, side);
  if (depth <= -6) return evaluate(b, side); // cap the capture extension
  if (performance.now() > deadline) throw TIMEOUT;
  let best = -Infinity;
  for (const m of moves) {
    const v = -negamax(applyMove(b, m), other(side), depth - 1, -beta, -alpha, deadline, ply + 1);
    if (v > best) best = v;
    if (v > alpha) alpha = v;
    if (alpha >= beta) break;
  }
  return best;
}
const TIMEOUT = Symbol('timeout');

function scoreMoves(b, side, depth, deadline) {
  return legalMoves(b, side).map((m) => ({ m, v: -negamax(applyMove(b, m), other(side), depth - 1, -Infinity, Infinity, deadline, 1) }));
}

export const LEVELS = {
  easy: { label: 'Easy', blurb: 'Makes silly mistakes' },
  medium: { label: 'Medium', blurb: 'Thinks a little ahead' },
  hard: { label: 'Hard', blurb: 'Plays to win' },
};

export function computerMove(board, side, level) {
  const moves = legalMoves(board, side);
  if (moves.length <= 1) return moves[0] || null;
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  if (level === 'easy') {
    // Mostly random, sometimes grabs the best-looking move one step ahead.
    if (Math.random() < 0.7) return pickRandom(moves);
    const scored = scoreMoves(board, side, 1, Infinity).sort((a, b) => b.v - a.v);
    return scored[0].m;
  }
  if (level === 'medium') {
    const scored = scoreMoves(board, side, 3, Infinity).sort((a, b) => b.v - a.v);
    // Now and then settles for its second-best idea.
    if (scored.length > 1 && Math.random() < 0.25 && scored[1].v > scored[0].v - 60) return scored[1].m;
    const top = scored.filter((s) => s.v === scored[0].v);
    return pickRandom(top).m;
  }
  // Hard: search deeper and deeper until the time runs out.
  const deadline = performance.now() + 900;
  let best = null;
  for (let depth = 2; depth <= 12; depth++) {
    try {
      const scored = scoreMoves(board, side, depth, deadline).sort((a, b) => b.v - a.v);
      const top = scored.filter((s) => s.v === scored[0].v);
      best = pickRandom(top).m;
      if (Math.abs(scored[0].v) > 50000) break; // found a forced win or loss
    } catch (e) {
      if (e !== TIMEOUT) throw e;
      break;
    }
  }
  return best || moves[0];
}

export function countPieces(board, side) {
  return board.filter((p) => sideOf(p) === side).length;
}
