export type JurisdictionType = 
  | 'Mercantil & Societario'
  | 'Litigación & Arbitraje'
  | 'M&A / Fusiones y Adquisiciones'
  | 'Penal Económico & Compliance'
  | 'Laboral & Reestructuraciones'
  | 'Fiscal & Tributario Internacional'
  | 'Propiedad Intelectual & Tech';

export type CaseStageId = 'intake' | 'analysis' | 'drafting' | 'litigation' | 'closing';

export type PriorityLevel = 'Urgente / Perentorio' | 'Alta' | 'Media' | 'Baja';

export interface KeyMilestone {
  title: string;
  date: string;
  completed: boolean;
}

export interface LegalCase {
  id: string;
  code: string; // e.g. EXP-2025-084
  title: string;
  client: string;
  clientAvatar?: string;
  jurisdiction: JurisdictionType;
  stageId: CaseStageId;
  leadLawyer: string;
  leadLawyerRole: string;
  opposingParty: string;
  courtCourtroom?: string;
  disputedAmount: number;
  hourlyRate: number;
  budgetHours: number;
  loggedHours: number;
  nextDeadline: string;
  deadlineDescription: string;
  priority: PriorityLevel;
  riskLevel: 'Bajo' | 'Moderado' | 'Alto' | 'Crítico';
  description: string;
  createdAt: string;
  tags: string[];
  keyMilestones: KeyMilestone[];
}
