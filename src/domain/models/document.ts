export type ConfidentialityLevel = 
  | 'Secreto Profesional (Nivel 1)' 
  | 'Estrictamente Confidencial (Socios)' 
  | 'Confidencial Bufete' 
  | 'Público / Registral';

export type DocumentCategory = 
  | 'Escrito Procesal' 
  | 'Contrato / SPA' 
  | 'Dictamen Jurídico' 
  | 'Prueba Documental' 
  | 'Poder Notarial' 
  | 'NDA / Secreto';

export type DocumentFileType = 'pdf' | 'docx' | 'xlsx' | 'signed_pdf';

export interface LegalDocument {
  id: string;
  caseId: string;
  caseCode: string;
  caseTitle: string;
  title: string;
  fileName: string;
  category: DocumentCategory;
  version: string;
  fileSize: string;
  fileType: DocumentFileType;
  uploadedAt: string;
  uploadedBy: string;
  confidentiality: ConfidentialityLevel;
  sha256: string;
  tags: string[];
  summary: string;
  pagesCount: number;
  isSigned: boolean;
}
