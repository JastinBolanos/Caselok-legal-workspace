export type TimeEntryCategory = 
  | 'Redacción' 
  | 'Reunión / Audiencia' 
  | 'Estudio y Análisis' 
  | 'Negociación' 
  | 'Gestión Procesal';

export interface TimeEntry {
  id: string;
  caseId: string;
  caseCode: string;
  caseTitle: string;
  client: string;
  lawyer: string;
  description: string;
  date: string;
  durationSeconds: number; // in seconds
  hourlyRate: number;
  billableAmount: number;
  isBillable: boolean;
  invoiced: boolean;
  category: TimeEntryCategory;
}
