import { FirmProfile } from '../../domain/models/firm';
import { FIRM_PROFILES } from '../../data/mockData';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

const STORAGE_KEY = 'caselok_firm';
const LEGACY_KEY = 'jurisnova_firm';

export class FirmRepository {
  static getActiveFirm(): FirmProfile {
    return LocalStorageAdapter.getItem<FirmProfile>(STORAGE_KEY, FIRM_PROFILES[0], LEGACY_KEY);
  }

  static saveActiveFirm(firm: FirmProfile): void {
    LocalStorageAdapter.setItem(STORAGE_KEY, firm);
  }

  static getAvailableProfiles(): FirmProfile[] {
    return FIRM_PROFILES;
  }
}
