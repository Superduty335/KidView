// Crossword: picture clues for little kids, word clues for bigger kids.
// Self-contained module; see CONTRACT.md.

export const meta = { id: 'crossword', title: 'Crossword', blurb: 'Solve picture and word clues', color: 'sky' };

export const icon = `<svg viewBox="0 0 120 100" aria-hidden="true">
<g stroke="var(--ink)" stroke-width="3.5" stroke-linejoin="round">
<rect x="20" y="12" width="26" height="26" rx="5" fill="var(--surface)"/><rect x="46" y="12" width="26" height="26" rx="5" fill="var(--sun)"/><rect x="72" y="12" width="26" height="26" rx="5" fill="var(--surface)"/>
<rect x="46" y="38" width="26" height="26" rx="5" fill="var(--surface)"/><rect x="46" y="64" width="26" height="26" rx="5" fill="var(--surface)"/><rect x="72" y="64" width="26" height="26" rx="5" fill="var(--surface)"/>
</g>
<g font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="800" font-size="18" fill="var(--ink)" text-anchor="middle">
<text x="33" y="32">C</text><text x="59" y="32">A</text><text x="85" y="32">T</text><text x="59" y="58">N</text><text x="59" y="84">T</text><text x="85" y="84">O</text>
</g></svg>`;

// Tier 1: short words with a picture clue and a simple text clue. WORD|emoji|clue
const T1 = `CAT|🐱|A pet that says meow
DOG|🐶|A pet that says woof
COW|🐮|It says moo
PIG|🐷|A pink farm animal that oinks
HEN|🐔|A farm bird that lays eggs
FOX|🦊|A clever orange animal with a bushy tail
OWL|🦉|A bird that hoots at night
BEE|🐝|It buzzes and makes honey
BAT|🦇|It flies at night and hangs upside down
ANT|🐜|A tiny bug that lives in a hill
BUG|🐛|A little creepy crawly
EGG|🥚|A hen lays it
PIE|🥧|A baked treat with a crust
SUN|☀️|It shines in the day sky
BUS|🚌|A big vehicle that takes kids to school
CAR|🚗|You ride in it on the road
VAN|🚐|A car with a big back for people or boxes
HAT|🎩|You wear it on your head
BED|🛏️|You sleep in it
CUP|🥤|You drink from it
KEY|🔑|It opens a lock
MAP|🗺️|It shows you the way
BOX|📦|You put things inside it
PEN|🖊️|You write with it in ink
ICE|🧊|Frozen water
EYE|👁️|You see with it
EAR|👂|You hear with it
LEG|🦵|You walk on it
ARM|💪|Your hand is at the end of it
BOW|🎀|A pretty ribbon knot
FAN|🪭|It blows cool air
JAR|🫙|A glass pot with a lid
NUT|🥜|A squirrel likes to eat it
YAM|🍠|An orange root vegetable
TEA|🍵|A warm drink in a cup
WEB|🕸️|A spider spins it
JET|✈️|A very fast airplane
SKI|🎿|You slide down snow on it
UFO|🛸|A flying saucer
SAW|🪚|A tool that cuts wood
AXE|🪓|A tool to chop wood
RAT|🐀|A big mouse
ELF|🧝|A tiny helper with pointy ears
BEAR|🐻|A big furry animal that loves honey
LION|🦁|King of the jungle
FROG|🐸|It hops and says ribbit
DUCK|🦆|It says quack
GOAT|🐐|A farm animal with a beard
DEER|🦌|A forest animal with antlers
WOLF|🐺|It howls at the moon
SEAL|🦭|It barks and swims in the sea
CRAB|🦀|It walks sideways on the beach
FISH|🐟|It swims and has fins
BIRD|🐦|It has feathers and flies
SWAN|🦢|A white bird with a long neck
WORM|🪱|It wiggles in the dirt
SNAIL|🐌|It carries its house on its back
CAKE|🎂|You eat it on your birthday
MILK|🥛|A white drink from cows
CORN|🌽|Yellow kernels on a cob
PEAR|🍐|A fruit shaped like a bell
KIWI|🥝|A fuzzy brown fruit, green inside
RICE|🍚|Tiny white grains in a bowl
SOUP|🍲|You eat it with a spoon, hot
TACO|🌮|A folded shell with filling
BALL|⚽|You kick or throw it
KITE|🪁|It flies in the wind on a string
DOLL|🪆|A toy that looks like a person
DRUM|🥁|You bang it to make music
BOOK|📖|You read it
BOAT|⛵|It floats on water
BIKE|🚲|It has two wheels and pedals
SHIP|🚢|A very big boat
TAXI|🚕|A yellow car you pay to ride
MOON|🌙|It shines at night
STAR|⭐|It twinkles in the night sky
RAIN|🌧️|Water falling from clouds
SNOW|❄️|Cold white flakes
TREE|🌳|It has a trunk and leaves
LEAF|🍃|It grows on a tree
ROSE|🌹|A red flower with thorns
SOCK|🧦|You wear it on your foot
SHOE|👟|You wear it over your sock
COAT|🧥|You wear it when it is cold
RING|💍|You wear it on your finger
BELL|🔔|It rings ding dong
LAMP|💡|It gives light in a room
DOOR|🚪|You open it to go inside
SOAP|🧼|It makes bubbles to wash with
BATH|🛁|You get clean in it
NOSE|👃|You smell with it
HAND|✋|It has five fingers
FOOT|🦶|You stand on it
HAIR|💇|It grows on your head
GIFT|🎁|A present
FIRE|🔥|It is hot and orange
WAVE|🌊|Water that rolls to the shore
ROCK|🪨|A hard stone
NEST|🪺|A bird's home
TENT|⛺|You sleep in it when camping
SLED|🛷|You ride it down a snowy hill
SWIM|🏊|Move through water
SING|🎤|Make music with your voice
CLAP|👏|Bang your hands together
KING|🤴|He wears a crown
MAIL|✉️|Letters come in it
CLOCK|⏰|It tells the time
YOYO|🪀|A toy that goes up and down a string
DICE|🎲|You roll them in a game
SEED|🌱|A plant grows from it
CHICK|🐣|A baby chicken
TRAIN|🚂|It goes choo choo
APPLE|🍎|A red fruit
GRAPE|🍇|A small round fruit in bunches
PIZZA|🍕|A round food cut into slices
TIGER|🐯|A big cat with stripes
ZEBRA|🦓|A horse with black and white stripes
MOUSE|🐭|A small animal that squeaks
HORSE|🐴|You can ride it and it neighs
SHEEP|🐑|It gives us wool
WHALE|🐳|The biggest animal in the sea
SHARK|🦈|A fish with sharp teeth
HOUSE|🏠|You live in it
TRUCK|🚚|A big vehicle that carries loads
PLANE|✈️|It flies in the sky with wings
ROBOT|🤖|A machine that can move and talk
SPOON|🥄|You eat soup with it
BREAD|🍞|You make toast with it
HONEY|🍯|Sweet stuff bees make
CLOUD|☁️|Fluffy and white in the sky
HEART|❤️|A shape that means love
SMILE|😊|A happy face
CROWN|👑|A king wears it
PANDA|🐼|A black and white bear
CAMEL|🐫|An animal with humps
SNAKE|🐍|It slithers and hisses
LEMON|🍋|A yellow sour fruit
PEACH|🍑|A fuzzy orange fruit
TEDDY|🧸|A soft toy bear`;

// Tier 2: medium words with simple text clues. WORD|clue
const T2 = `BARN|A red farm building for animals
MILK|A white drink from cows
NEST|A bird's home made of twigs
CAVE|A dark hole in the side of a mountain
DRUM|You hit it with sticks to make a beat
OVEN|You bake cookies in it
SOFA|A comfy seat for more than one person
POND|A small lake where ducks swim
HIVE|Where bees live
WING|A bird uses it to fly
TAIL|A dog wags it
PAW|An animal's foot
CLAW|A sharp nail on a cat or crab
HOOF|A horse's hard foot
MANE|Long hair on a lion's neck
FUR|Soft hair on an animal
TUSK|An elephant's long tooth
SHELL|A turtle hides in it
HORN|A rhino has one on its nose
BEAK|A bird's mouth
SPIDER|It has eight legs and spins webs
RABBIT|It hops and has long ears
TURTLE|A slow animal with a shell
MONKEY|It swings from trees and eats bananas
PARROT|A colorful bird that can talk
GIRAFFE|The animal with the longest neck
PENGUIN|A bird that swims but cannot fly
OCTOPUS|A sea animal with eight arms
DOLPHIN|A smart sea animal that clicks
KOALA|It sleeps in trees in Australia
HIPPO|A huge animal that loves mud and water
LLAMA|A woolly animal with a long neck
OTTER|It floats on its back in the water
SLOTH|The slowest animal in the trees
BANANA|A long yellow fruit monkeys love
CHEESE|Mice love this yellow food
COOKIE|A sweet round snack with chips
CARROT|An orange vegetable rabbits love
POTATO|You make fries from it
TOMATO|A red fruit used for ketchup
ORANGE|A fruit and a color
BUTTER|You spread it on toast
CEREAL|You eat it with milk for breakfast
PASTA|Spaghetti is a kind of this
SALAD|A bowl of leaves and veggies
JUICE|A drink squeezed from fruit
SUGAR|It makes food sweet
WATER|Fish live in it and we drink it
PLANET|Earth is one
ROCKET|It blasts off into space
COMET|A space rock with a glowing tail
EARTH|The planet we live on
ALIEN|A visitor from another planet
SKY|It is blue on a sunny day
FOG|A cloud close to the ground
WIND|Moving air you can feel
STORM|Thunder and lightning come with it
RAINBOW|Colors in the sky after rain
SPRING|The season when flowers bloom
SUMMER|The hottest season
WINTER|The coldest season
AUTUMN|The season when leaves fall
MONDAY|The day after Sunday
TODAY|Not yesterday, not tomorrow
NIGHT|When the sky is dark
MORNING|When you wake up
SCHOOL|Where you go to learn
TEACHER|The grown-up in your class
PENCIL|You write and erase with it
CRAYON|A waxy stick for coloring
PAPER|You draw on it
GLUE|It makes things stick
RULER|It measures how long something is
CHAIR|You sit on it
TABLE|You eat dinner at it
WINDOW|You look outside through it
PILLOW|You rest your head on it in bed
BLANKET|It keeps you warm in bed
MIRROR|You see yourself in it
BRUSH|You use it on your hair or teeth
TOWEL|You dry off with it
CASTLE|A king and queen live in it
DRAGON|A storybook beast that breathes fire
PIRATE|He sails the sea looking for treasure
KNIGHT|He wears armor and rides a horse
WIZARD|He casts spells with a wand
FAIRY|A tiny magic person with wings
GHOST|It says boo
DOCTOR|You visit when you feel sick
FARMER|A person who grows food
BAKER|A person who makes bread
CHEF|A person who cooks in a restaurant
NURSE|She helps the doctor
PILOT|A person who flies a plane
SOCCER|You kick a ball into a goal
TENNIS|You hit a ball over a net with a racket
GUITAR|It has strings you strum
PIANO|It has black and white keys
VIOLIN|You play it with a bow
FLUTE|You blow into it to make music
TRUMPET|A shiny horn you blow
SWING|You go back and forth on it at the park
SLIDE|You go down it at the playground
BUBBLE|You blow it with soap
PUZZLE|You fit the pieces together
BALLOON|You blow it up for a party
GARDEN|Where flowers and veggies grow
FLOWER|A daisy or a tulip
FOREST|A place with lots of trees
BEACH|Sand and waves by the sea
ISLAND|Land with water all around
RIVER|Water that flows to the sea
OCEAN|The biggest water on Earth
DESERT|A hot, dry, sandy place
JUNGLE|A hot, wet forest with monkeys
BRIDGE|You cross a river on it
TRACTOR|A farm machine that pulls things
SCOOTER|It has two wheels and you push with one foot
SUBWAY|A train that runs under the city
WAGON|A cart you pull with a handle
MAGNET|It sticks to the fridge
CANDLE|You blow it out on a cake
CAMERA|You take pictures with it
PHONE|You call people on it
TICKET|You need it to ride a train or see a show
MONEY|You pay with it
PURPLE|Red and blue make this color
YELLOW|The color of the sun and bananas
GREEN|The color of grass
SEVEN|The number after six
TWELVE|One dozen
HUNDRED|Ten times ten
SQUARE|A shape with four equal sides
CIRCLE|A round shape
HAPPY|How you feel on your birthday
SLEEPY|How you feel at bedtime
QUIET|Not loud
FAST|A cheetah is very this
COLD|How ice feels
SOFT|How a pillow feels
JUMP|Spring up into the air
READ|What you do with a book
DANCE|Move your body to music
LAUGH|What you do at a funny joke
HUG|Wrap your arms around someone
KISS|A smooch
NAP|A short sleep in the day`;

// Tier 3: harder words and clues for older kids. WORD|clue
const T3 = `VOLCANO|A mountain that can erupt with lava
GLACIER|A slow river of ice
CANYON|A deep valley carved by a river
TORNADO|A spinning funnel of wind
THUNDER|The boom that follows lightning
LIGHTNING|A flash of electricity in a storm
HURRICANE|A huge storm that forms over the ocean
GRAVITY|The force that makes things fall
GALAXY|A huge group of stars, like the Milky Way
ORBIT|The path a planet takes around the sun
ASTRONAUT|A person who travels to space
TELESCOPE|A tool for looking at faraway stars
SATURN|The planet with the biggest rings
JUPITER|The largest planet
MERCURY|The planet closest to the sun
NEPTUNE|The farthest planet from the sun
ECLIPSE|When the moon blocks the sun
METEOR|A shooting star
OXYGEN|The gas we need to breathe
SKELETON|All the bones in your body
MUSCLE|It helps your body move and lift
LUNGS|You breathe with these
HEART|It pumps blood around your body
BRAIN|You think with it
STOMACH|Food goes here after you swallow
DINOSAUR|A giant reptile that lived long ago
FOSSIL|Old bones or shells turned to stone
MAMMAL|A warm animal that feeds milk to its babies
REPTILE|A cold-blooded animal with scales
INSECT|A bug with six legs
HABITAT|The natural home of an animal
PREDATOR|An animal that hunts other animals
CHEETAH|The fastest land animal
OSTRICH|The biggest bird in the world
CHAMELEON|A lizard that can change color
BUTTERFLY|It starts life as a caterpillar
TADPOLE|A baby frog
SQUIRREL|It buries acorns for winter
RACCOON|A masked animal that raids trash cans
BEAVER|It builds dams with its teeth
WALRUS|A sea animal with long tusks
JELLYFISH|A see-through sea animal that can sting
SEAHORSE|A tiny fish where the dad carries the babies
ANTELOPE|A fast deer-like animal of Africa
PEACOCK|A bird with a fan of colorful tail feathers
FLAMINGO|A pink bird that stands on one leg
KANGAROO|It carries its baby in a pouch
HEDGEHOG|A small animal covered in spines
TORTOISE|A slow land turtle
CATERPILLAR|It turns into a butterfly
POLLEN|Yellow dust bees carry between flowers
ROOTS|They hold a plant in the ground
CACTUS|A spiky plant that lives in the desert
SEASON|Winter or summer, for example
ISLAND|Land surrounded by water
PENINSULA|Land with water on three sides
CONTINENT|Africa is one of seven
EQUATOR|An imaginary line around Earth's middle
COMPASS|It points north
LIBRARY|A place to borrow books
MUSEUM|A place to see old and amazing things
HOSPITAL|Where doctors care for sick people
ORCHESTRA|A big group playing instruments together
MELODY|The tune of a song
RHYTHM|The beat in music
POETRY|Writing that often rhymes
CHAPTER|A part of a book
DICTIONARY|A book of word meanings
ALPHABET|A to Z
SENTENCE|A group of words with a period at the end
QUESTION|It ends with a question mark
FRACTION|One half is one of these
TRIANGLE|A shape with three sides
PENTAGON|A shape with five sides
HEXAGON|A shape with six sides
DIAMETER|A line across a circle through its middle
DOZEN|Twelve of something
MINUTE|Sixty seconds
CENTURY|One hundred years
CALENDAR|It shows the days and months
FEBRUARY|The shortest month
OCTOBER|The month of Halloween
SATURDAY|The day before Sunday
BIRTHDAY|The day you were born, celebrated each year
HOLIDAY|A special day off from school or work
ADVENTURE|An exciting trip or journey
TREASURE|Pirates bury it
MYSTERY|A puzzle that needs solving
INVENTOR|A person who makes something new
SCIENTIST|A person who does experiments
ARCHITECT|A person who designs buildings
ENGINEER|A person who designs machines and bridges
DETECTIVE|A person who solves crimes
FIREFIGHTER|A person who puts out fires
CARPENTER|A person who builds with wood
ATHLETE|A person who plays sports
CHAMPION|The winner of a contest
OLYMPICS|Games held every four years with medals
MARATHON|A very long running race
BICYCLE|A bike
HELICOPTER|It flies with spinning blades on top
SUBMARINE|A ship that goes under water
AMBULANCE|It rushes sick people to the hospital
ENGINE|The part that makes a car go
BATTERY|It stores power for a toy or phone
MACHINE|A thing with parts that does work
COMPUTER|You type and play games on it
KEYBOARD|The keys you type on
ELECTRIC|Powered by electricity
MAGNETIC|Able to pull iron
EXPERIMENT|A test to find something out
PLANT|It grows from a seed
WEATHER|Sunny, rainy, or snowy
TEMPERATURE|How hot or cold it is
THERMOMETER|It measures temperature
EVAPORATE|What water does when it turns to gas
SHADOW|A dark shape when you block the light
REFLECTION|What you see in a mirror
ECHO|A sound that bounces back to you
WHISPER|To talk very quietly
GIGGLE|A small silly laugh
CURIOUS|Wanting to know more
BRAVE|Not afraid
GENTLE|Soft and kind
ENORMOUS|Very, very big
TINY|Very, very small
ANCIENT|Very old
FREEZE|To turn into ice
MELT|To turn from ice to water
BALANCE|To stay steady without falling
PATIENT|Able to wait calmly
HONEST|Always telling the truth
FRIENDLY|Kind to others
JOURNEY|A long trip
ESCAPE|To get away
EXPLORE|To travel somewhere new to see what is there
DISCOVER|To find something for the first time
IMAGINE|To picture something in your mind
CELEBRATE|To have a party for something special
PYRAMID|A huge stone tomb in Egypt
CASTLE|A big stone building with towers
VIKING|A sailor and explorer from long ago in the north
EMPEROR|The ruler of an empire
KINGDOM|The land a king rules
KNIGHT|A soldier in armor long ago
UNICORN|A magic horse with one horn
MERMAID|Half girl, half fish
SPAGHETTI|Long thin noodles
AVOCADO|A green fruit used for guacamole
BROCCOLI|A green vegetable like little trees
PINEAPPLE|A spiky fruit with a crown of leaves
BLUEBERRY|A small round blue fruit
SANDWICH|Food between two slices of bread
PANCAKE|A flat breakfast food with syrup
POPCORN|A crunchy snack you eat at the movies
VANILLA|A plain flavor of ice cream
CINNAMON|A brown spice on toast or rolls`;

const parse = (s, pic) => s.trim().split('\n').map((l) => {
  const p = l.split('|');
  return pic ? { w: p[0], e: p[1], c: p[2] } : { w: p[0], c: p[1] };
});
export const BANK = { t1: parse(T1, true), t2: parse(T2, false), t3: parse(T3, false) };

const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export function levelFor(age) {
  if (age <= 6) return { key: 'pic', pool: () => BANK.t1.filter((x) => x.w.length <= 4), min: 3, max: 5, maxDim: 6, pics: true };
  if (age <= 8) return { key: 'mid', pool: () => [...BANK.t1, ...BANK.t2].filter((x) => x.w.length >= 3 && x.w.length <= 6), min: 6, max: 8, maxDim: 9 };
  return { key: 'old', pool: () => [...BANK.t2.filter((x) => x.w.length >= 5), ...BANK.t3].filter((x) => x.w.length <= 10), min: 8, max: 12, maxDim: 11 };
}

// ---- layout generator ----
// Words are placed one at a time by crossing an existing letter. A placement is
// legal when it never runs alongside another word (no accidental 2-letter words)
// and the cells before/after it are empty. Many tries; keep the best layout.
function tryLayout(pool, target, maxDim) {
  const cells = new Map(); // "r,c" -> { ch, a: bool, d: bool }
  const placed = [];
  const key = (r, c) => r + ',' + c;
  const get = (r, c) => cells.get(key(r, c));
  let minR = 0, maxR = 0, minC = 0, maxC = 0;
  const words = shuffle(pool);
  const used = new Set();

  function fits(w, r, c, dir) {
    const dr = dir === 'd' ? 1 : 0, dc = dir === 'a' ? 1 : 0;
    const L = w.length;
    if (get(r - dr, c - dc) || get(r + dr * L, c + dc * L)) return -1;
    let cross = 0;
    for (let i = 0; i < L; i++) {
      const rr = r + dr * i, cc = c + dc * i;
      const cell = get(rr, cc);
      if (cell) {
        if (cell.ch !== w[i] || cell[dir]) return -1;
        cross++;
      } else {
        // side neighbours must be empty
        if (get(rr + dc, cc + dr) || get(rr - dc, cc - dr)) return -1;
      }
    }
    if (placed.length && cross === 0) return -1;
    if (cross === L) return -1;
    const nMinR = Math.min(minR, r), nMaxR = Math.max(maxR, r + dr * (L - 1));
    const nMinC = Math.min(minC, c), nMaxC = Math.max(maxC, c + dc * (L - 1));
    if (nMaxR - nMinR + 1 > maxDim || nMaxC - nMinC + 1 > maxDim) return -1;
    return cross;
  }
  function put(item, r, c, dir) {
    const dr = dir === 'd' ? 1 : 0, dc = dir === 'a' ? 1 : 0;
    for (let i = 0; i < item.w.length; i++) {
      const rr = r + dr * i, cc = c + dc * i;
      const k = key(rr, cc);
      const cell = cells.get(k) || { ch: item.w[i], a: false, d: false };
      cell[dir] = true; cells.set(k, cell);
    }
    if (placed.length === 0) { minR = maxR = r; minC = maxC = c; }
    minR = Math.min(minR, r); maxR = Math.max(maxR, r + dr * (item.w.length - 1));
    minC = Math.min(minC, c); maxC = Math.max(maxC, c + dc * (item.w.length - 1));
    placed.push({ w: item.w, e: item.e, clue: item.c, r, c, dir });
    used.add(item.w);
  }

  // first word: pick a fairly long one
  const first = words.find((x) => x.w.length <= maxDim && x.w.length >= Math.min(5, maxDim - 1)) || words.find((x) => x.w.length <= maxDim);
  if (!first) return { placed, rows: 0, cols: 0, cellCount: 0 };
  put(first, 0, 0, Math.random() < 0.5 ? 'a' : 'd');

  let idx = 0;
  let misses = 0;
  while (placed.length < target && misses < words.length) {
    const item = words[idx++ % words.length];
    if (used.has(item.w) || [...used].some((u) => u.includes(item.w) || item.w.includes(u))) { misses++; continue; }
    let best = null, bestScore = -Infinity;
    for (const p of placed) {
      const dir = p.dir === 'a' ? 'd' : 'a';
      for (let i = 0; i < p.w.length; i++) for (let j = 0; j < item.w.length; j++) {
        if (p.w[i] !== item.w[j]) continue;
        const cr = p.r + (p.dir === 'd' ? i : 0), cc = p.c + (p.dir === 'a' ? i : 0);
        const r = cr - (dir === 'd' ? j : 0), c = cc - (dir === 'a' ? j : 0);
        const cross = fits(item.w, r, c, dir);
        if (cross < 0) continue;
        const h = Math.max(maxR, r + (dir === 'd' ? item.w.length - 1 : 0)) - Math.min(minR, r) + 1;
        const wd = Math.max(maxC, c + (dir === 'a' ? item.w.length - 1 : 0)) - Math.min(minC, c) + 1;
        const score = cross * 10 - h * wd * 0.6 - Math.abs(h - wd) * 1.5 + Math.random() * 2;
        if (score > bestScore) { bestScore = score; best = { r, c, dir }; }
      }
    }
    if (best) { put(item, best.r, best.c, best.dir); misses = 0; } else misses++;
  }
  // normalise to 0-based
  for (const p of placed) { p.r -= minR; p.c -= minC; }
  return { placed, rows: maxR - minR + 1, cols: maxC - minC + 1, cellCount: cells.size };
}

export function generate(age) {
  const lv = levelFor(age);
  const pool = lv.pool();
  const target = lv.min + rnd(lv.max - lv.min + 1);
  let best = null, bestScore = -Infinity;
  const t0 = Date.now();
  for (let i = 0; i < 80 && (i < 12 || Date.now() - t0 < 120); i++) {
    const L = tryLayout(pool, target, lv.maxDim);
    if (!L.placed.length) continue;
    const n = L.placed.length;
    const density = L.cellCount / (L.rows * L.cols);
    const crosses = L.placed.reduce((s, p) => s + p.w.length, 0) - L.cellCount;
    const score = Math.min(n, target) * 100 + density * 60 + crosses * 4 - Math.abs(L.rows - L.cols) * 3;
    if (score > bestScore) { bestScore = score; best = L; }
    if (n >= target && density > 0.45 && i >= 12) break;
  }
  return finish(best, lv);
}

function finish(L, lv) {
  const { placed, rows, cols } = L;
  // number clues by reading order of start cells
  const starts = [...new Set(placed.map((p) => p.r * cols + p.c))].sort((a, b) => a - b);
  return build(placed, rows, cols, starts, lv);
}

function build(placed, rows, cols, starts, lv) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  const words = placed.map((p) => {
    const n = starts.indexOf(p.r * cols + p.c) + 1;
    const cellsIdx = [];
    for (let i = 0; i < p.w.length; i++) {
      const r = p.r + (p.dir === 'd' ? i : 0), c = p.c + (p.dir === 'a' ? i : 0);
      grid[r][c] = p.w[i];
      cellsIdx.push(r * cols + c);
    }
    return { word: p.w, clue: p.clue, pic: lv.pics ? p.e : '', num: n, dir: p.dir, row: p.r, col: p.c, cells: cellsIdx };
  });
  words.sort((a, b) => (a.dir === b.dir ? a.num - b.num : a.dir === 'a' ? -1 : 1));
  return { rows, cols, grid, words };
}

// ---- UI ----
const CSS = `
.g-crossword { display: grid; gap: 14px; grid-template-columns: minmax(0, 1fr); align-items: start; }
.g-crossword .cw-main { display: grid; gap: 12px; justify-items: center; min-width: 0; }
.g-crossword .cw-clue { width: 100%; min-height: 76px; display: flex; align-items: center; gap: 12px; background: var(--surface); border-radius: 20px; padding: 10px 14px; box-shadow: 0 5px 0 var(--line); }
.g-crossword .cw-clue-tag { flex: none; font-family: var(--display); font-weight: 800; background: var(--sky); color: #fff; border-radius: 14px; padding: 4px 10px; font-size: 1rem; line-height: 1.2; text-align: center; }
.g-crossword .cw-clue-text { font-weight: 800; font-size: 1.2rem; line-height: 1.25; overflow-wrap: anywhere; min-width: 0; }
.g-crossword .cw-clue-pic { font-size: 3rem; line-height: 1; }
.g-crossword .cw-clue-len { color: var(--muted); font-weight: 700; font-size: .95rem; white-space: nowrap; }
.g-crossword .cw-board { width: min(100%, calc(var(--cols) * 76px), calc((100dvh - 470px) * var(--cols) / var(--rows))); min-width: min(100%, calc(var(--cols) * 34px)); container-type: inline-size; }
.g-crossword .cw-grid { display: grid; grid-template-columns: repeat(var(--cols), 1fr); gap: 0; touch-action: manipulation; }
.g-crossword .cw-cell { position: relative; aspect-ratio: 1; border: 0; padding: 0; margin: 0; background: transparent; font-family: var(--display); font-weight: 800; font-size: calc(100cqi / var(--cols) * 0.58); line-height: 1; color: var(--ink); display: grid; place-items: center; }
.g-crossword .cw-cell.on { background: var(--surface); box-shadow: inset 0 0 0 2px var(--ink); border-radius: 6px; margin: 1px; cursor: pointer; }
.g-crossword .cw-cell.word { background: color-mix(in srgb, var(--sky) 28%, var(--surface)); }
.g-crossword .cw-cell.cur { background: var(--sun); color: #1b2554; box-shadow: inset 0 0 0 3px var(--ink); }
.g-crossword .cw-cell.bad { background: color-mix(in srgb, var(--tomato) 30%, var(--surface)); color: var(--tomato-dk); }
.g-crossword .cw-cell.cur.bad { background: color-mix(in srgb, var(--tomato) 45%, var(--sun)); }
.g-crossword .cw-cell.hint { color: var(--sky-dk); }
.g-crossword .cw-cell.solved { background: color-mix(in srgb, var(--grass) 35%, var(--surface)); }
.g-crossword .cw-num { position: absolute; left: 7%; top: 4%; font-family: var(--body); font-size: max(9px, calc(100cqi / var(--cols) * 0.24)); line-height: 1; font-weight: 800; color: var(--muted); }
.g-crossword .cw-cell.cur .cw-num { color: #1b2554; }
.g-crossword .cw-side { display: grid; gap: 12px; min-width: 0; }
.g-crossword .cw-keys { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; width: 100%; max-width: 560px; justify-self: center; }
.g-crossword .cw-key { min-height: 50px; border: 0; border-radius: 14px; background: var(--surface); color: var(--ink); box-shadow: 0 4px 0 var(--line); font-family: var(--display); font-weight: 800; font-size: 1.45rem; padding: 0; transition: transform .06s, box-shadow .06s; }
.g-crossword .cw-key:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--line); }
.g-crossword .cw-key.del { grid-column: span 2; background: var(--tomato); color: #fff; box-shadow: 0 4px 0 var(--tomato-dk); font-size: 1.15rem; }
.g-crossword .cw-actions { display: flex; flex-wrap: wrap; gap: 10px 12px; justify-content: center; padding-bottom: 6px; }
.g-crossword .cw-actions .toy { padding: 10px 20px; font-size: 1.15rem; min-height: 48px; }
.g-crossword .cw-lists { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.g-crossword .cw-lists h3 { margin: 0 0 4px; font-family: var(--display); font-size: 1.2rem; }
.g-crossword .cw-lists ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.g-crossword .cw-li { width: 100%; text-align: left; border: 2px solid transparent; background: var(--surface); border-radius: 14px; padding: 8px 12px; min-height: 44px; display: flex; gap: 8px; align-items: center; font-weight: 700; line-height: 1.25; }
.g-crossword .cw-li b { flex: none; min-width: 1.6em; color: var(--sky); }
.g-crossword .cw-li .pic { font-size: 1.8rem; line-height: 1; }
.g-crossword .cw-li.act { border-color: var(--sky); }
.g-crossword .cw-li.ok { opacity: .55; text-decoration: line-through; }
.g-crossword .cw-win { position: fixed; inset: 0; z-index: 40; background: var(--overlay); display: grid; place-items: center; padding: 16px; }
.g-crossword .cw-win-card { background: var(--surface); border-radius: 28px; padding: 28px 22px; width: min(420px, 100%); text-align: center; display: grid; gap: 14px; justify-items: center; box-shadow: 0 8px 0 var(--line); animation: g-cw-pop .4s ease-out; }
.g-crossword .cw-win-big { font-size: 4rem; line-height: 1; }
.g-crossword .cw-win p { margin: 0; color: var(--muted); font-weight: 700; }
.g-crossword .cw-confetti { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
.g-crossword .cw-confetti span { position: absolute; top: -10%; font-size: 2rem; animation: g-cw-fall 2.4s linear forwards; }
.g-crossword .cw-grid.wiggle .cw-cell.bad { animation: g-cw-wiggle .35s; }
@keyframes g-cw-pop { from { transform: scale(.7); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes g-cw-fall { to { transform: translateY(120vh) rotate(540deg); } }
@keyframes g-cw-wiggle { 25%, 75% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
@media (min-width: 860px) {
  .g-crossword { grid-template-columns: minmax(0, 1.2fr) minmax(320px, 1fr); }
  .g-crossword .cw-board { width: min(100%, calc(var(--cols) * 76px), calc((100dvh - 230px) * var(--cols) / var(--rows))); }
}
@media (prefers-reduced-motion: reduce) { .g-crossword * { animation: none !important; } }
`;

export function mount(root, ctx) {
  if (!document.getElementById('g-crossword')) {
    const st = document.createElement('style'); st.id = 'g-crossword'; st.textContent = CSS; document.head.appendChild(st);
  }
  const age = Number(ctx.kid?.age) || 7;
  let solved = Number(safeLoad('crossword.solved')) || 0;
  let puz, entry, cur = -1, dir = 'a', bad = new Set(), hinted = new Set(), done = false, winTimer = 0;

  function safeLoad(k) { try { return ctx.load(k); } catch { return null; } }
  function safeSave(k, v) { try { ctx.save(k, v); } catch { /* ignore */ } }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  root.innerHTML = `<div class="g-crossword">
    <div class="cw-main">
      <div class="cw-clue" aria-live="polite"></div>
      <div class="cw-board"><div class="cw-grid" role="grid" aria-label="Crossword"></div></div>
    </div>
    <div class="cw-side">
      <div class="cw-keys" role="group" aria-label="Letters">${[...letters].map((l) => `<button type="button" class="cw-key" data-k="${l}">${l}</button>`).join('')}<button type="button" class="cw-key del" data-k="DEL" aria-label="Delete">⌫ Del</button></div>
      <div class="cw-actions">
        <button type="button" class="toy toy-grass" data-act="check">✔️ Check</button>
        <button type="button" class="toy" data-act="hint">💡 Hint</button>
        <button type="button" class="toy toy-sky" data-act="new">New puzzle</button>
      </div>
      <div class="cw-lists"></div>
    </div>
  </div>`;
  const el = root.firstElementChild;
  const gridEl = el.querySelector('.cw-grid');
  const boardEl = el.querySelector('.cw-board');
  const clueEl = el.querySelector('.cw-clue');
  const listsEl = el.querySelector('.cw-lists');

  function newPuzzle() {
    puz = generate(age);
    entry = puz.grid.map((row) => row.map(() => ''));
    bad = new Set(); hinted = new Set(); done = false;
    boardEl.style.setProperty('--cols', puz.cols);
    boardEl.style.setProperty('--rows', puz.rows);
    const nums = new Map();
    for (const w of puz.words) nums.set(w.cells[0], w.num);
    let h = '';
    for (let r = 0; r < puz.rows; r++) for (let c = 0; c < puz.cols; c++) {
      const i = r * puz.cols + c;
      if (puz.grid[r][c]) h += `<button type="button" class="cw-cell on" data-i="${i}" aria-label="Row ${r + 1} column ${c + 1}">${nums.has(i) ? `<span class="cw-num">${nums.get(i)}</span>` : ''}<span class="cw-ch"></span></button>`;
      else h += '<div class="cw-cell" aria-hidden="true"></div>';
    }
    gridEl.innerHTML = h;
    el.querySelector('.cw-win')?.remove();
    const w0 = puz.words[0];
    dir = w0.dir; cur = w0.cells[0];
    renderLists();
    render();
  }

  const letterAt = (i) => puz.grid[Math.floor(i / puz.cols)][i % puz.cols];
  const wordsAt = (i) => puz.words.filter((w) => w.cells.includes(i));
  function activeWord() {
    const ws = wordsAt(cur);
    return ws.find((w) => w.dir === dir) || ws[0];
  }
  const wordOk = (w) => w.cells.every((i) => entry[Math.floor(i / puz.cols)][i % puz.cols] === letterAt(i));
  const getE = (i) => entry[Math.floor(i / puz.cols)][i % puz.cols];
  const setE = (i, v) => { entry[Math.floor(i / puz.cols)][i % puz.cols] = v; };

  function renderLists() {
    const sec = (d, title) => {
      const ws = puz.words.filter((w) => w.dir === d);
      if (!ws.length) return '';
      return `<div><h3>${title}</h3><ol>${ws.map((w) => `<li><button type="button" class="cw-li" data-w="${puz.words.indexOf(w)}"><b>${w.num}</b>${w.pic ? `<span class="pic" aria-hidden="true">${w.pic}</span><span class="sr">${ctx.esc(w.clue)}</span>` : `<span>${ctx.esc(w.clue)}</span>`}</button></li>`).join('')}</ol></div>`;
    };
    listsEl.innerHTML = sec('a', '➡️ Across') + sec('d', '⬇️ Down');
  }

  function render() {
    const w = activeWord();
    const inWord = new Set(w ? w.cells : []);
    for (const node of gridEl.querySelectorAll('.cw-cell.on')) {
      const i = +node.dataset.i;
      node.querySelector('.cw-ch').textContent = getE(i);
      node.classList.toggle('word', inWord.has(i));
      node.classList.toggle('cur', i === cur && !done);
      node.classList.toggle('bad', bad.has(i));
      node.classList.toggle('hint', hinted.has(i));
      node.classList.toggle('solved', done);
      node.setAttribute('aria-label', `${getE(i) || 'blank'}`);
    }
    if (w) {
      const tag = `${w.num} ${w.dir === 'a' ? 'Across ➡️' : 'Down ⬇️'}`;
      clueEl.innerHTML = `<span class="cw-clue-tag">${tag}</span>${w.pic ? `<span class="cw-clue-pic" aria-hidden="true">${w.pic}</span><span class="sr">${ctx.esc(w.clue)}</span>` : `<span class="cw-clue-text">${ctx.esc(w.clue)}</span>`}<span class="cw-clue-len">${w.word.length} letters</span>`;
    }
    const wi = puz.words.indexOf(w);
    for (const b of listsEl.querySelectorAll('.cw-li')) {
      const k = +b.dataset.w;
      b.classList.toggle('act', k === wi);
      b.classList.toggle('ok', wordOk(puz.words[k]));
    }
  }

  function selectCell(i) {
    if (done) return;
    const ws = wordsAt(i);
    if (!ws.length) return;
    if (i === cur && ws.length > 1) dir = dir === 'a' ? 'd' : 'a';
    else if (!ws.some((w) => w.dir === dir)) dir = ws[0].dir;
    cur = i;
    render();
  }

  function type(k) {
    if (done || cur < 0) return;
    const w = activeWord();
    if (k === 'DEL') {
      if (getE(cur)) { setE(cur, ''); bad.delete(cur); hinted.delete(cur); }
      else {
        const p = w.cells.indexOf(cur);
        if (p > 0) { cur = w.cells[p - 1]; setE(cur, ''); bad.delete(cur); hinted.delete(cur); }
      }
      render();
      return;
    }
    setE(cur, k); bad.delete(cur);
    advance(w);
    render();
    checkDone();
  }

  function advance(w) {
    const p = w.cells.indexOf(cur);
    // next cell in this word; at the end, an empty cell left in it, else the next unfinished word
    if (p < w.cells.length - 1) { cur = w.cells[p + 1]; return; }
    const gap = w.cells.find((i) => !getE(i));
    if (gap !== undefined) { cur = gap; return; }
    const start = puz.words.indexOf(w);
    for (let k = 1; k <= puz.words.length; k++) {
      const n = puz.words[(start + k) % puz.words.length];
      const empty = n.cells.find((i) => !getE(i));
      if (empty !== undefined) { dir = n.dir; cur = empty; return; }
    }
  }

  function checkDone() {
    const all = puz.words.every(wordOk);
    if (!all) return;
    done = true; render();
    solved++;
    safeSave('crossword.solved', solved);
    const party = ['🎉', '⭐', '🎈', '✨', '🏆'];
    const conf = Array.from({ length: 18 }, (_, k) => `<span style="left:${rnd(96)}%;animation-delay:${(k % 6) * 0.15}s">${party[k % party.length]}</span>`).join('');
    winTimer = setTimeout(() => {
      const d = document.createElement('div');
      d.className = 'cw-win';
      d.innerHTML = `<div class="cw-confetti" aria-hidden="true">${conf}</div>
        <div class="cw-win-card" role="dialog" aria-label="Puzzle solved">
          <div class="cw-win-big" aria-hidden="true">🏆</div>
          <h2 class="display quiz-prompt">You solved it!</h2>
          <p>Crosswords solved: ${solved}</p>
          <button class="toy toy-sky" type="button" data-act="new">New puzzle</button>
        </div>`;
      el.appendChild(d);
      d.querySelector('button').focus();
    }, 600);
  }

  function check() {
    bad = new Set();
    let empty = 0;
    for (const w of puz.words) for (const i of w.cells) {
      const v = getE(i);
      if (!v) empty++;
      else if (v !== letterAt(i)) bad.add(i);
    }
    render();
    if (bad.size) {
      gridEl.classList.remove('wiggle'); void gridEl.offsetWidth; gridEl.classList.add('wiggle');
      ctx.toast(bad.size === 1 ? 'One letter needs another try' : `${bad.size} letters need another try`);
    } else ctx.toast(empty ? 'Looking good! Keep going' : 'All correct!');
  }

  function hint() {
    if (done) return;
    const w = activeWord();
    const wrong = (i) => getE(i) !== letterAt(i);
    let i = w.cells.find(wrong);
    if (i === undefined) for (const o of puz.words) { i = o.cells.find(wrong); if (i !== undefined) { dir = o.dir; break; } }
    if (i === undefined) return;
    setE(i, letterAt(i)); hinted.add(i); bad.delete(i);
    cur = i;
    const aw = activeWord();
    advance(aw);
    render();
    checkDone();
  }

  function onClick(e) {
    const b = e.target.closest('button');
    if (!b || !el.contains(b)) return;
    if (b.dataset.k) type(b.dataset.k);
    else if (b.dataset.i) selectCell(+b.dataset.i);
    else if (b.dataset.w) { const w = puz.words[+b.dataset.w]; if (!done) { dir = w.dir; cur = w.cells.find((i) => !getE(i)) ?? w.cells[0]; render(); } }
    else if (b.dataset.act === 'check') check();
    else if (b.dataset.act === 'hint') hint();
    else if (b.dataset.act === 'new') newPuzzle();
  }
  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[a-z]$/i.test(e.key)) { type(e.key.toUpperCase()); e.preventDefault(); }
    else if (e.key === 'Backspace') { type('DEL'); e.preventDefault(); }
  }

  el.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  newPuzzle();

  return () => {
    clearTimeout(winTimer);
    el.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    root.innerHTML = '';
  };
}
