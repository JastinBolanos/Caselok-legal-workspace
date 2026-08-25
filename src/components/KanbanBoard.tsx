import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Gavel, 
  Building, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { LegalCase, CaseStageId, JurisdictionType, PriorityLevel } from '../types';
import { KANBAN_STAGES } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

interface KanbanBoardProps {
  cases: LegalCase[];
  onSelectCase: (caseItem: LegalCase) => void;
  onUpdateCaseStage: (caseId: string, newStageId: CaseStageId) => void;
  onCreateNewCase: (newCase: Omit<LegalCase, 'id' | 'loggedHours'>) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  cases,
  onSelectCase,
  onUpdateCaseStage,
  onCreateNewCase,
}) => {
  const { 
    language, 
    t, 
    localizeStage, 
    localizePriority, 
    localizeJurisdiction, 
    localizeCaseTitle 
  } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  // New Case Form State
  const [newCode, setNewCode] = useState(`EXP-2025-0${Math.floor(Math.random() * 90 + 10)}`);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newJurisdiction, setNewJurisdiction] = useState<JurisdictionType>('Litigación & Arbitraje');
  const [newLeadLawyer, setNewLeadLawyer] = useState('Dña. Elena de la Vega');
  const [newDisputedAmount, setNewDisputedAmount] = useState<number>(5000000);
  const [newHourlyRate, setNewHourlyRate] = useState<number>(480);
  const [newBudgetHours, setNewBudgetHours] = useState<number>(80);
  const [newDeadline, setNewDeadline] = useState('2026-09-30');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('Alta');
  const [newRiskLevel, setNewRiskLevel] = useState<'Bajo' | 'Moderado' | 'Alto' | 'Crítico'>('Moderado');
  const [newDescription, setNewDescription] = useState('');
  const [newOpposingParty, setNewOpposingParty] = useState('');

  // Filtering
  const filteredCases = cases.filter(c => {
    const localizedTitle = localizeCaseTitle(c.code, c.title);
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      localizedTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.leadLawyer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJurisdiction = selectedJurisdiction === 'all' || c.jurisdiction === selectedJurisdiction;
    const matchesPriority = selectedPriority === 'all' || c.priority === selectedPriority;

    return matchesSearch && matchesJurisdiction && matchesPriority;
  });

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newClient) return;

    onCreateNewCase({
      code: newCode,
      title: newTitle,
      client: newClient,
      jurisdiction: newJurisdiction,
      stageId: 'intake',
      leadLawyer: newLeadLawyer,
      leadLawyerRole: 'Socio Responsable',
      opposingParty: newOpposingParty || (language === 'es' ? 'Parte Contraria en Determinación' : 'Adverse Party TBD'),
      disputedAmount: Number(newDisputedAmount),
      hourlyRate: Number(newHourlyRate),
      budgetHours: Number(newBudgetHours),
      nextDeadline: newDeadline,
      deadlineDescription: language === 'es' ? 'Hito inicial de apertura y análisis de conflicto' : 'Initial intake and conflict analysis milestone',
      priority: newPriority,
      riskLevel: newRiskLevel,
      description: newDescription || (language === 'es' ? 'Asunto corporativo registrado en el sistema de gestión de la firma.' : 'Corporate matter recorded in firm practice management system.'),
      createdAt: new Date().toISOString().split('T')[0],
      tags: [newJurisdiction.split(' ')[0], language === 'es' ? 'Nuevo Expediente' : 'New Matter'],
      keyMilestones: [
        { title: language === 'es' ? 'Apertura de Expediente & KYC' : 'Matter Inception & KYC', date: new Date().toISOString().split('T')[0], completed: true },
        { title: language === 'es' ? 'Reunión de Estrategia con el Cliente' : 'Client Strategy Conference', date: newDeadline, completed: false },
      ]
    });

    setShowNewCaseModal(false);
    setNewTitle('');
    setNewClient('');
    setNewDescription('');
    setNewOpposingParty('');
    setNewCode(`EXP-2025-0${Math.floor(Math.random() * 90 + 10)}`);
  };

  const getPriorityBadgeClass = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Urgente / Perentorio':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      case 'Alta':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      case 'Media':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Baja':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('kanban.search.placeholder')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Jurisdiction filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{language === 'es' ? 'Área:' : 'Area:'}</span>
            <select
              aria-label={t('kanban.filter.jurisdiction')}
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="all">{t('kanban.filter.jurisdiction')}</option>
              <option value="Mercantil & Societario">{localizeJurisdiction('Mercantil & Societario')}</option>
              <option value="Litigación & Arbitraje">{localizeJurisdiction('Litigación & Arbitraje')}</option>
              <option value="M&A / Fusiones y Adquisiciones">{localizeJurisdiction('M&A / Fusiones y Adquisiciones')}</option>
              <option value="Penal Económico & Compliance">{localizeJurisdiction('Penal Económico & Compliance')}</option>
              <option value="Propiedad Intelectual & Tech">{localizeJurisdiction('Propiedad Intelectual & Tech')}</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="hidden sm:inline">{language === 'es' ? 'Prioridad:' : 'Priority:'}</span>
            <select
              aria-label={t('kanban.filter.priority')}
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="all">{t('kanban.filter.priority')}</option>
              <option value="Urgente / Perentorio">{localizePriority('Urgente / Perentorio')}</option>
              <option value="Alta">{localizePriority('Alta')}</option>
              <option value="Media">{localizePriority('Media')}</option>
              <option value="Baja">{localizePriority('Baja')}</option>
            </select>
          </div>

          {/* New Case Button */}
          <button
            onClick={() => setShowNewCaseModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide shadow-xs active:scale-98 transition ml-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('kanban.btn.newCase')}</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {KANBAN_STAGES.map((stage) => {
          const stageCases = filteredCases.filter(c => c.stageId === stage.id);
          const totalValue = stageCases.reduce((acc, c) => acc + c.disputedAmount, 0);

          return (
            <div 
              key={stage.id}
              className="flex flex-col rounded-lg kanban-col shadow-xs min-w-[280px] max-h-[calc(100vh-280px)]"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200 bg-white/60 rounded-t-lg sticky top-0 z-10 backdrop-blur-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="serif text-sm font-semibold text-slate-900 tracking-tight truncate">
                    {localizeStage(stage.id)}
                  </h3>
                  <span className="mono text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                    {stageCases.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {language === 'es' ? stage.subtitle : (
                    stage.id === 'intake' ? 'Conflict check & engagement' :
                    stage.id === 'analysis' ? 'Legal audit & discovery' :
                    stage.id === 'drafting' ? 'Contract drafting & pleadings' :
                    stage.id === 'litigation' ? 'Court hearings & arbitral trial' :
                    'Enforcement & fee settlement'
                  )}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{language === 'es' ? 'En Cartera:' : 'In Portfolio:'}</span>
                  <span className="mono text-slate-900 font-semibold">
                    €{(totalValue / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 flex-1 overflow-y-auto space-y-3">
                {stageCases.length === 0 ? (
                  <div className="py-8 px-4 text-center border border-dashed border-slate-300 rounded-lg text-slate-400 text-xs">
                    {t('kanban.emptyStage')}
                  </div>
                ) : (
                  stageCases.map((caseItem) => {
                    const hoursPercent = Math.min(100, Math.round((caseItem.loggedHours / caseItem.budgetHours) * 100));
                    const isOverBudget = caseItem.loggedHours > caseItem.budgetHours;

                    return (
                      <div
                        key={caseItem.id}
                        onClick={() => onSelectCase(caseItem)}
                        className="group relative rounded-lg p-3.5 card hover:border-slate-400 transition cursor-pointer text-left"
                      >
                        {/* Top: Code & Priority */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="mono text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {caseItem.code}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityBadgeClass(caseItem.priority)}`}>
                            {localizePriority(caseItem.priority).split('/')[0]}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="serif text-xs font-semibold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 mb-1.5 leading-snug">
                          {localizeCaseTitle(caseItem.code, caseItem.title)}
                        </h4>

                        {/* Client */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2.5">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate font-medium">{caseItem.client}</span>
                        </div>

                        {/* Valuation & Jurisdiction */}
                        <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-slate-50 border border-slate-100 mb-2.5">
                          <span className="text-slate-500">{language === 'es' ? 'Cuantía:' : 'Amount:'}</span>
                          <span className="mono text-slate-900 font-semibold">
                            €{caseItem.disputedAmount.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
                          </span>
                        </div>

                        {/* Billable Hours Progress */}
                        <div className="space-y-1 mb-2.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="mono">{caseItem.loggedHours}h / {caseItem.budgetHours}h</span>
                            </span>
                            <span className={`mono ${isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                              {hoursPercent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isOverBudget ? 'bg-rose-500' : 'bg-slate-800'}`} 
                              style={{ width: `${hoursPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Next Deadline Warning */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 pt-2 border-t border-slate-100">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="mono truncate">
                            {language === 'es' ? `Vence: ${caseItem.nextDeadline}` : `Due: ${caseItem.nextDeadline}`}
                          </span>
                        </div>

                        {/* Lead Lawyer Footer */}
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-500">
                          <span className="truncate">{caseItem.leadLawyer}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Quick move left */}
                            {stage.id !== 'intake' && (
                              <button
                                title={language === 'es' ? "Mover a fase anterior" : "Move to previous stage"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const stageOrder: CaseStageId[] = ['intake', 'analysis', 'drafting', 'litigation', 'closing'];
                                  const curIdx = stageOrder.indexOf(stage.id);
                                  if (curIdx > 0) onUpdateCaseStage(caseItem.id, stageOrder[curIdx - 1]);
                                }}
                                className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}

                            {/* Quick move right */}
                            {stage.id !== 'closing' && (
                              <button
                                title={language === 'es' ? "Avanzar a siguiente fase procesal" : "Advance to next procedural stage"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const stageOrder: CaseStageId[] = ['intake', 'analysis', 'drafting', 'litigation', 'closing'];
                                  const curIdx = stageOrder.indexOf(stage.id);
                                  if (curIdx < stageOrder.length - 1) onUpdateCaseStage(caseItem.id, stageOrder[curIdx + 1]);
                                }}
                                className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Case Creation Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-lg p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-slate-800" />
                <h3 className="serif text-lg font-semibold text-slate-900">
                  {t('case.modal.title')}
                </h3>
              </div>
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-mono p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.code')}</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.client')}</label>
                  <input
                    type="text"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="Ej. Santander Global Tech S.A."
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('case.modal.name')}</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === 'es' ? "Ej. Adquisición del 100% de Sociedad Filial..." : "E.g. Acquisition of 100% Subsidiary..."}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.jurisdiction')}</label>
                  <select
                    value={newJurisdiction}
                    onChange={(e) => setNewJurisdiction(e.target.value as JurisdictionType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Litigación & Arbitraje">{localizeJurisdiction('Litigación & Arbitraje')}</option>
                    <option value="Mercantil & Societario">{localizeJurisdiction('Mercantil & Societario')}</option>
                    <option value="M&A / Fusiones y Adquisiciones">{localizeJurisdiction('M&A / Fusiones y Adquisiciones')}</option>
                    <option value="Penal Económico & Compliance">{localizeJurisdiction('Penal Económico & Compliance')}</option>
                    <option value="Propiedad Intelectual & Tech">{localizeJurisdiction('Propiedad Intelectual & Tech')}</option>
                    <option value="Fiscal & Tributario Internacional">{localizeJurisdiction('Fiscal & Tributario Internacional')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.opposingParty')}</label>
                  <input
                    type="text"
                    value={newOpposingParty}
                    onChange={(e) => setNewOpposingParty(e.target.value)}
                    placeholder={language === 'es' ? "Ej. Consorcio Constructor / Demandado" : "E.g. Construction Consortium / Respondent"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.disputedAmount')}</label>
                  <input
                    type="number"
                    value={newDisputedAmount}
                    onChange={(e) => setNewDisputedAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.hourlyRate')}</label>
                  <input
                    type="number"
                    value={newHourlyRate}
                    onChange={(e) => setNewHourlyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.budgetHours')}</label>
                  <input
                    type="number"
                    value={newBudgetHours}
                    onChange={(e) => setNewBudgetHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.leadLawyer')}</label>
                  <select
                    value={newLeadLawyer}
                    onChange={(e) => setNewLeadLawyer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Dña. Elena de la Vega">Dña. Elena de la Vega ({language === 'es' ? 'Socia' : 'Partner'})</option>
                    <option value="Dr. Alejandro Montesinos">Dr. Alejandro Montesinos ({language === 'es' ? 'Socio' : 'Partner'})</option>
                    <option value="Lic. Sofía Alarcón">Lic. Sofía Alarcón ({language === 'es' ? 'Socia' : 'Partner'})</option>
                    <option value="Lic. Fernando Carvajal">Lic. Fernando Carvajal ({language === 'es' ? 'Senior' : 'Senior Associate'})</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.deadline')}</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('case.modal.priority')}</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Urgente / Perentorio">{localizePriority('Urgente / Perentorio')}</option>
                    <option value="Alta">{localizePriority('Alta')}</option>
                    <option value="Media">{localizePriority('Media')}</option>
                    <option value="Baja">{localizePriority('Baja')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('case.modal.description')}</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={language === 'es' ? "Detalles sobre pretensiones procesales, antecedentes fácticos y estrategia..." : "Details on claims, factual background, and litigation strategy..."}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  {t('action.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs cursor-pointer"
                >
                  {t('case.modal.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
