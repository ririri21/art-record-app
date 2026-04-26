function compress(src, maxSize = 800, quality = 0.75) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

const DB_NAME = 'artRecordDB';
const DB_VERSION = 1;
const STORE = 'artworks';

let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('savedAt', 'savedAt');
      }
    };
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

const artDB = {
  async getAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly')
        .objectStore(STORE).getAll();
      req.onsuccess = () => {
        const sorted = req.result.sort((a, b) =>
          (b.savedAt || '').localeCompare(a.savedAt || ''));
        resolve(sorted);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async save(artwork) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readwrite')
        .objectStore(STORE).put(artwork);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async delete(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readwrite')
        .objectStore(STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async migrateFromLocalStorage() {
    const data = localStorage.getItem('artCollection');
    if (!data) return;
    const artworks = JSON.parse(data);
    for (const artwork of artworks) {
      try {
        const image = await compress(artwork.image);
        await this.save({ ...artwork, image });
      } catch (e) {
        console.warn('item migration failed:', artwork.id, e);
      }
    }
    localStorage.removeItem('artCollection');
  },
};
