import { LegalDocument } from '../../domain/models/document';
import { INITIAL_DOCUMENTS } from '../../data/mockData';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

const STORAGE_KEY = 'caselok_docs';
const LEGACY_KEY = 'jurisnova_docs';

export class DocumentRepository {
  static getAll(): LegalDocument[] {
    return LocalStorageAdapter.getItem<LegalDocument[]>(STORAGE_KEY, INITIAL_DOCUMENTS, LEGACY_KEY);
  }

  static saveAll(documents: LegalDocument[]): void {
    LocalStorageAdapter.setItem(STORAGE_KEY, documents);
  }
}
