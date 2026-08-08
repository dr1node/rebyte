export type QueuedRequestKind = 'feedback' | 'analytics';

export type QueuedRequest = {
  id?: number;
  kind: QueuedRequestKind;
  payload: Record<string, unknown>;
  createdAt: number;
};

const DB_NAME = 'rebyte-offline-db';
const STORE_NAME = 'queuedRequests';
const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfjXDGSZhop-T5W3zIGx_SCXBRI7xR1dulWeuqtMyOa8jaMrQ/formResponse';

function isIndexedDbAvailable() {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDbAvailable()) {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB.'));
  });
}

export async function queueRequest(kind: QueuedRequestKind, payload: Record<string, unknown>) {
  if (!isIndexedDbAvailable()) {
    return null;
  }

  const db = await openDatabase();

  return new Promise<number | null>((resolve, reject) => {
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add({ kind, payload, createdAt: Date.now() } satisfies QueuedRequest);

      request.onsuccess = () => resolve(typeof request.result === 'number' ? request.result : null);
      request.onerror = () => reject(request.error ?? new Error('Unable to queue request.'));
    } catch (error) {
      reject(error);
    }
  });
}

export async function getQueuedRequests(): Promise<QueuedRequest[]> {
  if (!isIndexedDbAvailable()) {
    return [];
  }

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = Array.isArray(request.result) ? request.result : [];
        resolve(result.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0)));
      };
      request.onerror = () => reject(request.error ?? new Error('Unable to read queued requests.'));
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteQueuedRequests(ids: number[]) {
  if (!ids.length || !isIndexedDbAvailable()) {
    return;
  }

  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      ids.forEach((id) => store.delete(id));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('Unable to remove queued requests.'));
    } catch (error) {
      reject(error);
    }
  });
}

async function sendQueuedFeedback(payload: Record<string, unknown>) {
  const rating = String(payload.rating ?? '');
  const feedback = String(payload.feedback ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const formData = new URLSearchParams();

  formData.set('entry.986012193', rating);
  formData.set('entry.1332637419', feedback);
  if (email) formData.set('entry.866272866', email);

  await fetch(FEEDBACK_FORM_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });
}

async function sendQueuedAnalytics(payload: Record<string, unknown>) {
  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function submitQueuedRequest(item: QueuedRequest) {
  if (item.kind === 'feedback') {
    await sendQueuedFeedback(item.payload);
    return;
  }

  if (item.kind === 'analytics') {
    await sendQueuedAnalytics(item.payload);
  }
}

export async function syncQueuedRequests() {
  if (!isIndexedDbAvailable()) {
    return;
  }

  const queued = await getQueuedRequests();
  if (!queued.length) {
    return;
  }

  const idsToRemove: number[] = [];

  for (const item of queued) {
    if (typeof item.id !== 'number') {
      continue;
    }

    try {
      await submitQueuedRequest(item);
      idsToRemove.push(item.id);
    } catch (error) {
      console.warn('Unable to sync queued request:', error);
      break;
    }
  }

  if (idsToRemove.length) {
    await deleteQueuedRequests(idsToRemove);
  }
}
