import { TimeEntry } from '../../domain/models/timeEntry';
import { INITIAL_TIME_ENTRIES } from '../../data/mockData';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

const STORAGE_KEY = 'caselok_times';
const LEGACY_KEY = 'jurisnova_times';

export class TimeBillingRepository {
  static getAll(): TimeEntry[] {
    return LocalStorageAdapter.getItem<TimeEntry[]>(STORAGE_KEY, INITIAL_TIME_ENTRIES, LEGACY_KEY);
  }

  static saveAll(entries: TimeEntry[]): void {
    LocalStorageAdapter.setItem(STORAGE_KEY, entries);
  }
}
