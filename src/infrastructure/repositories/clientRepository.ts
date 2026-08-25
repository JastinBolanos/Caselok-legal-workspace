import { CorporateClient } from '../../domain/models/client';
import { INITIAL_CLIENTS } from '../../data/mockData';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

const STORAGE_KEY = 'caselok_clients';
const LEGACY_KEY = 'jurisnova_clients';

export class ClientRepository {
  static getAll(): CorporateClient[] {
    return LocalStorageAdapter.getItem<CorporateClient[]>(STORAGE_KEY, INITIAL_CLIENTS, LEGACY_KEY);
  }

  static saveAll(clients: CorporateClient[]): void {
    LocalStorageAdapter.setItem(STORAGE_KEY, clients);
  }
}
