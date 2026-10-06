# Game module contract

Each game is one ES module in `js/games/<id>.js` with no imports from the rest of the app.

```js
export const meta = { id: 'wordsearch', title: 'Word Search', blurb: 'Find hidden words', color: 'grass' }; // color: sun | tomato | grass | sky
export const icon = '<svg viewBox="0 0 120 100">…</svg>'; // tile art, uses var(--ink), var(--surface) etc.
export function mount(root, ctx) { /* render into root */ return () => { /* cleanup timers/listeners */ }; }
```

`ctx` = `{ kid: { id, name, age }, toast(msg), esc(str), back(), save(key, value), load(key) }`.
`save`/`load` persist small JSON per kid (wins, progress). The app draws the header (back button + title); render only below it.

Styling: inject one `<style id="g-<id>">` on mount (skip if present) and prefix every selector with `.g-<id>`.
Use the app tokens only: --bg --surface --ink --muted --line --sun --sun-dk --tomato --tomato-dk --grass --grass-dk --sky --sky-dk --overlay --display --body (they flip for dark mode).
Reusable classes: `.toy .toy-sun|tomato|grass|sky` (chunky pressable buttons), `.toy-small`, `.btn`, `.btn-primary`, `.chip`/`.chip.on`, `.empty`, `.row-center`, `.quiz-prompt` (big display text).
Kids are 2–10: touch-first, big targets (≥44px), no keyboard needed, works at 360px wide phones and tablets, readable at large system font sizes (let things wrap, never squish text). Difficulty follows `kid.age`.
To add a game, put its id in GAME_IDS in js/app.js and its path in the sw.js cache list.
