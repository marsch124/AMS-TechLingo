/* AMS TechLingo — IndexedDB layer.
   One database, two stores:
   - entries: {id, term, category, en, de, sv, notes, favorite, source, createdAt, updatedAt, photo(Blob|null)}
   - meta:    {key, value} — seeded flag etc.
   Local-only app: no sync, no automatic backups that could overwrite themselves. */

const TL_DB = (() => {
    const DB_NAME = 'ams-techlingo';
    const DB_VERSION = 1;
    let dbPromise = null;

    function open() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains('entries')) {
                    db.createObjectStore('entries', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('meta')) {
                    db.createObjectStore('meta', { keyPath: 'key' });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
        return dbPromise;
    }

    function tx(store, mode, fn) {
        return open().then((db) => new Promise((resolve, reject) => {
            const t = db.transaction(store, mode);
            const s = t.objectStore(store);
            const out = fn(s);
            t.oncomplete = () => resolve(out && out.result !== undefined ? out.result : undefined);
            t.onerror = () => reject(t.error);
            t.onabort = () => reject(t.error);
        }));
    }

    return {
        getAllEntries() {
            return open().then((db) => new Promise((resolve, reject) => {
                const req = db.transaction('entries', 'readonly').objectStore('entries').getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => reject(req.error);
            }));
        },
        putEntry(entry) {
            return tx('entries', 'readwrite', (s) => s.put(entry));
        },
        putEntries(entries) {
            return open().then((db) => new Promise((resolve, reject) => {
                const t = db.transaction('entries', 'readwrite');
                const s = t.objectStore('entries');
                entries.forEach((e) => s.put(e));
                t.oncomplete = () => resolve();
                t.onerror = () => reject(t.error);
            }));
        },
        deleteEntry(id) {
            return tx('entries', 'readwrite', (s) => s.delete(id));
        },
        clearEntries() {
            return tx('entries', 'readwrite', (s) => s.clear());
        },
        getMeta(key) {
            return open().then((db) => new Promise((resolve, reject) => {
                const req = db.transaction('meta', 'readonly').objectStore('meta').get(key);
                req.onsuccess = () => resolve(req.result ? req.result.value : undefined);
                req.onerror = () => reject(req.error);
            }));
        },
        setMeta(key, value) {
            return tx('meta', 'readwrite', (s) => s.put({ key, value }));
        }
    };
})();
