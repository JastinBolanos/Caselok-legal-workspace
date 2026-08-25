import { JudicialEvent } from '../../domain/models/event';
import { INITIAL_JUDICIAL_EVENTS } from '../../data/mockData';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

const STORAGE_KEY = 'caselok_events';
const LEGACY_KEY = 'jurisnova_events';

export class AgendaRepository {
  static getAll(): JudicialEvent[] {
    return LocalStorageAdapter.getItem<JudicialEvent[]>(STORAGE_KEY, INITIAL_JUDICIAL_EVENTS, LEGACY_KEY);
  }

  static saveAll(events: JudicialEvent[]): void {
    LocalStorageAdapter.setItem(STORAGE_KEY, events);
  }
}
