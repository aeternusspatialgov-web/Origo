
// --- INDEXED DB WRAPPER (No external deps) ---

const DB_NAME = 'origo_db';
const DB_VERSION = 2; // Upgraded for File Handles support

const STORES = {
    SESSION: 'active_session',
    HANDLES: 'file_handles', // Stores FileSystemFileHandle objects
    RECENTS: 'recent_files'  // Stores metadata (id, title, date)
};

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.SESSION)) {
        db.createObjectStore(STORES.SESSION);
      }
      if (!db.objectStoreNames.contains(STORES.HANDLES)) {
        db.createObjectStore(STORES.HANDLES);
      }
      if (!db.objectStoreNames.contains(STORES.RECENTS)) {
        db.createObjectStore(STORES.RECENTS, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// --- GENERIC HELPERS ---

const putItem = async (storeName: string, key: string | undefined, value: any) => {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      // If store has keyPath, we don't pass key argument
      const request = key ? store.put(value, key) : store.put(value);

      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error ?? request.error);
      transaction.onerror = () => reject(transaction.error ?? request.error);
      request.onerror = () => reject(request.error);
    });
};

const getItem = async (storeName: string, key: string): Promise<any> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
};

const getAllItems = async (storeName: string): Promise<any[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// --- SPECIFIC EXPORTS ---

export const saveSessionToDB = (key: string, value: any) => putItem(STORES.SESSION, key, value);
export const loadSessionFromDB = (key: string) => getItem(STORES.SESSION, key);

// File Handles (The bridge to the real disk)
export const saveFileHandle = (boardId: string, handle: any) => putItem(STORES.HANDLES, boardId, handle);
export const getFileHandle = (boardId: string) => getItem(STORES.HANDLES, boardId);

// Recent Files List (Metadata only)
// Updated signature to allow flexible metadata
export const saveRecentEntry = (entry: any) => putItem(STORES.RECENTS, undefined, entry);
export const getRecentFilesList = () => getAllItems(STORES.RECENTS);

export const clearSessionInDB = async (key: string) => {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORES.SESSION], 'readwrite');
      const store = transaction.objectStore(STORES.SESSION);
      const request = store.delete(key);

      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error ?? request.error);
      transaction.onerror = () => reject(transaction.error ?? request.error);
      request.onerror = () => reject(request.error);
    });
};
