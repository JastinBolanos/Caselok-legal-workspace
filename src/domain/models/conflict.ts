export type EntityType = 'Persona Jurídica' | 'Persona Física' | 'Fondo / Holding';

export type ConflictStatus = 
  | 'Limpio / Clearance Aprobado' 
  | 'Conflicto Detectado' 
  | 'Requiere Autorización Socio';

export interface ConflictCheckRecord {
  id: string;
  searchedEntity: string;
  entityType: EntityType;
  requesterLawyer: string;
  requestedAt: string;
  status: ConflictStatus;
  conflictsFoundCount: number;
  adverseMatters?: string[];
  clearanceCertificateId?: string;
  jurisdiction: string;
  notes: string;
}
