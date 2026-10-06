// Caches the app shell so KidView opens with no internet connection.
// Videos, songs and art live in IndexedDB, not in this cache.
const CACHE = 'kidview-v5';
const SHELL = ['./', 'index.html', 'app.css', 'js/app.js', 'js/db.js', 'js/generator.js', 'js/paint.js', 'js/challenge.js', 'js/checkers.js', 'js/games/tictactoe.js', 'js/games/wordsearch.js', 'js/games/crossword.js', 'js/games/wordtiles.js', 'js/games/property.js',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && (new URL(e.request.url).origin === location.origin || e.request.url.includes('fonts.g'))) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
