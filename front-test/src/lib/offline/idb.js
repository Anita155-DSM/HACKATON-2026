// Envoltorio mínimo de IndexedDB con promesas (sin dependencias).
const DB_NAME = 'puente';
const DB_VERSION = 1;
export const STORES = { materials: 'materials', audios: 'audios', pending: 'pending' };

let dbPromise;

function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('Este navegador no permite guardar materiales'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORES.materials)) db.createObjectStore(STORES.materials, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORES.audios)) db.createObjectStore(STORES.audios);
      if (!db.objectStoreNames.contains(STORES.pending)) db.createObjectStore(STORES.pending);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    const req = fn(s);
    t.oncomplete = () => resolve(req?.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

export const idbGet = (store, key) => tx(store, 'readonly', (s) => s.get(key));
export const idbPut = (store, value, key) => tx(store, 'readwrite', (s) => (key === undefined ? s.put(value) : s.put(value, key)));
export const idbDelete = (store, key) => tx(store, 'readwrite', (s) => s.delete(key));
export const idbAll = (store) => tx(store, 'readonly', (s) => s.getAll());
export const idbKeys = (store) => tx(store, 'readonly', (s) => s.getAllKeys());
