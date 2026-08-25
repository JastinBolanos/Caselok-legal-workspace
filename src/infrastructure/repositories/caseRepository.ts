import { LegalCase } from '../../domain/models/case';
import { INITIAL_CASES } from '../../data/mockData';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

const STORAGE_KEY = 'caselok_cases';
const LEGACY_KEY = 'jurisnova_cases';

export class CaseRepository {
  static getAll(): LegalCase[] {
    return LocalStorageAdapter.getItem<LegalCase[]>(STORAGE_KEY, INITIAL_CASES, LEGACY_KEY);
  }

  static saveAll(cases: LegalCase[]): void {
    LocalStorageAdapter.setItem(STORAGE_KEY, cases);
  }
}
