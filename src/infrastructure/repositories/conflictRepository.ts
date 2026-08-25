import { ConflictCheckRecord } from '../../domain/models/conflict';
import { INITIAL_CONFLICT_RECORDS } from '../../data/mockData';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

const STORAGE_KEY = 'caselok_conflicts';
const LEGACY_KEY = 'jurisnova_conflicts';

export class ConflictRepository {
  static getAll(): ConflictCheckRecord[] {
    return LocalStorageAdapter.getItem<ConflictCheckRecord[]>(STORAGE_KEY, INITIAL_CONFLICT_RECORDS, LEGACY_KEY);
  }

  static saveAll(records: ConflictCheckRecord[]): void {
    LocalStorageAdapter.setItem(STORAGE_KEY, records);
  }
}
