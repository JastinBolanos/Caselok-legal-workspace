import { LegalCase } from '../models/case';
import { CorporateClient } from '../models/client';
import { ConflictStatus } from '../models/conflict';

export interface ConflictSearchResult {
  matchCount: number;
  adverseMatters: string[];
  status: ConflictStatus;
}

/**
 * Pure domain logic to verify adverse party / entity conflicts across current firm cases and clients.
 */
export function evaluateConflictClearance(
  query: string,
  cases: LegalCase[],
  clients: CorporateClient[]
): ConflictSearchResult {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return {
      matchCount: 0,
      adverseMatters: [],
      status: 'Limpio / Clearance Aprobado',
    };
  }

  const adverseMatters: string[] = [];

  // Check matching clients
  clients.forEach(cl => {
    if (cl.name.toLowerCase().includes(cleanQuery) || cl.taxId.toLowerCase().includes(cleanQuery)) {
      adverseMatters.push(`Cliente Actual: ${cl.name} (${cl.taxId})`);
    }
  });

  // Check opposing parties and clients in cases
  cases.forEach(cs => {
    if (cs.opposingParty.toLowerCase().includes(cleanQuery)) {
      adverseMatters.push(`Parte Contraria en: ${cs.code} - ${cs.title} (Cliente: ${cs.client})`);
    } else if (cs.client.toLowerCase().includes(cleanQuery)) {
      adverseMatters.push(`Asunto Vinculado: ${cs.code} - ${cs.title}`);
    }
  });

  const count = adverseMatters.length;
  let status: ConflictStatus = 'Limpio / Clearance Aprobado';

  if (count > 0) {
    status = adverseMatters.some(m => m.startsWith('Parte Contraria'))
      ? 'Conflicto Detectado'
      : 'Requiere Autorización Socio';
  }

  return {
    matchCount: count,
    adverseMatters,
    status,
  };
}
