import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { LegalCase, CaseStageId, TimeEntry, LegalDocument } from '../types';
import { KANBAN_STAGES } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

interface CaseDetailModalProps {
  caseItem: LegalCase;
  timeEntries: TimeEntry[];
  documents: LegalDocument[];
  onClose: () => void;
  onUpdateStage: (stageId: CaseStageId) => void;
  onToggleMilestone: (caseId: string, milestoneIndex: number) => void;
  onStartTimekeeperForCase: (caseId: string) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseItem,
  timeEntries,
  documents,
  onClose,
  onUpdateStage,
  onToggleMilestone,
  onStartTimekeeperForCase,
}) => {
  const { language, t, localizeCaseTitle, localizeJurisdiction, localizeRiskLevel, localizeStage, localizeDocCategory } = useLanguage();
  const [activeTab, setActiveTab] = useState<'procedural' | 'billing' | 'documents' | 'strategy'>('procedural');
  const [notes, setNotes] = useState<string[]>([
    language === 'es' 
      ? 'Nota interna: La contraparte ha solicitado una prórroga de 5 días para la presentación de su informe pericial.' 
      : 'Internal note: Opposing counsel has requested a 5-day statutory extension for expert testimony filings.',
    language === 'es' 
      ? 'Estrategia: En caso de no alcanzarse acuerdo extrajudicial en el plazo estipulado, se interpondrá demanda incidental con solicitud de medidas cautelares.' 
      : 'Strategy: Failing out-of-court settlement within deadline, preliminary injunctive relief proceedings will be lodged.'
  ]);
  const [newNote, setNewNote] = useState('');

  const caseTimeEntries = timeEntries.filter(t => t.caseId === caseItem.id);
  const caseDocs = documents.filter(d => d.caseId === caseItem.id);
  const totalBilled = caseTimeEntries.reduce((acc, t) => acc + t.billableAmount, 0);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([newNote.trim(), ...notes]);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Banner */}
        <div className="p-6 bg-white border-b border-slate-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                  {caseItem.code}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-sans">
                  {localizeJurisdiction(caseItem.jurisdiction)}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                  caseItem.riskLevel === 'Crítico' ? 'text-rose-700 bg-rose-50 border-rose-200' :
                  caseItem.riskLevel === 'Alto' ? 'text-amber-800 bg-amber-50 border-amber-200' :
                  'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  {language === 'es' ? 'Riesgo:' : 'Risk:'} {localizeRiskLevel(caseItem.riskLevel)}
                </span>
              </div>
              <h2 className="serif text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {localizeCaseTitle(caseItem.code, caseItem.title)}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 font-mono p-1 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-500 block">{language === 'es' ? 'Cliente:' : 'Client:'}</span>
              <span className="text-slate-900 font-medium truncate block">{caseItem.client}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{language === 'es' ? 'Cuantía en Litigio:' : 'Disputed Amount:'}</span>
              <span className="text-emerald-700 font-bold mono">€ {caseItem.disputedAmount.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{language === 'es' ? 'Letrado Asignado:' : 'Lead Counsel:'}</span>
              <span className="text-slate-800 font-medium truncate block">{caseItem.leadLawyer}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{language === 'es' ? 'Vencimiento:' : 'Next Deadline:'}</span>
              <span className="text-slate-800 font-semibold mono">{caseItem.nextDeadline}</span>
            </div>
          </div>
        </div>

        {/* Stage Progression Selector */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between overflow-x-auto gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-2">
            {language === 'es' ? 'Fase Procesal:' : 'Procedural Stage:'}
          </span>
          <div className="flex items-center gap-1.5">
            {KANBAN_STAGES.map((st) => {
              const isCurrent = caseItem.stageId === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => onUpdateStage(st.id)}
                  className={`px-3 py-1 rounded text-xs transition cursor-pointer font-sans whitespace-nowrap ${
                    isCurrent 
                      ? 'bg-slate-900 text-white font-medium shadow-xs' 
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {localizeStage(st.id)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('procedural')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'procedural' 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'es' ? 'Ficha Procesal & Hitos' : 'Procedural File & Milestones'}
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'billing' 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{language === 'es' ? 'Horas & Honorarios' : 'Time & Billing'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] mono">
              {caseItem.loggedHours}h
            </span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'documents' 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{language === 'es' ? `Documentos (${caseDocs.length})` : `Documents (${caseDocs.length})`}</span>
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'strategy' 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'es' ? 'Anotaciones & Estrategia' : 'Strategy & Counsel Notes'}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          {/* Tab 1: Procedural & Milestones */}
          {activeTab === 'procedural' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  {language === 'es' ? 'Antecedentes y Objeto del Asunto' : 'Background & Case Statement'}
                </h4>
                <p className="leading-relaxed text-slate-700 font-sans">
                  {caseItem.description}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                  <span>{language === 'es' ? 'Parte Contraria:' : 'Opposing Party:'} <strong className="text-slate-800">{caseItem.opposingParty}</strong></span>
                  {caseItem.courtCourtroom && (
                    <span>• {language === 'es' ? 'Tribunal:' : 'Court / Venue:'} <strong className="text-slate-800">{caseItem.courtCourtroom}</strong></span>
                  )}
                </div>
              </div>

              {/* Milestones Checklist */}
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-700" />
                  <span>{language === 'es' ? 'Cronograma Procesal e Hitos Clave' : 'Procedural Schedule & Key Milestones'}</span>
                </h4>
                <div className="space-y-2.5">
                  {caseItem.keyMilestones.map((ms, idx) => (
                    <div
                      key={idx}
                      onClick={() => onToggleMilestone(caseItem.id, idx)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition cursor-pointer ${
                        ms.completed
                          ? 'bg-slate-50 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          ms.completed ? 'bg-slate-900 border-slate-900 text-white text-[10px]' : 'border-slate-300'
                        }`}>
                          {ms.completed && '✓'}
                        </div>
                        <span className={`font-medium ${ms.completed ? 'line-through text-slate-400' : ''}`}>
                          {ms.title}
                        </span>
                      </div>
                      <span className="mono text-xs text-slate-500 font-medium">
                        {ms.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Billing & Timesheet */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* Billing Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">{language === 'es' ? 'Horas Consumidas:' : 'Logged Hours:'}</span>
                  <span className="mono text-lg font-bold text-slate-900">
                    {caseItem.loggedHours} h <span className="text-xs text-slate-500">/ {caseItem.budgetHours} h</span>
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">{language === 'es' ? 'Honorarios Devengados:' : 'WIP Accrued Fees:'}</span>
                  <span className="mono text-lg font-bold text-emerald-700">
                    € {totalBilled.toFixed(2)}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[11px]">{language === 'es' ? 'Tarifa Aplicada:' : 'Hourly Rate:'}</span>
                    <span className="mono text-lg font-bold text-slate-900">
                      € {caseItem.hourlyRate}/h
                    </span>
                  </div>
                  <button
                    onClick={() => onStartTimekeeperForCase(caseItem.id)}
                    className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium tracking-wide text-[10px] cursor-pointer shadow-xs"
                  >
                    {language === 'es' ? 'Activar Reloj' : 'Start Timer'}
                  </button>
                </div>
              </div>

              {/* Time Logs Table */}
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  {language === 'es' ? 'Registro de Actuaciones Facturables' : 'Billable Entries Log'}
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase mono border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">{t('billing.table.date')}</th>
                        <th className="p-2.5">{t('billing.table.task')}</th>
                        <th className="p-2.5">{t('billing.table.lawyer')}</th>
                        <th className="p-2.5">{t('billing.table.time')}</th>
                        <th className="p-2.5 text-right">{t('billing.table.total')} (€)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {caseTimeEntries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-400">
                            {language === 'es' ? 'Sin actuaciones horarias imputadas en este expediente todavía.' : 'No time entries recorded on this matter yet.'}
                          </td>
                        </tr>
                      ) : (
                        caseTimeEntries.map(entry => (
                          <tr key={entry.id} className="hover:bg-slate-50">
                            <td className="p-2.5 mono text-slate-500">{entry.date}</td>
                            <td className="p-2.5 font-medium text-slate-900">{entry.description}</td>
                            <td className="p-2.5 text-slate-600">{entry.lawyer}</td>
                            <td className="p-2.5 mono text-slate-900">
                              {(entry.durationSeconds / 3600).toFixed(2)} h
                            </td>
                            <td className="p-2.5 text-right mono text-emerald-700 font-bold">
                              € {entry.billableAmount.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              {caseDocs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  {language === 'es' ? 'No hay documentos vinculados directamente a este expediente.' : 'No documents tied directly to this case file.'}
                </div>
              ) : (
                caseDocs.map(doc => (
                  <div key={doc.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-700" />
                      <div>
                        <div className="font-semibold text-slate-900">{doc.title}</div>
                        <div className="text-[10px] text-slate-500 mono">
                          {doc.fileName} • {doc.fileSize} • {language === 'es' ? 'Versión' : 'Version'} {doc.version}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {localizeDocCategory(doc.category)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Strategy Notes */}
          {activeTab === 'strategy' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={language === 'es' ? "Añadir nota procesal confidencial o recordatorio de estrategia..." : "Add confidential litigation note or strategy memo..."}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md text-xs tracking-wide cursor-pointer"
                >
                  {language === 'es' ? 'Añadir' : 'Add Note'}
                </button>
              </form>

              <div className="space-y-2.5">
                {notes.map((note, index) => (
                  <div key={index} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-sans">
                    <p className="leading-relaxed">{note}</p>
                    <span className="text-[10px] text-slate-500 block mt-1 mono">
                      {language === 'es' ? `Registrado por ${caseItem.leadLawyer}` : `Logged by ${caseItem.leadLawyer}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 mono">
            <span>Audit Trail ID: #CS-{caseItem.id.toUpperCase()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium cursor-pointer shadow-xs"
          >
            {language === 'es' ? 'Cerrar Expediente' : 'Close Matter'}
          </button>
        </div>

      </div>
    </div>
  );
};
