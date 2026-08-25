export type ClientTier = 
  | 'Key Account (Tier 1)' 
  | 'Corporate' 
  | 'Venture / Tech' 
  | 'Family Office & Banca Privada';

export type ClientStatus = 'Activo' | 'En Auditoría KYC' | 'Inactivo';

export type KycStatus = 'Verificado (Nivel 1)' | 'Pendiente Documentación' | 'Revisión Anual';

export type AmlRiskLevel = 'Bajo' | 'Moderado' | 'Alto';

export type BillingModel = 'Por Horas' | 'Retainer Mensual' | 'Fixed Fee + Success' | 'Abono Mixto';

export interface CorporateClient {
  id: string;
  name: string;
  taxId: string; // NIF / CIF
  industry: string;
  tier: ClientTier;
  status: ClientStatus;
  kycStatus: KycStatus;
  amlRisk: AmlRiskLevel;
  leadPartner: string;
  billingModel: BillingModel;
  totalBilledYTD: number;
  openMattersCount: number;
  city: string;
  email: string;
  phone: string;
  headquarters: string;
  contactPerson: string;
  contactRole: string;
  notes: string;
  clientSince: string;
}
