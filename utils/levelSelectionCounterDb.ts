import { LevelSelectionCounters } from '../types';

const DB_NAME = 'sentency-db';
const DB_VERSION = 1;
const STORE_NAME = 'level-selection-counters';

interface LevelSelectionCounterRecord {
  levelKey: string;
  count: number;
  updatedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

export function normalizeLevelCounterKey(levelName: string): string {
  return levelName.trim().toLowerCase();
}

function openLevelSelectionDb(): Promise<IDBDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'levelKey' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });

  return dbPromise;
}

export async function getAllLevelSelectionCounts(): Promise<LevelSelectionCounters> {
  try {
    const db = await openLevelSelectionDb();

    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const result: LevelSelectionCounters = {};
        const records = (request.result as LevelSelectionCounterRecord[]) ?? [];
        for (const record of records) {
          result[record.levelKey] = record.count;
        }
        resolve(result);
      };

      request.onerror = () => reject(request.error ?? new Error('Failed to read level selection counters'));
    });
  } catch {
    return {};
  }
}

export async function incrementLevelSelectionCount(levelName: string): Promise<number> {
  const levelKey = normalizeLevelCounterKey(levelName);

  try {
    const db = await openLevelSelectionDb();

    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(levelKey);

      getRequest.onsuccess = () => {
        const existingRecord = getRequest.result as LevelSelectionCounterRecord | undefined;
        const nextCount = (existingRecord?.count ?? 0) + 1;
        const nextRecord: LevelSelectionCounterRecord = {
          levelKey,
          count: nextCount,
          updatedAt: Date.now(),
        };
        const putRequest = store.put(nextRecord);

        putRequest.onsuccess = () => resolve(nextCount);
        putRequest.onerror = () => reject(putRequest.error ?? new Error('Failed to persist level selection counter'));
      };

      getRequest.onerror = () => reject(getRequest.error ?? new Error('Failed to load level selection counter'));
    });
  } catch {
    return 0;
  }
}
