/**
 * Infrastructure Layer: Safe Local Storage Adapter with fallback and error handling.
 */
export class LocalStorageAdapter {
  static getItem<T>(key: string, fallback: T, legacyKey?: string): T {
    try {
      const raw = localStorage.getItem(key) || (legacyKey ? localStorage.getItem(legacyKey) : null);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[LocalStorageAdapter] Error reading key "${key}":`, err);
      return fallback;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[LocalStorageAdapter] Error writing key "${key}":`, err);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`[LocalStorageAdapter] Error removing key "${key}":`, err);
    }
  }
}
