// Quick learning questions a kid answers before watching a video.
// Everything is tap-only (no keyboard), and difficulty follows the kid's age.

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function choices(answer, spread, count = 4, min = 0) {
  const set = new Set([answer]);
  let guard = 0;
  while (set.size < count && guard++ < 100) {
    const v = answer + (rand(spread * 2 + 1) - spread);
    if (v >= min && v !== answer) set.add(v);
  }
  return shuffle([...set]);
}

const COUNT_THINGS = ['🍎', '⭐', '🐟', '🎈', '🐞', '🍓', '🚗', '🌼'];

export function mathQuestion(age) {
  if (age <= 4) {
    const n = 1 + rand(5), thing = pick(COUNT_THINGS);
    return { kind: 'math', prompt: 'How many?', picture: thing.repeat(n), answer: String(n), options: choices(n, 2, 3, 1).map(String) };
  }
  if (age === 5) {
    const a = 1 + rand(5), b = 1 + rand(4), thing = pick(COUNT_THINGS);
    return { kind: 'math', prompt: `${a} + ${b} = ?`, picture: `${thing.repeat(a)} + ${thing.repeat(b)}`, answer: String(a + b), options: choices(a + b, 2, 3, 1).map(String) };
  }
  if (age <= 7) {
    if (Math.random() < 0.5) { const a = 2 + rand(12), b = 1 + rand(8); return { kind: 'math', prompt: `${a} + ${b} = ?`, answer: String(a + b), options: choices(a + b, 3).map(String) }; }
    const a = 6 + rand(14), b = 1 + rand(Math.min(a - 1, 9)); return { kind: 'math', prompt: `${a} − ${b} = ?`, answer: String(a - b), options: choices(a - b, 3).map(String) };
  }
  if (age === 8) {
    const r = Math.random();
    if (r < 0.35) { const a = 10 + rand(60), b = 5 + rand(30); return { kind: 'math', prompt: `${a} + ${b} = ?`, answer: String(a + b), options: choices(a + b, 10).map(String) }; }
    if (r < 0.6) { const a = 30 + rand(60), b = 5 + rand(25); return { kind: 'math', prompt: `${a} − ${b} = ?`, answer: String(a - b), options: choices(a - b, 10).map(String) }; }
    const a = 2 + rand(4), b = 1 + rand(10); return { kind: 'math', prompt: `${a} × ${b} = ?`, answer: String(a * b), options: choices(a * b, a + 2).map(String) };
  }
  if (Math.random() < 0.7) { const a = 2 + rand(9), b = 2 + rand(9); return { kind: 'math', prompt: `${a} × ${b} = ?`, answer: String(a * b), options: choices(a * b, Math.max(4, a)).map(String) }; }
  const b = 2 + rand(8), q = 2 + rand(9); return { kind: 'math', prompt: `${b * q} ÷ ${b} = ?`, answer: String(q), options: choices(q, 3, 4, 1).map(String) };
}

const WORDS = {
  easy: [['cat', '🐱'], ['dog', '🐶'], ['sun', '☀️'], ['bus', '🚌'], ['pig', '🐷'], ['hat', '🎩'], ['bed', '🛏️'], ['fox', '🦊'], ['bee', '🐝'], ['cow', '🐮'], ['egg', '🥚'], ['car', '🚗']],
  medium: [['fish', '🐟'], ['frog', '🐸'], ['star', '⭐'], ['cake', '🎂'], ['tree', '🌳'], ['moon', '🌙'], ['duck', '🦆'], ['ball', '⚽'], ['book', '📖'], ['boat', '⛵'], ['bear', '🐻'], ['milk', '🥛']],
  hard: [['apple', '🍎'], ['horse', '🐴'], ['pizza', '🍕'], ['train', '🚆'], ['rocket', '🚀'], ['banana', '🍌'], ['turtle', '🐢'], ['rainbow', '🌈'], ['penguin', '🐧'], ['octopus', '🐙'], ['giraffe', '🦒'], ['dolphin', '🐬']],
};

// Ages up to 5 fill in one missing letter; older kids build the whole word from tiles.
export function spellQuestion(age) {
  if (age <= 5) {
    const [word, pic] = pick(WORDS.easy);
    const i = rand(word.length);
    const letters = new Set([word[i]]);
    while (letters.size < 3) letters.add('abcdefghijklmnoprstuw'[rand(21)]);
    return { kind: 'missing', prompt: 'Which letter is missing?', picture: pic, word, gap: i, answer: word[i], options: shuffle([...letters]) };
  }
  const [word, pic] = pick(age <= 7 ? WORDS.medium : WORDS.hard);
  const extra = age >= 8 ? ['abcdefghijklmnoprstuw'[rand(21)], 'aeiou'[rand(5)]] : [];
  return { kind: 'build', prompt: 'Spell the word', picture: pic, word, answer: word, tiles: shuffle([...word, ...extra]) };
}

export function makeQuestion(age, mode) {
  const m = mode === 'mix' ? (Math.random() < 0.5 ? 'math' : 'spell') : mode;
  return m === 'spell' ? spellQuestion(age) : mathQuestion(age);
}
