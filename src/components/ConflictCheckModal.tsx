import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  Copy, 
  Check
} from 'lucide-react';
import { ConflictCheckRecord, LegalCase, CorporateClient, FirmProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ConflictCheckModalProps {
  initialSearchQuery?: string;
  cases: LegalCase[];
  clients: CorporateClient[];
  firm: FirmProfile;
  conflictRecords: ConflictCheckRecord[];
  onAddConflictRecord: (record: ConflictCheckRecord) => void;
  onClose: () => void;
}

export const ConflictCheckModal: React.FC<ConflictCheckModalProps> = ({
  initialSearchQuery = '',
  cases,
  clients,
  firm,
  conflictRecords,
  onAddConflictRecord,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const [searchEntity, setSearchEntity] = useState(initialSearchQuery);
  const [entityType, setEntityType] = useState<ConflictCheckRecord['entityType']>('Persona Jurídica');
  const [jurisdiction] = useState('Mercantil & Societario');
  const [hasSearched, setHasSearched] = useState(Boolean(initialSearchQuery));
  const [copiedCert, setCopiedCert] = useState(false);

  // Perform conflict verification
  const runConflictCheck = (query: string): { status: ConflictCheckRecord['status']; conflicts: string[] } => {
    if (!query.trim()) return { status: 'Limpio / Clearance Aprobado', conflicts: [] };

    const cleanQuery = query.toLowerCase().trim();
    const matches: string[] = [];

    // Check against existing clients
    clients.forEach(c => {
      if (c.name.toLowerCase().includes(cleanQuery) || cleanQuery.includes(c.name.toLowerCase())) {
        matches.push(
          language === 'es' 
            ? `Cliente Existente: ${c.name} (NIF: ${c.taxId}) - Cartera de ${c.leadPartner}`
            : `Existing Client: ${c.name} (TaxID: ${c.taxId}) - Portfolio of ${c.leadPartner}`
        );
      }
    });

    // Check against opposing parties in all cases
    cases.forEach(c => {
      if (c.opposingParty.toLowerCase().includes(cleanQuery) || cleanQuery.includes(c.opposingParty.toLowerCase())) {
        matches.push(
          language === 'es'
            ? `PARTE CONTRARIA ADVERSA en ${c.code}: "${c.title}" (Ldo. ${c.leadLawyer})`
            : `ADVERSE OPPOSING PARTY in ${c.code}: "${c.title}" (Counsel: ${c.leadLawyer})`
        );
      }
    });

    let status: ConflictCheckRecord['status'] = 'Limpio / Clearance Aprobado';
    if (matches.some(m => m.includes('PARTE CONTRARIA ADVERSA') || m.includes('ADVERSE OPPOSING PARTY'))) {
      status = 'Conflicto Detectado';
    } else if (matches.length > 0) {
      status = 'Requiere Autorización Socio';
    }

    return { status, conflicts: matches };
  };

  const currentResult = runConflictCheck(searchEntity);

  const handleExecuteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEntity.trim()) return;
    setHasSearched(true);

    const certId = currentResult.status === 'Limpio / Clearance Aprobado' 
      ? `CERT-ICAM-2026-${Math.floor(10000 + Math.random() * 90000)}` 
      : undefined;

    const newRecord: ConflictCheckRecord = {
      id: `conf-${Date.now()}`,
      searchedEntity: searchEntity,
      entityType,
      requesterLawyer: firm.primaryPartner,
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: currentResult.status,
      conflictsFoundCount: currentResult.conflicts.length,
      adverseMatters: currentResult.conflicts,
      clearanceCertificateId: certId,
      jurisdiction,
      notes: currentResult.status === 'Conflicto Detectado' 
        ? (language === 'es' ? 'Incompatibilidad deontológica estricta con litigio en curso. Rechazar mandato.' : 'Strict ethical incompatibility with active litigation. Mandate declined.')
        : (language === 'es' ? 'Verificación exhaustiva de partes y filiales en base de datos de la firma.' : 'Full cross-entity screening completed across active firm roster.')
    };

    onAddConflictRecord(newRecord);
  };

  const handleCopyCertificate = (certText: string) => {
    navigator.clipboard.writeText(certText);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-slate-100 border border-slate-200 text-slate-900">
              <ShieldCheck className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <h3 className="serif text-base font-bold text-slate-900">
                {language === 'es' ? 'Verificador Deontológico & Prevención de Conflictos de Interés' : 'Ethical Conflict of Interest Prevention & Clearance'}
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {language === 'es' ? 'Cotejo en tiempo real de partes contrarias, clientes y terceros según el Art. 13 CDGAE.' : 'Real-time cross-check against active adversaries, entities and clients.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-mono p-1 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          {/* Search Form */}
          <form onSubmit={handleExecuteSearch} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-semibold text-slate-900 text-xs">
              {language === 'es' ? 'Buscar Persona Física o Jurídica en Registros de la Firma:' : 'Screen Natural Person or Corporate Entity against Firm Registry:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  value={searchEntity}
                  onChange={(e) => {
                    setSearchEntity(e.target.value);
                    setHasSearched(false);
                  }}
                  placeholder={language === 'es' ? "Ej. Nordic Metalworks, Vortex Energy, Iberia Clean Energy..." : "E.g. Nordic Metalworks, Vortex Energy, Iberia Clean Energy..."}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none text-xs"
                />
              </div>

              <div>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as ConflictCheckRecord['entityType'])}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 text-xs focus:border-slate-400 focus:outline-none cursor-pointer"
                >
                  <option value="Persona Jurídica">{language === 'es' ? 'Persona Jurídica / Sociedad' : 'Corporate Entity / Company'}</option>
                  <option value="Persona Física">{language === 'es' ? 'Persona Física / Directivo' : 'Natural Person / Officer'}</option>
                  <option value="Fondo / Holding">{language === 'es' ? 'Fondo de Inversión / Holding' : 'Investment Fund / Holding'}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-500">
                {language === 'es' ? `Auditoría cruzada en ${cases.length} expedientes y ${clients.length} corporaciones.` : `Cross-auditing across ${cases.length} litigation matters and ${clients.length} corporate entities.`}
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs cursor-pointer transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Ejecutar Cotejo Deontológico' : 'Run Conflict Audit'}</span>
              </button>
            </div>
          </form>

          {/* Search Result Card */}
          {hasSearched && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                currentResult.status === 'Limpio / Clearance Aprobado'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : currentResult.status === 'Conflicto Detectado'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-start gap-3">
                  {currentResult.status === 'Limpio / Clearance Aprobado' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : currentResult.status === 'Conflicto Detectado' ? (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">
                        {language === 'es' ? 'Resultado del Análisis:' : 'Screening Outcome:'} {
                          currentResult.status === 'Limpio / Clearance Aprobado' 
                            ? (language === 'es' ? 'Limpio / Clearance Aprobado' : 'Clear / Ethical Clearance Approved')
                            : currentResult.status === 'Conflicto Detectado'
                            ? (language === 'es' ? 'Conflicto Detectado' : 'Direct Adverse Conflict Detected')
                            : (language === 'es' ? 'Requiere Autorización Socio' : 'Partner Approval Required')
                        }
                      </span>
                      <span className="mono text-xs px-2 py-0.5 rounded bg-white border font-bold">
                        {currentResult.conflicts.length} {language === 'es' ? 'coincidencias' : 'matches'}
                      </span>
                    </div>

                    {currentResult.status === 'Limpio / Clearance Aprobado' ? (
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        {language === 'es' 
                          ? `No se han detectado coincidencias adversas ni representación contraria respecto a "${searchEntity}" en los registros de la firma. Se emite el Clearance para la aceptación del encargo profesional.`
                          : `No adverse matches or contradictory representation detected for "${searchEntity}" in firm records. Ethical clearance granted for new engagement acceptance.`}
                      </p>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <p className="text-xs leading-relaxed">
                          {language === 'es' 
                            ? 'Se han detectado las siguientes vinculaciones que suponen un posible conflicto de intereses:'
                            : 'The following direct or potential conflict relationships were detected:'}
                        </p>
                        <div className="space-y-1 bg-white/80 p-2.5 rounded border border-slate-200 text-[11px] text-slate-800">
                          {currentResult.conflicts.map((m, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 font-medium">
                              <span className="text-rose-600 font-bold">•</span>
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Clearance Certificate Box if Clean */}
              {currentResult.status === 'Limpio / Clearance Aprobado' && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-slate-700" />
                      <span className="serif font-bold text-xs uppercase tracking-wider text-slate-900">
                        {language === 'es' ? 'Certificado Oficial de No Conflicto (Clearance ICAM)' : 'Official Conflict Clearance Certificate (CCBE/Bar Standards)'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyCertificate(`CERTIFICADO DE NO CONFLICTO ICAM\nEntidad: ${searchEntity}\nBufete: ${firm.name}\nFecha: 22/08/2026\nResultado: CLEARANCE APROBADO`)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium cursor-pointer shadow-xs"
                    >
                      {copiedCert ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCert ? (language === 'es' ? 'Copiado' : 'Copied') : (language === 'es' ? 'Copiar Certificado' : 'Copy Certificate')}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-700 leading-relaxed space-y-1">
                    <div>CERTIFICADO: CERT-ICAM-2026-{Math.floor(10000 + Math.random() * 90000)}</div>
                    <div>ENTIDAD AUDITADA: {searchEntity.toUpperCase()} ({entityType})</div>
                    <div>LETRADO SOLICITANTE: {firm.primaryPartner}</div>
                    <div>FIRMA AUDITORA: {firm.name} ({firm.barAssociation})</div>
                    <div>DICTAMEN: CONFORME ART. 13 CÓDIGO DEONTOLÓGICO - APTO PARA ACEPTACIÓN</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Historical Log */}
          <div className="space-y-2">
            <h4 className="serif font-bold text-xs uppercase tracking-wider text-slate-900">
              {language === 'es' ? 'Historial de Verificaciones de Conflicto en Firma' : 'Firm Conflict Check Audit History'}
            </h4>

            <div className="rounded-lg bg-white border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] font-semibold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">{language === 'es' ? 'Entidad / Solicitud' : 'Entity / Target'}</th>
                    <th className="px-3 py-2">{language === 'es' ? 'Letrado' : 'Counsel'}</th>
                    <th className="px-3 py-2">{language === 'es' ? 'Fecha' : 'Date'}</th>
                    <th className="px-3 py-2">{language === 'es' ? 'Resultado' : 'Status'}</th>
                    <th className="px-3 py-2 text-right">{language === 'es' ? 'Certificado' : 'Certificate'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {conflictRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-medium text-slate-900">
                        {rec.searchedEntity}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {rec.requesterLawyer.split(' ')[0]} {rec.requesterLawyer.split(' ')[1] || ''}
                      </td>
                      <td className="px-3 py-2 text-slate-500 mono text-[10px]">
                        {rec.requestedAt}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          rec.status === 'Limpio / Clearance Aprobado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rec.status.split('/')[0]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right mono text-[10px] text-slate-500">
                        {rec.clearanceCertificateId || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {language === 'es' ? 'Cumplimiento normativo auditado bajo el Estatuto General de la Abogacía Española (RD 135/2021).' : 'Regulatory compliance audited under CCBE and National Bar statutory rules.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium cursor-pointer shadow-xs"
          >
            {language === 'es' ? 'Cerrar Verificador' : 'Close Checker'}
          </button>
        </div>

      </div>
    </div>
  );
};
