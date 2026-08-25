import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TRANSLATIONS } from './translations';
import { 
  JurisdictionType, 
  CaseStageId, 
  ConfidentialityLevel, 
  PriorityLevel, 
  CorporateClient, 
  JudicialEvent,
  LegalCase,
  FirmProfile
} from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  localizeJurisdiction: (j: JurisdictionType | string) => string;
  localizeStage: (stageId: CaseStageId | string) => string;
  localizePriority: (priority: PriorityLevel | string) => string;
  localizeRisk: (risk: string) => string;
  localizeRiskLevel: (risk: string) => string;
  localizeConfidentiality: (conf: ConfidentialityLevel | string) => string;
  localizeDocCategory: (cat: string) => string;
  localizeTimeCategory: (cat: string) => string;
  localizeEventType: (evt: JudicialEvent['eventType'] | string) => string;
  localizeStatus: (st: string) => string;
  localizeBillingModel: (model: string) => string;
  localizeTier: (tier: string) => string;
  localizeClientTier: (tier: string) => string;
  localizeKyc: (kyc: string) => string;
  localizeKycStatus: (kyc: string) => string;
  localizeConflictStatus: (st: string) => string;
  localizeCaseTitle: (code: string, originalTitle: string) => string;
  localizeCaseDesc: (code: string, originalDesc: string) => string;
  localizeFirmDesc: (firmId: string, originalDesc: string) => string;
  localizeFirmRole: (firmId: string, originalRole: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const JURISDICTION_MAP_EN: Record<string, string> = {
  'Mercantil & Societario': 'Corporate & Commercial',
  'Litigación & Arbitraje': 'Litigation & Arbitration',
  'M&A / Fusiones y Adquisiciones': 'M&A / Mergers & Acquisitions',
  'Penal Económico & Compliance': 'White-Collar Crime & Compliance',
  'Laboral & Reestructuraciones': 'Employment & Restructuring',
  'Fiscal & Tributario Internacional': 'Tax & International Wealth',
  'Propiedad Intelectual & Tech': 'IP & Technology Law',
};

const STAGE_MAP_EN: Record<string, string> = {
  'intake': '1. Intake & Compliance',
  'analysis': '2. Due Diligence & Analysis',
  'drafting': '3. Drafting & Negotiation',
  'litigation': '4. Litigation & Court Proceeding',
  'closing': '5. Closing, Judgment & Execution',
};

const PRIORITY_MAP_EN: Record<string, string> = {
  'Urgente / Perentorio': 'Urgent / Peremptory',
  'Alta': 'High',
  'Media': 'Medium',
  'Baja': 'Low',
};

const RISK_MAP_EN: Record<string, string> = {
  'Bajo': 'Low',
  'Moderado': 'Moderate',
  'Alto': 'High',
  'Crítico': 'Critical',
};

const CONFIDENTIALITY_MAP_EN: Record<string, string> = {
  'Secreto Profesional (Nivel 1)': 'Attorney-Client Privilege (Level 1)',
  'Estrictamente Confidencial (Socios)': 'Strictly Confidential (Partners)',
  'Confidencial Bufete': 'Firm Confidential',
  'Público / Registral': 'Public / Registry',
};

const DOC_CATEGORY_MAP_EN: Record<string, string> = {
  'Escrito Procesal': 'Court Pleading / Filing',
  'Contrato / SPA': 'Contract / SPA Agreement',
  'Dictamen Jurídico': 'Legal Opinion / Brief',
  'Prueba Documental': 'Documentary Evidence',
  'Poder Notarial': 'Power of Attorney',
  'NDA / Secreto': 'NDA / Secrecy Agreement',
};

const TIME_CATEGORY_MAP_EN: Record<string, string> = {
  'Redacción': 'Drafting & Pleadings',
  'Reunión / Audiencia': 'Hearing / Client Meeting',
  'Estudio y Análisis': 'Legal Research & Due Diligence',
  'Negociación': 'Contract Negotiation',
  'Gestión Procesal': 'Court Docket & Procedures',
};

const EVENT_TYPE_MAP_EN: Record<string, string> = {
  'Señalamiento de Vista': 'Court Hearing',
  'Audiencia Previa': 'Preliminary Hearing',
  'Vencimiento Recurso': 'Appeal Deadline',
  'Escrito de Conclusiones': 'Closing Written Brief',
  'Junta General Extraordinaria': 'Shareholders Extraordinary Meeting',
  'Requerimiento Judicial': 'Judicial Injunction / Requirement',
  'Firma Notarial': 'Notary Closing',
};

const STATUS_MAP_EN: Record<string, string> = {
  'Pendiente': 'Pending',
  'Completado': 'Completed',
  'Aplazado': 'Postponed',
  'Activo': 'Active',
  'En Auditoría KYC': 'In KYC Audit',
  'Inactivo': 'Inactive',
};

const BILLING_MODEL_MAP_EN: Record<string, string> = {
  'Por Horas': 'Hourly Billing',
  'Retainer Mensual': 'Monthly Retainer',
  'Fixed Fee + Success': 'Fixed Fee + Success',
  'Abono Mixto': 'Hybrid Retainer',
};

const TIER_MAP_EN: Record<string, string> = {
  'Key Account (Tier 1)': 'Key Account (Tier 1)',
  'Corporate': 'Corporate Mid-Market',
  'Venture / Tech': 'Venture & High-Growth Tech',
  'Family Office & Banca Privada': 'Family Office & Private Wealth',
};

const KYC_MAP_EN: Record<string, string> = {
  'Verificado (Nivel 1)': 'Verified (Level 1)',
  'Pendiente Documentación': 'Pending Documentation',
  'Revisión Anual': 'Annual Review',
};

const CONFLICT_STATUS_MAP_EN: Record<string, string> = {
  'Limpio / Clearance Aprobado': 'Clear / Clearance Approved',
  'Conflicto Detectado': 'Conflict Detected',
  'Requiere Autorización Socio': 'Requires Partner Authorization',
};

// Case titles translation map
const CASE_TITLE_MAP_EN: Record<string, string> = {
  'EXP-2025-019': 'Acquisition of Renewable Assets (Wind Farms Helios & Eos)',
  'EXP-2025-042': 'Arbitration on Natural Gas Supply Price Revision (ICC Paris)',
  'EXP-2025-084': 'Challenge to Corporate Resolution & Minority Shareholder Squeeze-Out',
  'EXP-2025-112': 'Internal Corporate Compliance Investigation & Whistleblowing',
  'EXP-2025-156': 'Collective Dismissal & Labor Restructuring Procedure (ERE)',
  'EXP-2025-201': 'APA & Cross-Border IP License Agreement with San Francisco Tech',
  'EXP-2025-220': 'Tax Appeal on Transfer Pricing & Non-Resident Withholding (TEAC)',
  'EXP-2025-275': 'Urgent Injunction on Industrial Trade Secrets & Infringement',
};

const CASE_DESC_MAP_EN: Record<string, string> = {
  'EXP-2025-019': 'Comprehensive legal audit, drafting of share purchase agreement (SPA), shareholder agreements and collateral package.',
  'EXP-2025-042': 'International arbitration claim under ICC Rules regarding long-term gas supply price review clause.',
  'EXP-2025-084': 'Special commercial lawsuit challenging nullity of general meeting resolutions and director liability action.',
  'EXP-2025-112': 'Forensic compliance audit regarding suspected anti-corruption irregularities under Spanish Criminal Code Art. 31 bis.',
  'EXP-2025-156': 'Negotiation of workforce reduction plan with trade unions, severance structuring, and labor authority consultation.',
  'EXP-2025-201': 'Drafting Asset Purchase Agreement, patents and source code cross-licensing under NY and EU law.',
  'EXP-2025-220': 'Economic-administrative claim challenging tax assessments on royalty payments and international transfer pricing.',
  'EXP-2025-275': 'Civil lawsuit requesting urgent preliminary injunctive relief for misappropriation of confidential source code.',
};

const FIRM_DESC_MAP_EN: Record<string, string> = {
  'caselok': 'Elite practice specializing in corporate M&A, complex commercial litigation, and international arbitration.',
  'jurisnova': 'Elite practice specializing in corporate M&A, complex commercial litigation, and international arbitration.',
  'advocatus': 'Strategic defense in white-collar crime, transnational compliance, and financial restructurings.',
  'lexaflow': 'Venture capital, intellectual property technology, and digital assets regulatory advisory.',
};

const FIRM_ROLE_MAP_EN: Record<string, string> = {
  'caselok': 'Managing Partner | Litigation & M&A Practice',
  'jurisnova': 'Managing Partner | Litigation & M&A Practice',
  'advocatus': 'Senior Partner | White-Collar Crime & Compliance',
  'lexaflow': 'Head of Technology & Cross-Border Transactions',
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('caselok_lang') || localStorage.getItem('jurisnova_lang');
    return (saved === 'en' || saved === 'es') ? saved : 'es';
  });

  useEffect(() => {
    localStorage.setItem('caselok_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'es' ? 'en' : 'es'));
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    return fallback || key;
  };

  const localizeJurisdiction = (j: JurisdictionType | string): string => {
    if (language === 'en' && JURISDICTION_MAP_EN[j]) {
      return JURISDICTION_MAP_EN[j];
    }
    return j;
  };

  const localizeStage = (stageId: CaseStageId | string): string => {
    if (language === 'en' && STAGE_MAP_EN[stageId]) {
      return STAGE_MAP_EN[stageId];
    }
    // Fallback Spanish stage name
    const ES_STAGES: Record<string, string> = {
      'intake': '1. Intake & Compliance',
      'analysis': '2. Due Diligence & Análisis',
      'drafting': '3. Redacción & Negociación',
      'litigation': '4. Litigación & Sede Judicial',
      'closing': '5. Cierre, Sentencia & Ejecución',
    };
    return ES_STAGES[stageId] || stageId;
  };

  const localizePriority = (priority: PriorityLevel | string): string => {
    if (language === 'en' && PRIORITY_MAP_EN[priority]) {
      return PRIORITY_MAP_EN[priority];
    }
    return priority;
  };

  const localizeRisk = (risk: string): string => {
    if (language === 'en' && RISK_MAP_EN[risk]) {
      return RISK_MAP_EN[risk];
    }
    return risk;
  };

  const localizeConfidentiality = (conf: ConfidentialityLevel | string): string => {
    if (language === 'en' && CONFIDENTIALITY_MAP_EN[conf]) {
      return CONFIDENTIALITY_MAP_EN[conf];
    }
    return conf;
  };

  const localizeDocCategory = (cat: string): string => {
    if (language === 'en' && DOC_CATEGORY_MAP_EN[cat]) {
      return DOC_CATEGORY_MAP_EN[cat];
    }
    return cat;
  };

  const localizeTimeCategory = (cat: string): string => {
    if (language === 'en' && TIME_CATEGORY_MAP_EN[cat]) {
      return TIME_CATEGORY_MAP_EN[cat];
    }
    return cat;
  };

  const localizeEventType = (evt: JudicialEvent['eventType'] | string): string => {
    if (language === 'en' && EVENT_TYPE_MAP_EN[evt]) {
      return EVENT_TYPE_MAP_EN[evt];
    }
    return evt;
  };

  const localizeStatus = (st: string): string => {
    if (language === 'en' && STATUS_MAP_EN[st]) {
      return STATUS_MAP_EN[st];
    }
    return st;
  };

  const localizeBillingModel = (model: string): string => {
    if (language === 'en' && BILLING_MODEL_MAP_EN[model]) {
      return BILLING_MODEL_MAP_EN[model];
    }
    return model;
  };

  const localizeTier = (tier: string): string => {
    if (language === 'en' && TIER_MAP_EN[tier]) {
      return TIER_MAP_EN[tier];
    }
    return tier;
  };

  const localizeKyc = (kyc: string): string => {
    if (language === 'en' && KYC_MAP_EN[kyc]) {
      return KYC_MAP_EN[kyc];
    }
    return kyc;
  };

  const localizeConflictStatus = (st: string): string => {
    if (language === 'en' && CONFLICT_STATUS_MAP_EN[st]) {
      return CONFLICT_STATUS_MAP_EN[st];
    }
    return st;
  };

  const localizeCaseTitle = (code: string, originalTitle: string): string => {
    if (language === 'en' && CASE_TITLE_MAP_EN[code]) {
      return CASE_TITLE_MAP_EN[code];
    }
    return originalTitle;
  };

  const localizeCaseDesc = (code: string, originalDesc: string): string => {
    if (language === 'en' && CASE_DESC_MAP_EN[code]) {
      return CASE_DESC_MAP_EN[code];
    }
    return originalDesc;
  };

  const localizeFirmDesc = (firmId: string, originalDesc: string): string => {
    if (language === 'en' && FIRM_DESC_MAP_EN[firmId]) {
      return FIRM_DESC_MAP_EN[firmId];
    }
    return originalDesc;
  };

  const localizeFirmRole = (firmId: string, originalRole: string): string => {
    if (language === 'en' && FIRM_ROLE_MAP_EN[firmId]) {
      return FIRM_ROLE_MAP_EN[firmId];
    }
    return originalRole;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        localizeJurisdiction,
        localizeStage,
        localizePriority,
        localizeRisk,
        localizeRiskLevel: localizeRisk,
        localizeConfidentiality,
        localizeDocCategory,
        localizeTimeCategory,
        localizeEventType,
        localizeStatus,
        localizeBillingModel,
        localizeTier,
        localizeClientTier: localizeTier,
        localizeKyc,
        localizeKycStatus: localizeKyc,
        localizeConflictStatus,
        localizeCaseTitle,
        localizeCaseDesc,
        localizeFirmDesc,
        localizeFirmRole
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
