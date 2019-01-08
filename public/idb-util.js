/*global idb: false */

// See https://github.com/jakearchibald/idb.

// This was copied from node_modules/idb/lib/idb.js to public.
self.importScripts('idb.js');

/**
 * Returns an object with methods for
 * the most common IndexedDB operations.
 * Every operation is performed in its own transaction.
 * Don't use this if you need multiple operations
 * to be in the same transaction.
 */
function getIdbUtil(dbName, storeName) {
  const dbPromise = idb.open(dbName, 1, upgradeDB => {
    upgradeDB.createObjectStore(storeName);
  });

  return {
    async get(key) {
      const db = await dbPromise;
      return db
        .transaction(storeName)
        .objectStore(storeName)
        .get(key);
    },
    async set(key, val) {
      const db = await dbPromise;
      return db
        .transaction(storeName, 'readwrite')
        .objectStore(storeName)
        .put(val, key).complete;
    },
    async delete(key) {
      const db = await dbPromise;
      return db
        .transaction(storeName, 'readwrite')
        .objectStore(storeName)
        .delete(key).complete;
    },
    async clear() {
      const db = await dbPromise;
      return db
        .transaction(storeName, 'readwrite')
        .objectStore(storeName)
        .clear().complete;
    },
    async keys() {
      const db = await dbPromise;
      return db
        .transaction(storeName)
        .objectStore(storeName)
        .getAllKeys();
    }
  };
}
