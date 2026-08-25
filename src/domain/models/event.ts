export type JudicialEventType = 
  | 'Señalamiento de Vista' 
  | 'Audiencia Previa' 
  | 'Vencimiento Recurso' 
  | 'Escrito de Conclusiones' 
  | 'Junta General Extraordinaria' 
  | 'Requerimiento Judicial' 
  | 'Firma Notarial';

export type JudicialEventStatus = 'Pendiente' | 'Completado' | 'Aplazado';

export interface JudicialEvent {
  id: string;
  caseId: string;
  caseCode: string;
  caseTitle: string;
  client: string;
  title: string;
  eventType: JudicialEventType;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30"
  courtroom?: string;
  judgeOrAuthority?: string;
  lawyer: string;
  isUrgentLEC: boolean;
  status: JudicialEventStatus;
  notes: string;
}
