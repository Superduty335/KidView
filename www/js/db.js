// Small IndexedDB wrapper. Everything stays on the device, so videos and
// songs keep working with no internet connection.
//   kv    – settings and profiles
//   media – imported videos and songs (file blobs)
//   art   – saved coloring pages per kid

let dbp = null;
function open() {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    const req = indexedDB.open('kidview', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore('kv');
      db.createObjectStore('media', { keyPath: 'id' });
      db.createObjectStore('art', { keyPath: 'id' }).createIndex('profileId', 'profileId');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp;
}

function run(store, mode, fn) {
  return open().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const req = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(req && req.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}

export const db = {
  get: (store, key) => run(store, 'readonly', (s) => s.get(key)),
  put: (store, val, key) => run(store, 'readwrite', (s) => (key === undefined ? s.put(val) : s.put(val, key))),
  del: (store, key) => run(store, 'readwrite', (s) => s.delete(key)),
  all: (store) => run(store, 'readonly', (s) => s.getAll()),
  byIndex: (store, index, value) => run(store, 'readonly', (s) => s.index(index).getAll(value)),
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
