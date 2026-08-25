import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin
} from 'lucide-react';
import { CorporateClient, LegalCase, TimeEntry } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ClientDetailModalProps {
  client: CorporateClient | null;
  cases: LegalCase[];
  timeEntries: TimeEntry[];
  onClose: () => void;
  onSelectCase: (legalCase: LegalCase) => void;
  onOpenConflictModal: (clientName: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  cases,
  timeEntries,
  onClose,
  onSelectCase,
  onOpenConflictModal,
}) => {
  const { language, localizeClientTier, localizeKycStatus, localizeBillingModel, localizeJurisdiction, localizeCaseTitle } = useLanguage();
  if (!client) return null;

  const clientCases = cases.filter(c => c.client === client.name);
  const clientEntries = timeEntries.filter(e => e.client === client.name);
  const totalBilledHours = clientEntries.reduce((acc, e) => acc + (e.durationSeconds / 3600), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="serif text-xl font-bold text-slate-900">{client.name}</h2>
                <span className="mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {client.taxId}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-white font-medium">
                  {localizeClientTier(client.tier)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                <span>{client.industry}</span>
                <span>•</span>
                <span>{language === 'es' ? `Cliente desde ${client.clientSince}` : `Client since ${client.clientSince}`}</span>
                <span>•</span>
                <span>{language === 'es' ? 'Socio Responsable:' : 'Lead Partner:'} {client.leadPartner}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenConflictModal(client.name)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>{language === 'es' ? 'Verificar Conflicto' : 'Conflict Check'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 font-mono p-1 text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-[11px]">{language === 'es' ? 'Expedientes Abiertos' : 'Active Matters'}</div>
              <div className="mono text-lg font-bold text-slate-900 mt-1">{clientCases.length} {language === 'es' ? 'asuntos' : 'cases'}</div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-[11px]">{language === 'es' ? 'Horas Imputadas' : 'Hours Logged'}</div>
              <div className="mono text-lg font-bold text-slate-900 mt-1">{totalBilledHours.toFixed(1)} h</div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-[11px]">{language === 'es' ? 'Honorarios Totales YTD' : 'YTD Fees Billed'}</div>
              <div className="mono text-lg font-bold text-emerald-700 mt-1">€ {client.totalBilledYTD.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}</div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-[11px]">{language === 'es' ? 'Régimen de Cobro' : 'Fee Agreement'}</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">{localizeBillingModel(client.billingModel)}</div>
            </div>
          </div>

          {/* Contact & KYC Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="serif font-bold text-xs uppercase tracking-wider text-slate-900">
                {language === 'es' ? 'Información de Contacto & Domicilio Social' : 'Contact Details & Legal Domicile'}
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{client.contactPerson}</span>
                  <span className="text-slate-500 text-[11px]">({client.contactRole})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="mono">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.headquarters}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="serif font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center justify-between">
                <span>{language === 'es' ? 'Compliance & Titular Real (KYC/AML)' : 'KYC / AML Ultimate Beneficial Owner'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  client.kycStatus === 'Verificado (Nivel 1)'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {localizeKycStatus(client.kycStatus)}
                </span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">{language === 'es' ? 'Riesgo AML Asignado:' : 'AML Risk Tier:'}</span>{' '}
                  <span className={`font-bold ${
                    client.amlRisk === 'Bajo' ? 'text-emerald-700' :
                    client.amlRisk === 'Moderado' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {client.amlRisk}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {client.notes}
                </p>
              </div>
            </div>
          </div>

          {/* Linked Matters (Expedientes) */}
          <div className="space-y-3">
            <h4 className="serif font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>{language === 'es' ? `Expedientes y Litigios Vinculados (${clientCases.length})` : `Linked Litigation Matters & Deals (${clientCases.length})`}</span>
            </h4>

            {clientCases.length === 0 ? (
              <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                {language === 'es' ? 'No hay litigios o transacciones activas registradas para esta entidad en este momento.' : 'No active legal disputes or transactions recorded for this entity.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clientCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onClose();
                      onSelectCase(c);
                    }}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/80 transition cursor-pointer shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="mono text-[11px] font-bold text-slate-900">{c.code}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {localizeJurisdiction(c.jurisdiction)}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 text-xs line-clamp-1">{localizeCaseTitle(c.code, c.title)}</div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>{language === 'es' ? 'Cuantía:' : 'Amount:'} € {c.disputedAmount.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}</span>
                      <span className="font-medium text-slate-700">{language === 'es' ? 'Ldo:' : 'Counsel:'} {c.leadLawyer}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {language === 'es' ? 'Registro confidencial auditado conforme al Reglamento General de Protección de Datos (RGPD) e ICAM.' : 'Confidential client record audited pursuant to GDPR, CCBE & Bar regulations.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium cursor-pointer shadow-xs"
          >
            {language === 'es' ? 'Cerrar Ficha' : 'Close Profile'}
          </button>
        </div>

      </div>
    </div>
  );
};
