// Word Tiles: a crossword tile game. Place letters from your rack on an 11x11
// board to make words; colored squares multiply points. Play the computer
// (Easy / Medium / Hard) or a friend on the same device.
export const meta = { id: 'wordtiles', title: 'Word Tiles', blurb: 'Build words, score points', color: 'sun' };

export const icon = `<svg viewBox="0 0 120 100" aria-hidden="true">
<rect x="14" y="14" width="92" height="72" rx="10" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/>
<g stroke="var(--ink)" stroke-width="4" stroke-linejoin="round">
<rect x="22" y="36" width="24" height="26" rx="5" fill="var(--sun)"/><rect x="48" y="36" width="24" height="26" rx="5" fill="var(--sun)"/><rect x="74" y="36" width="24" height="26" rx="5" fill="var(--sun)"/>
</g>
<g font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="900" font-size="18" fill="var(--ink)" text-anchor="middle">
<text x="34" y="56">C</text><text x="60" y="56">A</text><text x="86" y="56">T</text></g>
<rect x="22" y="20" width="24" height="12" rx="4" fill="var(--tomato)"/><rect x="74" y="66" width="24" height="12" rx="4" fill="var(--sky)"/>
</svg>`;

// ---------- dictionary (kid-friendly common words; forms expanded below) ----------
const WORDS = `ad ah am an as at aw ax ay be by do eh go ha he hi hm ho if in is it la ma me my no of oh ok on or ow ox pa pi so to uh um up us we ya yo
able about above across after again age ago ahead aim air alive all almost alone along already also always among and angry another any anyone anyway apart are arm around art asleep ate away awake awful
baby back bad badly bath be been began begin begun being below beside best better between big bigger biggest bit bitten black blew blown blue boo both bought bounced brave break broke broken brought brown built busy but by bye
came can cannot careful caught chose chosen clever close come comes coming cozy cried crept cut cuts cutting
dad daddy dear did dig digs dug digging do does doing done dove down dozen drank drawn drew drink drinks drinking drive drives driving drove dry dug during
each early east easy eat eats eaten eating eight eighty eleven else empty enough even ever every extra
fed feel feels feeling fell fallen falling felt few fifth fifty find finds finding first fit fits fitted fitting five flew flown fly flies flying for forty forgot forgive forgave forgotten found four fourth free freeze freezes freezing froze frozen from front full fun funny fuzzy
gave get gets getting give given gives giving glad go goes going gone good goodbye got gotten gray great green grew grown grow grows growing
had half has have having he hear heard hears hearing held hello help her here hers herself hey hi hid hidden hide hides hiding him himself his hit hits hitting hold holds holding home hooray hot hotter hottest how huge hundred hung hurt hurts
ice icy if in inside into is it its itself
jolly just
keep keeps keeping kept kind knee knew know knows knowing known
laid last late later lay lead leaf leaves led left less let lets letting lit little live lose loses losing lost lot lots loud low lunch
made make makes making many may maybe me mean means meant meet meets met mice mine more most much must my myself
near nearly neat never new next nice nine ninety no none north not nothing now
of off often oh okay old on once one only onto oops open or orange other our ours out outside over own
paid past pay pays paying people pink please plus pretty purple put puts putting
quack quick quickly quiet quietly quite quiz
ran rang read reads reading ready real really red ridden ride rides riding ring rings ringing rode round run runs running rung
sad said same sang sank sat saw say says saying see seen sees seeing sell sells selling send sends sending sent set sets seven seventy shake shakes shaking shaken she sheep shook short shot should shut shy silly silver since sing sings singing sink sinks sit sits sitting six sixth sixty sleep sleeps sleeping slept slid slide slides sliding so sold some someone soon sorry south speak speaks spoke spoken spend spent spin spins spun spinning stand stands standing stood stick sticks sticking stuck still sting stung such sung sunk swam swim swims swimming swing swings swinging swung
take takes taking taken teach teaches teaching taught teeth tell tells telling ten than thank thanks that the their them then there these they thick thin think thinks thinking third thirty this those thought thousand threw thrown three through throw throws throwing tie ties tied tying tiny to today together told tomorrow tonight too took tore torn toward true twelve twenty two
under unless until up upon us
very
wake wakes waking was we wear wears wearing went were west what when where which while white who whole whose why will win wins winning wise with woke woken won wore worn would wow write writes writing written wrote
yay yeah yes yet you young your yours yourself yum yummy
zero
apple carrot gold beige teal hurray
women men children feet geese teeth mice wolves elves knives halves loaves leaves shelves calves scarves
tomato tomatoes potato potatoes hero heroes echo echoes zoo zoos piano pianos radio radios video videos kangaroo kazoo kazoos igloo igloos hippo hippos rhino rhinos yoyo yoyos photo photos solo dodo mango mangoes taco tacos burrito
sheep fish deer moose bison squid
sew sewed sewn sewing show shown shows showing ski skis
quizzes buses glasses
shine shines shining shone dream dreamt leap leapt creep creeps sweep sweeps sweeping swept
mean meaner meanest
ace act add ago aid aim all and ant any ape apt arc are ark arm art ash ask ate awe axe bad bag ban bar bat bay bed bee beg bet bib bid big bin bit boa bob bog boo bow box boy bud bug bun bus but buy bye cab can cap car cat cob cod cog cot cow coy cry cub cue cup cut dab dad dam day den dew did dig dim din dip doe dog dot dry dud due dug dye ear eat ebb egg elf elk elm emu end era eve ewe eye fad fan far fax fed fee few fib fig fin fir fit fix flu fly foe fog for fox fry fun fur gab gag gap gas gel gem get gig gnu got gum guy gym had ham has hat hay hem hen her hey hid him hip his hit hog hop hot how hub hue hug hum hut ice icy ill imp ink inn its ivy jab jam jar jaw jay jet jig job jog jot joy jug keg key kid kin kit lab lad lag lap law lay led leg let lid lip lit log lot low lug mad man map mat may men met mew mix mob mom moo mop mow mud mug mum nab nag nap net new nib nil nip nod nor not now nut oak oar oat odd off oil old one opt orb ore our out owe owl own pad pal pan pat paw pay pea peg pen pep pet pie pig pin pit ply pod pop pot pow pry pug pun pup put rag ram ran rap rat raw ray red rib rid rig rim rip rod row rub rug run rye sad sag sap sat saw say sea see set sew shy sip sir sit six ski sky sly sob son sow soy spa spy sub sum sun tab tag tan tap tar tax tea tee ten the tie tin tip toe ton too top tot tow toy try tub tug two urn use van vat vet via vow wag was wax way web wed wee wet who why wig win wit wok won woo wow yak yam yap yes yet yew yip you yum zap zip zoo
able acid also area away bake bald ball band bank bare bark barn base bath bead beak beam bean bear beat beef been beep bell belt bend bent best bike bill bird bite blow blue blur boat body bold bolt bone book boom boot born boss both bowl bulb bump bunk burp bush busy cage cake call calm came camp cape card care cart case cash cast cave cell chat chef chin chip chop city clam clap claw clay clip club clue coal coat code coil coin cold comb cone cook cool cord core corn cost cozy crab crew crib crop crow cube cure curl cute damp dare dark dart dash date dawn deal dear deck deep desk dial dice dime dine dirt disk dive dock does doll dome done door dove down drag draw drew drip drop drum duck dull dump dune dusk dust duty each earn ease east easy edge else even ever exit face fact fade fair fall fame farm fast fawn fear feed feel feet fell felt fern fill film find fine fire firm fish fist five flag flap flat flea fled flew flip flop flow foam fold folk fond food fool fork form fort four free frog from fuel full fuss gain game gave gaze gear gift give glad glow glue goal goat goes gold golf gone good gown grab gram gray grew grid grin grip grow gulp hail hair half hall halt hand hang hard harp have hawk haze head heal heap hear heat heel held helm help herb herd here hero hide high hike hill hint hive hold hole home hood hook hoop hope horn hose host hour huge hula hump hunt hurt hush idea inch iron isle item jazz jeep jest join joke jolt jump junk just keen keep kelp kept kick kind king kiss kite kiwi knee knew knit knob knot know lace lack lady laid lake lamb lamp land lane last late lawn lazy lead leak lean leap left lend lens less lick life lift like lily limb lime limp line link lion list live load loaf loan lock loft long look loop loud love luck lump lung made mail main make mall many mare mark mask mast mate math maze meal mean meat meet melt menu mess mild milk mill mind mine mint miss mist mitt moat mold mole mood moon moss most moth move much mule must name nail navy near neat neck need nest news next nice nine none noon nose note okay once only onto open oval oven over pace pack page paid pail pair pale palm park part pass past path peak pear peel pest pick pier pile pine pink pipe plan play plot plow plug plum plus poem poet pole pond pony pool poor pose post pour prey prop puck puff pull pump pure push quit race rack raft rail rain rake ramp rang rare rate read real reef rent rest rice rich ride ring rink ripe rise road roam roar robe rock rode role roll roof room root rope rose rosy ruby rule rush rust safe sage said sail salt same sand sang save seal seat seed seek seem seen self sell send sent shed ship shoe shop shot show shut side sigh sign silk sing sink site size skip slam sled slid slim slip slow slug snap snow soak soap sock sofa soft soil sold sole some song soon sort soup sour spin spot star stay stem step stew stir stop such suit sung sunk sure surf swan swap swim tack tail take tale talk tall tame tank tape task team tell tend tent test text than that them then they thin this tick tide tidy tile time tiny tire toad told tone took tool torn toss tour town trap tray tree trim trip true tuba tube tuck tuna tune turn twig twin type unit upon used vase vast very vest view vine vote wade wait wake walk wall wand want warm warn wash wave wavy weak wear weed week well went were west what when whip wide wig wild will wind wing wink wipe wire wise wish with woke wolf wood wool word wore work worm worn wrap yard yarn year yell yolk your zero zone zoom
deer goose mouse foot tooth jeans pants leaf snowman snowmen child scissors ox oxen sheep calf scarf hoof hoofs
`;
// Nouns that take a regular plural (s / es / ies).
const NOUNS = `
ant ape bat bear bee bird bug bull bunny cat  camel chick chicken cow crab crow cub  dog dolphin donkey dove duck duckling eagle eel elephant elk emu fawn ferret finch fox frog gecko giraffe goat  gorilla hamster hare hawk hen heron horse hound hyena iguana jaguar jay kitten kitty koala lamb lark leopard lion lizard llama lobster mole monkey moth  mule newt owl otter  panda parrot peacock pelican penguin pet pig pigeon pony poodle puppy rabbit raccoon ram rat raven robin seal shark skunk sloth slug snail snake spider squirrel swan tiger toad trout turkey turtle walrus wasp whale worm yak zebra beetle cricket ladybug lamb kid unicorn dragon dinosaur monster puppet
apple banana bean berry bread bun burger butter cake candy carrot cereal cheese cherry chip cookie corn cracker cream cupcake donut egg fig grape gum ham honey jam jelly juice lemon lime meal meat melon milk muffin noodle nut oat olive onion orange pancake pea peach peanut pear pepper pickle pie pizza plum popcorn pretzel pudding pumpkin raisin rice salad salt sandwich sauce snack soup spoon steak sugar syrup tea toast treat waffle yogurt drink lunch dinner breakfast
apron arm ankle back beard belly body bone brain brow cheek chest chin ear elbow eye eyebrow face finger fist  hair hand head heart heel hip jaw knee knuckle lap leg lip mouth nail neck nose palm rib shin shoulder skin skull thumb toe tongue  tummy waist wrist
bag ball balloon basket bat bead bell bike blanket block boat book boot bottle bow bowl box brick broom brush bubble bucket button cap car card cart castle chair chalk clock coat comb computer crayon crown cup desk dish doll door drum dress fan fence flag flute fork game gate gift glass glove glue hammer hat helmet hoop horn jacket jar  jug kettle key kite ladder lamp lock magnet map marble mask mat mirror mitten mop mug nail napkin necklace needle net oven pail pan  paper pen pencil phone pillow pin pipe plate pocket pot puzzle quilt radio rake ring robot rocket rope rug ruler sack sail   shell shirt shoe shovel sink skate skirt sled slide sock sofa spoon stamp stick stool stove string swing table tent ticket tool towel toy train tray truck tub tube umbrella vase wagon wallet watch wheel whistle window yoyo zipper
air ant beach branch breeze bush cave cliff cloud coast dirt dust earth field flower forest garden grass hill island lake  meadow moon mountain mud ocean pebble petal planet plant pond puddle rain rainbow river road rock root sand sea seed shadow sky snow  soil star stone storm stream sun sunset tree valley volcano water wave weed wind wood world desert jungle comet orbit
aunt baby boy brother buddy  cousin dad daddy family farmer father friend girl grandma grandpa king kid knight lady mama mom mommy mother neighbor nurse pal parent pilot pirate prince princess queen sister teacher uncle wizard fairy giant clown doctor chef artist baker cowboy driver player singer dancer helper hero
airport attic barn bath bathroom bed bedroom bench bridge building cabin camp city classroom corner farm floor gym hall home hospital hotel house hut kitchen lab library market office palace park path playroom porch roof room school shop stair store street table tower town wall yard zoo place
afternoon birthday day evening hour minute month morning night noon party picnic season second summer spring winter week weekend year holiday
alarm answer arrow award bite blast bump circle color crash cube dance diamond dot drop edge end friend game goal guess heart hug idea inch job joke kiss letter line list mile name note number oval page part picture point prize question race rectangle shape side sign smile sound spot square step story test thing time trip triangle trick turn word wish yell zone puzzle laugh song music poem show movie class lesson grade team club hobby
ax bus car jet van taxi truck tractor plane ship boat canoe raft rocket scooter wagon engine wheel tire
egg nest web hive den shell feather fur paw tail wing  horn claw beak fin gill
bin box can cap fan hat jar jug kit lid map mat mop mug net pan pen pin pot rag rod rug tag tin tub cot cog dot gem hut ink jar job keg log nap pod pup ray tip tot web yam zip
`;
// Regular verbs: +s, +ed, +ing (e-drop, y->ied handled).
const VERBS = `
act add agree allow answer arrive ask bake bark beep blink boil borrow bounce brush bump burn buzz call camp care carry chase check cheer chew chirp clean clear climb close collect color comb cook copy count cover crash crawl cross crunch cry dance decide deliver dream dress drill dry dust earn end enjoy enter escape explain explore face fetch fill film finish fish fix flash float floss fold follow form fry gather giggle glow greet guess hand hatch heat help hike hope hunt hurry imagine invite iron join juggle jump kick kiss knock land last laugh learn lick lift like list listen live load lock look love mail march mark melt miss mix move munch name need nibble notice obey offer open order pack paddle paint park pass pause peek peel pick pinch place plant play please point polish pour practice press pretend print promise protect puff pull pump purr push race rain rake reach relax repair repeat reply rescue rest return rinse roar roast rock roll rule rush sail save scare scream search serve share shout sign skate slurp smash smell smile sneeze sniff snore snow soak sort sound spell spill splash spray squash squeak stack stamp start stay stomp stretch talk taste test thank tickle touch trace track trade train travel treat try turn twirl twist use visit vote wait walk wander want warm wash watch wave weigh whisper whistle wiggle wink wipe wish wonder work worry yawn yell zoom
`;
// Verbs that double the last letter: hop -> hopped, hopping.
const VERBS2 = `
beg chop clap dip drag drip drop drum flap flip grab grin hop hug hum jog knit mop nap nod pat pet plan plop pop rub scrub ship shop sip skip slip snap snip spot step stir stop swap tap trip trot tug wag wrap zip
`;
// Adjectives: +er, +est.
const ADJ = `
bright calm cheap clean clear cold cool cute dark deep dull fast fine fresh full great hard high kind large late light long loud low near neat nice old pale quick rich ripe safe short slow small smart soft strong sweet tall tough warm weak wide wild wise young brave close huge
angry busy chilly cloudy curly dirty early easy fancy funny furry fuzzy happy heavy hungry juicy lovely lucky messy muddy noisy pretty rainy scary shiny silly sleepy snowy spicy sticky sunny tasty tiny windy bumpy lazy cozy
`;
const ADJ2 = `big dim fit flat hot red sad thin wet`;

function plural(w) {
  if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es';
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies';
  return w + 's';
}
function verbForms(w, dbl) {
  const out = [w, plural(w)];
  if (dbl) { const d = w + w[w.length - 1]; out.push(d + 'ed', d + 'ing'); return out; }
  if (/ee$/.test(w)) out.push(w + 'd', w + 'ing');
  else if (/e$/.test(w)) out.push(w + 'd', w.slice(0, -1) + 'ing');
  else if (/[^aeiou]y$/.test(w)) out.push(w.slice(0, -1) + 'ied', w + 'ing');
  else out.push(w + 'ed', w + 'ing');
  return out;
}
function adjForms(w, dbl) {
  if (dbl) { const d = w + w[w.length - 1]; return [w, d + 'er', d + 'est']; }
  if (/e$/.test(w)) return [w, w + 'r', w + 'st'];
  if (/[^aeiou]y$/.test(w)) return [w, w.slice(0, -1) + 'ier', w.slice(0, -1) + 'iest'];
  return [w, w + 'er', w + 'est'];
}

let DICT = null;
/** Build (once) the word set and a letter trie: { set, trie } with trie nodes { e: isWord, c: { A: node } }. */
export function getDict() {
  if (DICT) return DICT;
  const set = new Set();
  const add = (w) => { w = w.toUpperCase(); if (/^[A-Z]{2,8}$/.test(w)) set.add(w); };
  const sp = (t) => t.split(/\s+/).filter(Boolean);
  sp(WORDS).forEach(add);
  sp(NOUNS).forEach((w) => { add(w); add(plural(w)); });
  sp(VERBS).forEach((w) => verbForms(w).forEach(add));
  sp(VERBS2).forEach((w) => verbForms(w, true).forEach(add));
  sp(ADJ).forEach((w) => adjForms(w).forEach(add));
  sp(ADJ2).forEach((w) => adjForms(w, true).forEach(add));
  const trie = { e: false, c: {} };
  for (const w of set) {
    let n = trie;
    for (const ch of w) n = n.c[ch] || (n.c[ch] = { e: false, c: {} });
    n.e = true;
  }
  DICT = { set, trie };
  return DICT;
}

// ---------- tiles and board ----------
export const PTS = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10 };
const COUNTS = { A: 6, B: 2, C: 2, D: 3, E: 9, F: 2, G: 2, H: 2, I: 6, J: 1, K: 1, L: 3, M: 2, N: 4, O: 6, P: 2, Q: 1, R: 4, S: 4, T: 5, U: 3, V: 1, W: 2, X: 1, Y: 2, Z: 1 };
export const N = 11;
export const CENTER = 5 * N + 5;
const RACK = 7;
export const BINGO = 30; // bonus for using all seven tiles

// Bonus squares, given for one eighth of the board and mirrored 8 ways.
export const BONUS = (() => {
  const b = new Array(N * N).fill('');
  const put = (r, c, k) => {
    for (const [y, x] of [[r, c], [c, r]]) for (const yy of [y, N - 1 - y]) for (const xx of [x, N - 1 - x]) b[yy * N + xx] = k;
  };
  [[0, 0], [0, 5]].forEach(([r, c]) => put(r, c, 'TW'));
  [[1, 1], [2, 2]].forEach(([r, c]) => put(r, c, 'DW'));
  [[3, 3], [1, 5]].forEach(([r, c]) => put(r, c, 'TL'));
  [[0, 3], [4, 4], [2, 4]].forEach(([r, c]) => put(r, c, 'DL'));
  b[CENTER] = 'DW';
  return b;
})();
const LM = { DL: 2, TL: 3 };
const WM = { DW: 2, TW: 3 };
const LABEL = { DL: '2L', TL: '3L', DW: '2W', TW: '3W' };
const NAME = { DL: 'Double letter', TL: 'Triple letter', DW: 'Double word', TW: 'Triple word' };

export function newBag(rng = Math.random) {
  const bag = [];
  for (const [l, n] of Object.entries(COUNTS)) for (let i = 0; i < n; i++) bag.push(l);
  for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
  return bag;
}

/**
 * Check and score placing `tiles` ([{ r, c, l }]) on `board` (array of N*N letters or null).
 * Returns { ok, score, words: [{ word, score }], error, bad: [words not in the list] }.
 */
export function evaluate(board, tiles, dict = getDict()) {
  const fail = (error, extra) => ({ ok: false, score: 0, words: [], error, bad: [], ...extra });
  if (!tiles.length) return fail('Put some letters on the board first.');
  const tmp = board.slice();
  const fresh = new Set();
  for (const t of tiles) {
    const i = t.r * N + t.c;
    if (t.r < 0 || t.r >= N || t.c < 0 || t.c >= N || board[i] || fresh.has(i)) return fail('That square is taken.');
    tmp[i] = t.l; fresh.add(i);
  }
  const at = (r, c) => (r >= 0 && r < N && c >= 0 && c < N ? tmp[r * N + c] : null);
  const sameRow = tiles.every((t) => t.r === tiles[0].r);
  const sameCol = tiles.every((t) => t.c === tiles[0].c);
  if (!sameRow && !sameCol) return fail('Put your letters in one straight line.');
  let across;
  if (tiles.length > 1) across = sameRow;
  else { const { r, c } = tiles[0]; across = !!(at(r, c - 1) || at(r, c + 1)); }
  const [dr, dc] = across ? [0, 1] : [1, 0];
  const pos = tiles.map((t) => (across ? t.c : t.r));
  const lo = Math.min(...pos), hi = Math.max(...pos);
  const fr = tiles[0].r, fc = tiles[0].c;
  for (let k = lo; k <= hi; k++) if (!(across ? at(fr, k) : at(k, fc))) return fail('Keep your letters together, with no gaps.');
  const firstMove = !board.some(Boolean);
  if (firstMove) {
    if (!fresh.has(CENTER)) return fail('The first word must cover the star in the middle.');
    if (tiles.length < 2) return fail('Words need at least 2 letters.');
  } else {
    const touches = tiles.some(({ r, c }) => [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].some(([y, x]) => y >= 0 && y < N && x >= 0 && x < N && board[y * N + x]));
    if (!touches) return fail('Your word must touch letters already on the board.');
  }
  const wordAt = (r, c, dy, dx) => {
    while (at(r - dy, c - dx)) { r -= dy; c -= dx; }
    let word = '', sum = 0, mult = 1;
    while (at(r, c)) {
      const i = r * N + c, l = tmp[i];
      let p = PTS[l];
      if (fresh.has(i)) { p *= LM[BONUS[i]] || 1; mult *= WM[BONUS[i]] || 1; }
      word += l; sum += p; r += dy; c += dx;
    }
    return { word, score: sum * mult };
  };
  const words = [];
  const main = wordAt(fr, fc, dr, dc);
  if (main.word.length > 1) words.push(main);
  for (const { r, c } of tiles) {
    const w = wordAt(r, c, dc, dr);
    if (w.word.length > 1) words.push(w);
  }
  if (!words.length) return fail('Words need at least 2 letters.');
  const bad = words.map((w) => w.word).filter((w) => !dict.set.has(w));
  if (bad.length) {
    const list = [...new Set(bad)];
    const names = list.length === 1 ? list[0] : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
    return fail(`${names} ${list.length === 1 ? "isn't" : "aren't"} in our word list.`, { bad: list, words });
  }
  let score = words.reduce((s, w) => s + w.score, 0);
  if (tiles.length === RACK) score += BINGO;
  return { ok: true, score, words, error: '', bad: [] };
}

const ALL = (1 << 26) - 1;
const bit = (l) => 1 << (l.charCodeAt(0) - 65);

/**
 * Find legal moves for `rack` (array of letters) on `board` using anchors, cross-checks and the trie.
 * Returns [{ tiles: [{ r, c, l }], word, score, words }] sorted best first. Stops at `deadline` (ms timestamp).
 */
export function generateMoves(board, rack, { dict = getDict(), deadline = Infinity, max = 20000 } = {}) {
  const counts = {};
  for (const l of rack) counts[l] = (counts[l] || 0) + 1;
  const found = new Map();
  const empty = !board.some(Boolean);
  let steps = 0, stop = false;
  const tick = () => { if ((++steps & 255) === 0 && Date.now() > deadline) stop = true; return stop; };

  for (const transpose of [false, true]) {
    const at = (r, c) => (r < 0 || r >= N || c < 0 || c >= N ? null : transpose ? board[c * N + r] : board[r * N + c]);
    // Cross-checks: which letters can go in each empty square without making a bad up/down word.
    const cross = new Array(N * N).fill(ALL);
    const anchor = new Array(N * N).fill(false);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (at(r, c)) continue;
      let up = '', down = '';
      for (let y = r - 1; at(y, c); y--) up = at(y, c) + up;
      for (let y = r + 1; at(y, c); y++) down += at(y, c);
      if (up || down) {
        let m = 0;
        for (let k = 0; k < 26; k++) { const L = String.fromCharCode(65 + k); if (dict.set.has(up + L + down)) m |= 1 << k; }
        cross[r * N + c] = m;
      }
      anchor[r * N + c] = empty ? r * N + c === CENTER : !!(up || down || at(r, c - 1) || at(r, c + 1));
    }
    const record = (placed) => {
      const tiles = placed.map((p) => (transpose ? { r: p.c, c: p.r, l: p.l } : { r: p.r, c: p.c, l: p.l }));
      const key = tiles.map((t) => t.r * N + t.c + t.l).sort().join(',');
      if (found.has(key) || found.size >= max) return;
      const ev = evaluate(board, tiles, dict);
      if (ev.ok) found.set(key, { tiles, word: ev.words[0].word, score: ev.score, words: ev.words });
    };
    const extend = (r, c, node, placed, anchorC) => {
      if (tick()) return;
      if (c < N && !at(r, c)) {
        if (node.e && c > anchorC) record(placed);
        const m = cross[r * N + c];
        if (!m) return;
        for (const L in node.c) {
          if (!counts[L] || !(m & bit(L))) continue;
          counts[L]--; placed.push({ r, c, l: L });
          extend(r, c + 1, node.c[L], placed, anchorC);
          placed.pop(); counts[L]++;
        }
      } else if (c < N) {
        const child = node.c[at(r, c)];
        if (child) extend(r, c + 1, child, placed, anchorC);
      } else if (node.e && c > anchorC) record(placed);
    };
    const left = (r, anchorC, part, node, limit) => {
      if (stop) return;
      const placed = [...part].map((l, k) => ({ r, c: anchorC - part.length + k, l }));
      extend(r, anchorC, node, placed, anchorC);
      if (limit <= 0) return;
      for (const L in node.c) {
        if (!counts[L]) continue;
        counts[L]--;
        left(r, anchorC, part + L, node.c[L], limit - 1);
        counts[L]++;
      }
    };
    for (let r = 0; r < N && !stop; r++) for (let c = 0; c < N && !stop; c++) {
      if (!anchor[r * N + c]) continue;
      if (at(r, c - 1)) {
        let k = c - 1, prefix = '';
        while (at(r, k)) { prefix = at(r, k) + prefix; k--; }
        let node = dict.trie;
        for (const ch of prefix) { node = node && node.c[ch]; }
        if (node) extend(r, c, node, [], c);
      } else {
        let limit = 0;
        for (let k = c - 1; k >= 0 && !at(r, k) && !anchor[r * N + k]; k--) limit++;
        left(r, c, '', dict.trie, Math.min(limit, RACK - 1));
      }
    }
  }
  return [...found.values()].sort((a, b) => b.score - a.score || b.tiles.length - a.tiles.length);
}

export const LEVELS = {
  easy: { label: 'Easy', blurb: 'Plays little words', ms: 400 },
  medium: { label: 'Medium', blurb: 'Plays good words', ms: 900 },
  hard: { label: 'Hard', blurb: 'Hunts for big scores', ms: 1300 },
};

/** Choose a move from `moves` (sorted best first) for a computer level. */
export function pickMove(moves, level, rng = Math.random) {
  if (!moves.length) return null;
  const any = (arr) => arr[Math.floor(rng() * arr.length)];
  if (level === 'hard') return moves[0];
  if (level === 'medium') {
    const best = moves[0].score;
    const good = moves.filter((m, i) => i > 0 && m.score >= best * 0.55 && m.score <= best * 0.85);
    if (good.length) return any(good);
    return moves[Math.min(moves.length - 1, 1 + Math.floor(rng() * 3))];
  }
  const short = moves.filter((m) => m.word.length <= 4 && m.tiles.length <= 3);
  const pool = short.length ? short : moves.slice(-Math.max(1, Math.ceil(moves.length / 3)));
  return any(pool.slice(Math.floor(pool.length * 0.4)));
}

// ---------- the game module ----------
export const _debug = {}; // test hook: current game state and helpers

const FACE = (level) => {
  const mouth = ['M18 32 Q24 37 30 32', 'M18 33 H30', 'M18 34 Q24 29 30 34'][level];
  return `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 V10" stroke="#1b2554" stroke-width="3"/><circle cx="24" cy="4" r="3" fill="#1b2554"/><rect x="8" y="10" width="32" height="30" rx="9" fill="#fff" stroke="#1b2554" stroke-width="3"/><circle cx="18" cy="23" r="4" fill="#1b2554"/><circle cx="30" cy="23" r="4" fill="#1b2554"/>${level === 2 ? '<path d="M13 16 L21 19 M35 16 L27 19" stroke="#1b2554" stroke-width="3" stroke-linecap="round"/>' : ''}<path d="${mouth}" stroke="#1b2554" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
};
const FRIEND = `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="16" cy="24" r="12" fill="#ff5a4e" stroke="#1b2554" stroke-width="3"/><circle cx="32" cy="24" r="12" fill="#ffc93c" stroke="#1b2554" stroke-width="3"/><circle cx="13" cy="22" r="2" fill="#1b2554"/><circle cx="19" cy="22" r="2" fill="#1b2554"/><circle cx="29" cy="22" r="2" fill="#1b2554"/><circle cx="35" cy="22" r="2" fill="#1b2554"/><path d="M12 28 Q16 31 20 28 M28 28 Q32 31 36 28" stroke="#1b2554" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;
const STAR = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 L14.8 8.6 L21.4 9.3 L16.4 13.7 L17.9 20.3 L12 16.9 L6.1 20.3 L7.6 13.7 L2.6 9.3 L9.2 8.6 Z" fill="currentColor"/></svg>`;

const CSS = `
.g-wordtiles { position: relative; display: flex; flex-direction: column; gap: 14px; }
.g-wordtiles .wt-ask { text-align: center; font-family: var(--display); font-weight: 800; font-size: 1.5rem; margin: 0; }
.g-wordtiles .wt-sub { text-align: center; color: var(--muted); font-weight: 700; margin: -6px 0 0; }
.g-wordtiles .wt-levels { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 18px; }
.g-wordtiles .wt-level { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 18px 14px 20px; }
.g-wordtiles .wt-level svg { width: 72px; height: 72px; }
.g-wordtiles .wt-level-name { font-size: 1.6rem; }
.g-wordtiles .wt-level-blurb { font-family: var(--body); font-weight: 700; font-size: .95rem; }
.g-wordtiles .wt-badge { font-family: var(--body); font-size: .85rem; font-weight: 800; background: rgba(255,255,255,.6); color: #1b2554; border-radius: 999px; padding: 2px 10px; }

.g-wordtiles .wt-game { display: grid; gap: 12px; align-items: start; }
.g-wordtiles .wt-left { display: flex; flex-direction: column; gap: 8px; min-width: 0; align-items: center; }
.g-wordtiles .wt-right { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.g-wordtiles .wt-scores { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; align-items: center; width: 100%; }
.g-wordtiles .wt-pl { display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; background: var(--surface); border: 2px solid var(--line); font-weight: 800; }
.g-wordtiles .wt-pl b { font-family: var(--display); font-size: 1.3rem; line-height: 1; font-variant-numeric: tabular-nums; }
.g-wordtiles .wt-pl.on { background: var(--sun); border-color: var(--sun-dk); color: #1b2554; }
.g-wordtiles .wt-bag { color: var(--muted); font-weight: 800; font-size: .95rem; }

.g-wordtiles .wt-board { container-type: inline-size; width: min(100%, calc(100dvh - 330px)); min-width: min(100%, 300px); aspect-ratio: 1; display: grid; grid-template-columns: repeat(11, 1fr); grid-template-rows: repeat(11, 1fr); gap: 2px; padding: 3px; background: var(--line); border-radius: 14px; }
.g-wordtiles .wt-sq { position: relative; border: 0; margin: 0; padding: 0; min-width: 0; min-height: 0; border-radius: 4px; background: var(--surface); display: grid; place-items: center; font-family: var(--display); font-weight: 800; color: var(--muted); font-size: calc(100cqw / 11 * .32); line-height: 1; }
.g-wordtiles .wt-sq.DL { background: color-mix(in srgb, var(--sky) 35%, var(--surface)); color: var(--ink); }
.g-wordtiles .wt-sq.TL { background: var(--sky); color: #fff; }
.g-wordtiles .wt-sq.DW { background: color-mix(in srgb, var(--tomato) 45%, var(--surface)); color: var(--ink); }
.g-wordtiles .wt-sq.TW { background: var(--tomato); color: #fff; }
.g-wordtiles .wt-sq.star svg { width: 70%; height: 70%; }
.g-wordtiles .wt-sq.drop { box-shadow: inset 0 0 0 2px var(--sky); }
.g-wordtiles .wt-tile { position: absolute; inset: 0; border-radius: 4px; background: var(--sun); color: #1b2554; box-shadow: inset 0 -3px 0 var(--sun-dk); display: grid; place-items: center; font-size: calc(100cqw / 11 * .6); font-family: var(--display); font-weight: 800; }
.g-wordtiles .wt-tile small { position: absolute; right: 8%; bottom: 7%; font-size: calc(100cqw / 11 * .26); font-family: var(--body); font-weight: 900; }
.g-wordtiles .wt-tile.new { background: #fff3c4; box-shadow: inset 0 -3px 0 var(--sun-dk), 0 0 0 2px var(--sky); z-index: 1; }
.g-wordtiles .wt-tile.last { box-shadow: inset 0 -3px 0 var(--sun-dk), inset 0 0 0 3px var(--grass); }
.g-wordtiles .wt-tile.ghost { background: var(--surface); color: color-mix(in srgb, var(--grass) 65%, var(--ink)); box-shadow: inset 0 0 0 3px var(--grass); border-radius: 4px; animation: wt-pulse 1s ease-in-out infinite alternate; }
@keyframes wt-pulse { from { opacity: .45; } to { opacity: 1; } }

.g-wordtiles .wt-msg { margin: 0; min-height: 1.5em; font-weight: 800; text-align: center; }
.g-wordtiles .wt-msg.err { color: color-mix(in srgb, var(--tomato) 70%, var(--ink)); }
.g-wordtiles .wt-msg.good { color: color-mix(in srgb, var(--grass) 65%, var(--ink)); }
.g-wordtiles .wt-rack { container-type: inline-size; display: flex; justify-content: center; gap: 4px; padding: 5px; background: var(--surface); border: 2px solid var(--line); border-radius: 16px; }
.g-wordtiles .wt-rt { position: relative; flex: 0 1 auto; width: min(58px, calc((100cqw - 34px) / 7)); aspect-ratio: 1; min-width: 0; border: 0; padding: 0; border-radius: 10px; background: var(--sun); color: #1b2554; box-shadow: inset 0 -4px 0 var(--sun-dk); font-family: var(--display); font-weight: 800; font-size: min(2rem, calc((100cqw - 34px) / 7 * .6)); line-height: 1; display: grid; place-items: center; transition: transform .1s; }
.g-wordtiles .wt-rt small { position: absolute; right: 8%; bottom: 8%; font-size: .38em; font-family: var(--body); font-weight: 900; }
.g-wordtiles .wt-rt.sel { transform: translateY(-6px); box-shadow: inset 0 -4px 0 var(--sun-dk), 0 0 0 3px var(--sky), 0 6px 10px rgba(0,0,0,.25); }
.g-wordtiles .wt-rt.mark { background: var(--tomato); color: #fff; box-shadow: inset 0 -4px 0 var(--tomato-dk); }
.g-wordtiles .wt-rt.gone { background: transparent; box-shadow: inset 0 0 0 2px var(--line); }
.g-wordtiles .wt-play { width: 100%; font-size: 1.35rem; padding: 12px 18px; }
.g-wordtiles .wt-play small { display: block; font-family: var(--body); font-size: .9rem; font-weight: 800; }
.g-wordtiles .wt-ctls { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 10px 8px; }
.g-wordtiles .wt-ctl { --face: var(--surface); --edge: var(--line); color: var(--ink); font-size: 1.05rem; padding: 10px 8px; min-height: 48px; border-radius: 18px; border: 2px solid var(--line); }
.g-wordtiles .wt-ctl:disabled, .g-wordtiles .wt-play:disabled { opacity: .45; cursor: default; }
.g-wordtiles .wt-legend { display: flex; flex-wrap: wrap; gap: 6px 12px; justify-content: center; margin: 0; padding: 0; list-style: none; font-size: .85rem; font-weight: 700; color: var(--muted); }
.g-wordtiles .wt-legend li { display: flex; align-items: center; gap: 5px; }
.g-wordtiles .wt-legend i { font-style: normal; font-family: var(--display); font-weight: 800; font-size: .8rem; border-radius: 5px; padding: 1px 5px; }

.g-wordtiles .wt-over { position: absolute; inset: -6px; z-index: 5; display: flex; align-items: flex-start; justify-content: center; padding: 40px 12px; background: var(--overlay); border-radius: 22px; }
.g-wordtiles .wt-over.solid { background: var(--bg); }
.g-wordtiles .wt-card { background: var(--surface); border-radius: 28px; padding: 24px 20px; text-align: center; display: grid; gap: 12px; box-shadow: 0 10px 40px rgba(0,0,0,.3); width: min(440px, 100%); position: sticky; top: 40px; }
.g-wordtiles .wt-card h2 { margin: 0; font-family: var(--display); font-size: 1.9rem; line-height: 1.1; }
.g-wordtiles .wt-card p { margin: 0; font-weight: 700; }
.g-wordtiles .wt-final { display: grid; gap: 6px; }
.g-wordtiles .wt-final div { display: flex; justify-content: space-between; gap: 12px; font-weight: 800; font-size: 1.15rem; padding: 6px 12px; border-radius: 12px; background: var(--bg); }
.g-wordtiles .wt-btns { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }

@media (min-width: 760px) and (orientation: landscape) {
  .g-wordtiles .wt-game { grid-template-columns: minmax(0, 1fr) minmax(280px, 360px); }
  .g-wordtiles .wt-board { width: min(100%, calc(100dvh - 190px)); }
  .g-wordtiles .wt-right { padding-top: 48px; }
}
@media (prefers-reduced-motion: reduce) { .g-wordtiles .wt-tile.ghost { animation: none; } .g-wordtiles .wt-rt { transition: none; } }
`;

export function mount(root, ctx) {
  if (!document.getElementById('g-wordtiles')) {
    const st = document.createElement('style');
    st.id = 'g-wordtiles'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  const esc = ctx.esc;
  const age = +(ctx.kid && ctx.kid.age) || 7;
  const little = age <= 6;
  const dict = getDict();
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
  let G = null;
  let uid = 0;
  root.classList.add('g-wordtiles');

  const wins = () => ({ easy: 0, medium: 0, hard: 0, ...(ctx.load('wins') || {}) });

  function draw(bag, n) { const out = []; while (out.length < n && bag.length) out.push({ id: ++uid, l: bag.pop() }); return out; }

  function start(mode) {
    const bag = newBag();
    const vsBot = mode !== 'friend';
    const kidName = (ctx.kid && ctx.kid.name) || 'You';
    G = {
      mode, bag, board: new Array(N * N).fill(null), turn: 0, pending: [], sel: null, passes: 0, last: [],
      msg: little ? 'Tap a letter, then tap a square on the board.' : 'Make a word that covers the star.', msgKind: '',
      swap: null, hint: null, over: false, cover: false, thinking: false,
      players: [
        { name: vsBot ? 'You' : kidName, rack: draw(bag, RACK), score: 0, bot: false, hints: little ? Infinity : 3 },
        { name: vsBot ? 'Computer' : 'Player 2', rack: draw(bag, RACK), score: 0, bot: vsBot, hints: little ? Infinity : 3 },
      ],
    };
    _debug.G = G;
    if (!vsBot) G.cover = true;
    render();
  }

  const me = () => G.players[G.turn];
  const pendingTiles = () => G.pending.map((p) => ({ r: Math.floor(p.i / N), c: p.i % N, l: p.l }));
  const preview = () => (G.pending.length ? evaluate(G.board, pendingTiles(), dict) : null);
  const say = (msg, kind = '') => { G.msg = msg; G.msgKind = kind; };

  // ---- player actions ----
  function tapRack(id) {
    if (G.swap) { G.swap.has(id) ? G.swap.delete(id) : G.swap.add(id); return render(); }
    if (G.pending.some((p) => p.id === id)) return;
    G.sel = G.sel === id ? null : id;
    if (G.sel && !G.pending.length && little) say('Now tap a square on the board.');
    render();
  }
  function tapSquare(i) {
    const k = G.pending.findIndex((p) => p.i === i);
    if (k >= 0) { G.pending.splice(k, 1); G.hint = null; say('Letter back on your rack.'); return render(); }
    if (G.board[i]) return;
    if (!G.sel) { say('Tap one of your letters first.'); return render(); }
    const t = me().rack.find((x) => x.id === G.sel);
    G.pending.push({ i, id: t.id, l: t.l });
    G.sel = null;
    const free = me().rack.find((x) => !G.pending.some((p) => p.id === x.id));
    const ev = preview();
    if (ev.ok) say(`${ev.words.map((w) => w.word).join(' + ')} scores ${ev.score}. Tap Play word!`, 'good');
    else say(free ? 'Keep going, or tap Play word.' : 'Tap Play word when you are ready.');
    render();
  }
  function recall() { G.pending = []; G.sel = null; say('Letters back on your rack.'); render(); }
  function shuffle() {
    const r = me().rack;
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    render();
  }
  function play() {
    if (!G.pending.length) { say('Tap a letter, then tap a square on the board.', 'err'); return render(); }
    const tiles = pendingTiles();
    const ev = evaluate(G.board, tiles, dict);
    if (!ev.ok) { say(ev.error, 'err'); return render(); }
    commit(tiles, ev);
  }
  function commit(tiles, ev) {
    const p = me();
    for (const t of tiles) G.board[t.r * N + t.c] = t.l;
    const used = new Set(G.pending.map((x) => x.id));
    if (p.bot) {
      for (const t of tiles) { const k = p.rack.findIndex((x) => x.l === t.l && !used.has(x.id)); used.add(p.rack[k].id); }
    }
    p.rack = p.rack.filter((x) => !used.has(x.id));
    p.rack.push(...draw(G.bag, RACK - p.rack.length));
    p.score += ev.score;
    G.last = tiles.map((t) => t.r * N + t.c);
    G.pending = []; G.sel = null; G.hint = null; G.passes = 0;
    const words = ev.words.map((w) => w.word).join(', ');
    const who = p.bot ? 'Computer played' : G.mode === 'friend' ? `${p.name} played` : 'You played';
    say(`${who} ${words} for ${ev.score} point${ev.score === 1 ? '' : 's'}!${tiles.length === RACK ? ' All 7 tiles bonus!' : ''}`, 'good');
    if (!G.bag.length && !p.rack.length) return finish();
    next();
  }
  function startSwap() {
    if (G.bag.length < 1) { say('The bag is empty, so you cannot swap.', 'err'); return render(); }
    G.pending = []; G.sel = null; G.swap = new Set();
    say('Tap the letters you want to swap.');
    render();
  }
  function doSwap() {
    const p = me();
    const n = Math.min(G.swap.size, G.bag.length);
    if (!n) { say('Tap the letters you want to swap.', 'err'); return render(); }
    const out = p.rack.filter((x) => G.swap.has(x.id)).slice(0, n);
    const fresh = draw(G.bag, n);
    G.bag.push(...out.map((x) => x.l));
    G.bag = newBagShuffle(G.bag);
    p.rack = p.rack.filter((x) => !out.includes(x)).concat(fresh);
    G.swap = null; G.passes = 0; G.last = [];
    say(`${p.bot ? 'Computer' : G.mode === 'friend' ? p.name : 'You'} swapped ${n} letter${n === 1 ? '' : 's'}.`);
    next();
  }
  function newBagShuffle(b) { for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
  function pass() {
    const p = me();
    G.pending = []; G.sel = null; G.swap = null; G.hint = null; G.passes++; G.last = [];
    say(`${p.bot ? 'Computer' : G.mode === 'friend' ? p.name : 'You'} passed.`);
    if (G.passes >= 4) return finish();
    next();
  }
  function hint() {
    const p = me();
    if (p.hints <= 0) { say('No hints left this game.', 'err'); return render(); }
    G.pending = []; G.sel = null;
    const moves = generateMoves(G.board, p.rack.map((x) => x.l), { dict, deadline: Date.now() + 900 });
    if (!moves.length) { say('No words fit right now. Try Swap tiles.'); return render(); }
    let m;
    if (little) {
      const short = moves.filter((x) => x.word.length <= 4);
      m = (short.length ? short : moves)[0];
    } else m = moves[Math.min(moves.length - 1, Math.floor(moves.length * 0.1))];
    p.hints--;
    G.hint = m;
    const left = p.hints === Infinity ? '' : ` (${p.hints} hint${p.hints === 1 ? '' : 's'} left)`;
    say(`Try ${m.word}! The green letters show where.${left}`, 'good');
    render();
  }

  function next() {
    G.turn = 1 - G.turn;
    G.swap = null; G.hint = null;
    if (G.mode === 'friend') G.cover = true;
    render();
    if (me().bot) botTurn();
  }

  function botTurn() {
    G.thinking = true;
    const prev = G.msg;
    G.msg = (prev ? prev + ' ' : '') + 'Computer is thinking…'; G.msgKind = '';
    render();
    later(() => {
      if (!G || G.over) return;
      const p = me();
      const lv = LEVELS[G.mode];
      const moves = generateMoves(G.board, p.rack.map((x) => x.l), { dict, deadline: Date.now() + lv.ms });
      const m = pickMove(moves, G.mode);
      G.thinking = false;
      if (m) { G.pending = []; return commit(m.tiles, evaluate(G.board, m.tiles, dict)); }
      if (G.bag.length) {
        // swap the hardest letters
        const order = [...p.rack].sort((a, b) => PTS[b.l] - PTS[a.l]);
        G.swap = new Set(order.slice(0, Math.min(4, G.bag.length)).map((x) => x.id));
        return doSwap();
      }
      pass();
    }, 450);
  }

  function finish() {
    G.over = true; G.thinking = false; G.cover = false;
    const [a, b] = G.players;
    const rackPts = (p) => p.rack.reduce((s, x) => s + PTS[x.l], 0);
    const out = G.players.find((p) => !p.rack.length);
    if (out) { const other = out === a ? b : a; const r = rackPts(other); out.score += r; other.score -= r; }
    else G.players.forEach((p) => { p.score -= rackPts(p); });
    if (G.mode !== 'friend' && a.score > b.score) {
      const w = wins(); w[G.mode] = (w[G.mode] || 0) + 1; ctx.save('wins', w);
    }
    render();
  }

  // ---- views ----
  function pickerView() {
    const w = wins();
    return `
<p class="wt-ask">Who do you want to play?</p>
<p class="wt-sub">Make words on the board. Colored squares give extra points!</p>
<section class="wt-levels">
  ${Object.entries(LEVELS).map(([id, l], i) => `
  <button class="toy wt-level ${['toy-grass', 'toy-sun', 'toy-tomato'][i]}" data-act="start" data-mode="${id}">
    ${FACE(i)}<span class="wt-level-name">${l.label}</span><span class="wt-level-blurb">${l.blurb}</span>
    ${little && id === 'easy' ? '<span class="wt-badge">Best to start</span>' : ''}
    ${w[id] ? `<span class="wt-badge">You won ${w[id]} time${w[id] === 1 ? '' : 's'}</span>` : ''}
  </button>`).join('')}
  <button class="toy wt-level toy-sky" data-act="start" data-mode="friend">
    ${FRIEND}<span class="wt-level-name">A friend</span><span class="wt-level-blurb">Take turns on this device</span>
  </button>
</section>`;
  }

  function boardView() {
    const pend = new Map(G.pending.map((p) => [p.i, p]));
    const ghost = new Map();
    if (G.hint) for (const t of G.hint.tiles) ghost.set(t.r * N + t.c, t.l);
    const last = new Set(G.last);
    const canDrop = !!G.sel;
    let h = '';
    for (let i = 0; i < N * N; i++) {
      const b = BONUS[i];
      const l = G.board[i] || (pend.get(i) || {}).l;
      const cls = ['wt-sq', b, i === CENTER ? 'star' : '', canDrop && !l ? 'drop' : ''].filter(Boolean).join(' ');
      let inner = '', label;
      const r = Math.floor(i / N) + 1, c = (i % N) + 1;
      if (l) {
        const kind = pend.has(i) ? ' new' : last.has(i) ? ' last' : '';
        inner = `<span class="wt-tile${kind}">${l}<small>${PTS[l]}</small></span>`;
        label = `${l}, row ${r} column ${c}${pend.has(i) ? ', tap to take back' : ''}`;
      } else if (ghost.has(i)) {
        inner = `<span class="wt-tile ghost">${ghost.get(i)}</span>`;
        label = `Hint ${ghost.get(i)}, row ${r} column ${c}`;
      } else {
        inner = i === CENTER ? STAR : b ? LABEL[b] : '';
        label = `${b ? NAME[b] + ', ' : i === CENTER ? 'Star, ' : ''}row ${r} column ${c}`;
      }
      h += `<button class="${cls}" data-act="sq" data-i="${i}" aria-label="${label}">${inner}</button>`;
    }
    return `<div class="wt-board" role="grid" aria-label="Game board">${h}</div>`;
  }

  function gameView() {
    const p = me();
    const busy = G.thinking || p.bot || G.over || G.cover;
    const ev = preview();
    const scores = G.players.map((x, k) => `<span class="wt-pl${k === G.turn && !G.over ? ' on' : ''}">${esc(x.name)} <b>${x.score}</b></span>`).join('');
    const showRack = G.mode === 'friend' ? G.players[G.turn] : G.players[0];
    const rack = showRack.rack.map((t) => {
      const gone = G.pending.some((x) => x.id === t.id) && !showRack.bot;
      const cls = ['wt-rt', gone ? 'gone' : '', G.sel === t.id ? 'sel' : '', G.swap && G.swap.has(t.id) ? 'mark' : ''].filter(Boolean).join(' ');
      return `<button class="${cls}" data-act="rack" data-id="${t.id}" ${gone || busy ? 'disabled' : ''} aria-label="${gone ? 'empty' : t.l + ', ' + PTS[t.l] + ' points'}">${gone ? '' : `${t.l}<small>${PTS[t.l]}</small>`}</button>`;
    }).join('');
    const dis = busy ? 'disabled' : '';
    const hintLabel = p.hints === Infinity ? 'Hint' : `Hint (${Math.max(0, p.hints)})`;
    const controls = G.swap ? `
      <button class="toy toy-tomato wt-play" data-act="doSwap" ${dis}>Swap ${G.swap.size || ''} letter${G.swap.size === 1 ? '' : 's'}</button>
      <div class="wt-ctls"><button class="toy wt-ctl" data-act="cancelSwap" ${dis}>Cancel</button></div>` : `
      <button class="toy toy-grass wt-play" data-act="play" ${dis}>Play word${ev && ev.ok ? `<small>${esc(ev.words[0].word)} · ${ev.score} point${ev.score === 1 ? '' : 's'}</small>` : ''}</button>
      <div class="wt-ctls">
        <button class="toy wt-ctl" data-act="recall" ${dis || (G.pending.length ? '' : 'disabled')}>Recall</button>
        <button class="toy wt-ctl" data-act="shuffle" ${dis}>Shuffle</button>
        <button class="toy wt-ctl" data-act="swap" ${dis || (G.bag.length ? '' : 'disabled')}>Swap tiles</button>
        <button class="toy wt-ctl" data-act="pass" ${dis}>Pass</button>
        <button class="toy wt-ctl" data-act="hint" ${dis || (p.hints > 0 ? '' : 'disabled')}>${hintLabel}</button>
      </div>`;
    const legend = ['DL', 'TL', 'DW', 'TW'].map((k) => `<li><i class="wt-sq ${k}">${LABEL[k]}</i>${NAME[k]}</li>`).join('');
    return `
<div class="wt-game">
  <div class="wt-left">
    <div class="wt-scores">${scores}<span class="wt-bag">Bag: ${G.bag.length}</span></div>
    ${boardView()}
  </div>
  <div class="wt-right">
    <p class="wt-msg ${G.msgKind}" aria-live="polite">${esc(G.msg)}</p>
    <div class="wt-rack" aria-label="${esc(showRack.name)}'s letters">${rack}</div>
    ${controls}
    <ul class="wt-legend">${legend}</ul>
  </div>
</div>
${G.cover ? coverView() : ''}${G.over ? overView() : ''}`;
  }

  function coverView() {
    const p = me();
    return `<div class="wt-over solid"><div class="wt-card">
  <h2>Pass the device to ${esc(p.name)}</h2>
  ${G.msg && G.board.some(Boolean) ? `<p>${esc(G.msg)}</p>` : ''}
  <p>${esc(p.name)}, tap when you're ready. No peeking at the letters!</p>
  <div class="wt-btns"><button class="toy toy-sky toy-big" data-act="ready">I'm ready</button></div>
</div></div>`;
  }

  function overView() {
    const [a, b] = G.players;
    const vs = G.mode !== 'friend';
    let title;
    if (a.score === b.score) title = "It's a tie!";
    else if (vs) title = a.score > b.score ? 'You win!' : 'The computer wins!';
    else title = `${esc((a.score > b.score ? a : b).name)} wins!`;
    const sub = vs && a.score < b.score ? 'Good game! Try again?' : 'Great word building!';
    return `<div class="wt-over"><div class="wt-card" role="dialog" aria-label="Game over">
  <h2>${title}</h2><p>${sub}</p>
  <div class="wt-final">${G.players.map((x) => `<div><span>${esc(x.name)}</span><span>${x.score}</span></div>`).join('')}</div>
  <div class="wt-btns"><button class="toy toy-sun" data-act="again">Play again</button><button class="toy toy-sky" data-act="levels">Change opponent</button></div>
</div></div>`;
  }

  function render() {
    root.innerHTML = G ? gameView() : pickerView();
  }

  function onClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el || !root.contains(el) || el.disabled) return;
    const act = el.dataset.act;
    if (act === 'start') return start(el.dataset.mode);
    if (!G) return;
    if (act === 'again') return start(G.mode);
    if (act === 'levels') { G = null; _debug.G = null; return render(); }
    if (act === 'ready') { G.cover = false; return render(); }
    if (G.over || G.cover || G.thinking || me().bot) return;
    if (act === 'rack') return tapRack(+el.dataset.id);
    if (act === 'sq') { if (G.swap) return; return tapSquare(+el.dataset.i); }
    if (act === 'play') return play();
    if (act === 'recall') return recall();
    if (act === 'shuffle') return shuffle();
    if (act === 'swap') return startSwap();
    if (act === 'doSwap') return doSwap();
    if (act === 'cancelSwap') { G.swap = null; say('No swap.'); return render(); }
    if (act === 'pass') return pass();
    if (act === 'hint') return hint();
  }
  root.addEventListener('click', onClick);
  _debug.start = start;
  _debug.render = render;
  render();
  return () => {
    root.removeEventListener('click', onClick);
    timers.forEach(clearTimeout); timers.clear();
    root.classList.remove('g-wordtiles');
    root.innerHTML = '';
    G = null; _debug.G = null;
  };
}
