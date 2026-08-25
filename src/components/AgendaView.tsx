import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Plus, 
  Search, 
  MapPin, 
  User, 
  Scale, 
  ShieldAlert
} from 'lucide-react';
import { JudicialEvent, LegalCase, FirmProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AgendaViewProps {
  events: JudicialEvent[];
  cases: LegalCase[];
  firm: FirmProfile;
  onAddEvent: (event: JudicialEvent) => void;
  onToggleEventComplete: (eventId: string) => void;
  onSelectCase: (legalCase: LegalCase) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  events,
  cases,
  firm,
  onAddEvent,
  onToggleEventComplete,
  onSelectCase,
}) => {
  const { 
    language, 
    t, 
    localizeEventType, 
    localizeCaseTitle 
  } = useLanguage();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLawyer] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form State
  const [formCaseId, setFormCaseId] = useState(cases[0]?.id || '');
  const [formTitle, setFormTitle] = useState('');
  const [formEventType, setFormEventType] = useState<JudicialEvent['eventType']>('Señalamiento de Vista');
  const [formDate, setFormDate] = useState('2026-09-02');
  const [formTime, setFormTime] = useState('10:00');
  const [formCourtroom, setFormCourtroom] = useState('Juzgado de lo Mercantil Nº 1 de Madrid');
  const [formJudge] = useState('');
  const [formLawyer, setFormLawyer] = useState(firm.primaryPartner);
  const [formIsUrgentLEC, setFormIsUrgentLEC] = useState(true);
  const [formNotes, setFormNotes] = useState('');

  // Calculate days remaining helper
  const calculateDaysRemaining = (eventDateStr: string) => {
    const today = new Date('2026-08-22');
    const target = new Date(eventDateStr);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.caseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.courtroom && e.courtroom.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'all' || e.eventType === filterType;
    const matchesLawyer = filterLawyer === 'all' || e.lawyer.includes(filterLawyer);

    return matchesSearch && matchesType && matchesLawyer;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Urgent count
  const urgentCount = events.filter(e => e.isUrgentLEC && e.status === 'Pendiente').length;
  const pendingCount = events.filter(e => e.status === 'Pendiente').length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCase = cases.find(c => c.id === formCaseId);
    if (!selectedCase || !formTitle.trim()) return;

    const newEvent: JudicialEvent = {
      id: `event-${Date.now()}`,
      caseId: selectedCase.id,
      caseCode: selectedCase.code,
      caseTitle: selectedCase.title,
      client: selectedCase.client,
      title: formTitle,
      eventType: formEventType,
      date: formDate,
      time: formTime,
      courtroom: formCourtroom,
      judgeOrAuthority: formJudge,
      lawyer: formLawyer,
      isUrgentLEC: formIsUrgentLEC,
      status: 'Pendiente',
      notes: formNotes
    };

    onAddEvent(newEvent);
    setShowAddModal(false);
    setFormTitle('');
    setFormNotes('');
  };

  return (
    <div className="space-y-6">
      {/* KPIs & Judicial Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('agenda.kpi.urgentLEC')}</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mono text-2xl font-bold text-rose-700">
            {urgentCount} <span className="text-xs font-normal text-slate-500">{language === 'es' ? 'improrrogables' : 'peremptory'}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {t('agenda.kpi.urgentSubtitle')}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('agenda.kpi.activeEvents')}</span>
            <CalendarIcon className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mono text-2xl font-bold text-slate-900">
            {pendingCount} <span className="text-xs font-normal text-slate-500">{language === 'es' ? 'hitos' : 'events'}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {t('agenda.kpi.activeSubtitle')}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('agenda.kpi.workingDays')}</span>
            <Scale className="w-4 h-4 text-slate-700" />
          </div>
          <div className="serif text-base font-bold text-slate-900 mt-1">
            {language === 'es' ? 'Agosto Inhábil Parcial' : 'Partial Judicial Recess'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {t('agenda.kpi.workingDaysDesc')}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('agenda.kpi.jurisdiction')}</span>
            <MapPin className="w-4 h-4 text-slate-700" />
          </div>
          <div className="serif text-base font-bold text-slate-900 truncate mt-1">
            {firm.city}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {language === 'es' ? 'Colegiación:' : 'Bar Admission:'} {firm.barAssociation.split('(')[0]}
          </div>
        </div>
      </div>

      {/* Action and Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-md bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t('agenda.view.list')}
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition ${
                viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t('agenda.view.calendar')}
            </button>
          </div>

          <div className="relative flex-1 lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('agenda.search.placeholder')}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Filter by Event Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none cursor-pointer"
          >
            <option value="all">{t('agenda.filter.type')}</option>
            <option value="Señalamiento de Vista">{localizeEventType('Señalamiento de Vista')}</option>
            <option value="Audiencia Previa">{localizeEventType('Audiencia Previa')}</option>
            <option value="Escrito de Conclusiones">{localizeEventType('Escrito de Conclusiones')}</option>
            <option value="Requerimiento Judicial">{localizeEventType('Requerimiento Judicial')}</option>
            <option value="Firma Notarial">{localizeEventType('Firma Notarial')}</option>
            <option value="Junta General Extraordinaria">{localizeEventType('Junta General Extraordinaria')}</option>
          </select>

          {/* New Event Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer transition active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('agenda.btn.newEvent')}</span>
          </button>
        </div>
      </div>

      {/* Main View: List or Calendar */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-slate-400 text-xs">
              {language === 'es' ? 'No hay señalamientos o plazos judiciales que coincidan con la búsqueda.' : 'No court hearings or procedural deadlines match the search criteria.'}
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const daysLeft = calculateDaysRemaining(evt.date);
              const isUrgent = daysLeft <= 7 && daysLeft >= 0;
              const isPast = daysLeft < 0;
              const linkedCase = cases.find(c => c.id === evt.caseId);

              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-lg bg-white border transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    evt.status === 'Completado' 
                      ? 'border-slate-200 bg-slate-50/50 opacity-75' 
                      : evt.isUrgentLEC 
                      ? 'border-rose-200 hover:border-rose-300' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Left: Date Badge & Event Details */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Date Badge */}
                    <div className={`p-2.5 rounded-md border text-center shrink-0 w-20 ${
                      evt.status === 'Completado' ? 'bg-slate-100 border-slate-200 text-slate-500' :
                      isUrgent ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}>
                      <div className="text-[10px] uppercase font-bold tracking-wider">
                        {new Date(evt.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short' })}
                      </div>
                      <div className="mono text-xl font-bold leading-tight">
                        {new Date(evt.date).getDate()}
                      </div>
                      <div className="mono text-[10px] text-slate-500">{evt.time} h</div>
                    </div>

                    {/* Information */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="mono text-[11px] font-bold text-slate-900">{evt.caseCode}</span>
                        <span className="text-slate-300">•</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          evt.eventType === 'Señalamiento de Vista' ? 'bg-rose-100 text-rose-800' :
                          evt.eventType === 'Escrito de Conclusiones' ? 'bg-amber-100 text-amber-800' :
                          evt.eventType === 'Firma Notarial' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {localizeEventType(evt.eventType)}
                        </span>
                        {evt.isUrgentLEC && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                            {t('agenda.urgentBadge')}
                          </span>
                        )}
                      </div>

                      <h4 className="serif text-sm font-bold text-slate-900">
                        {evt.title}
                      </h4>

                      <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                        <span>{language === 'es' ? 'Cliente:' : 'Client:'} <strong className="text-slate-700">{evt.client}</strong></span>
                        {evt.courtroom && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{evt.courtroom}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{language === 'es' ? 'Ldo.' : 'Counsel'} {evt.lawyer}</span>
                        </span>
                      </div>

                      {evt.notes && (
                        <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
                          {evt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Countdown & Actions */}
                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    {evt.status === 'Completado' ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('agenda.statusCompleted')}</span>
                      </span>
                    ) : (
                      <div className="text-right">
                        <div className={`mono text-xs font-bold ${
                          isPast ? 'text-slate-500' :
                          isUrgent ? 'text-rose-700' : 'text-slate-700'
                        }`}>
                          {isPast ? t('agenda.daysPast') :
                           daysLeft === 0 ? t('agenda.daysDueToday') :
                           t('agenda.daysRemaining').replace('{days}', daysLeft.toString())}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {evt.isUrgentLEC ? (language === 'es' ? 'Días naturales / hábiles' : 'Statutory court days') : (language === 'es' ? 'Fecha estimada' : 'Target date')}
                        </div>
                      </div>
                    )}

                    {/* Toggle Complete */}
                    <button
                      onClick={() => onToggleEventComplete(evt.id)}
                      title={evt.status === 'Completado' ? (language === 'es' ? 'Marcar como pendiente' : 'Mark as pending') : (language === 'es' ? 'Marcar como cumplimentado' : 'Mark as completed')}
                      className={`p-2 rounded-md border text-xs font-medium cursor-pointer transition ${
                        evt.status === 'Completado'
                          ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </button>

                    {/* View Case */}
                    {linkedCase && (
                      <button
                        onClick={() => onSelectCase(linkedCase)}
                        title={language === 'es' ? "Abrir expediente completo" : "Open matter file"}
                        className="px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer shadow-xs"
                      >
                        {t('action.viewCase')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="serif text-lg font-bold text-slate-900">
              {language === 'es' ? 'Agosto 2026 — Sede Judicial' : 'August 2026 — Court Calendar'}
            </h3>
            <div className="text-xs text-slate-500">
              {language === 'es' ? 'Mostrando señalamientos del mes en curso' : 'Showing active dockets for the current month'}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {(language === 'es' ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map((d) => (
              <div key={d} className="font-semibold text-slate-400 py-1 uppercase text-[10px]">
                {d}
              </div>
            ))}

            {/* Calendar Days for August 2026 (Starts on Saturday, 5 blanks) */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`blank-${i}`} className="h-24 p-1 bg-slate-50/50 rounded border border-slate-100 text-slate-300"></div>
            ))}

            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-08-${dayNum.toString().padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);
              const isToday = dayNum === 22;

              return (
                <div 
                  key={`day-${dayNum}`}
                  className={`h-24 p-1.5 rounded border text-left flex flex-col justify-between transition ${
                    isToday ? 'border-slate-900 bg-slate-50/80 ring-1 ring-slate-900' :
                    dayEvents.length > 0 ? 'bg-white border-slate-300' : 'bg-white border-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`mono text-xs font-bold ${isToday ? 'text-slate-950 underline' : 'text-slate-700'}`}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] px-1 rounded-full bg-slate-900 text-white font-mono font-bold">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-14">
                    {dayEvents.map(e => (
                      <div
                        key={e.id}
                        onClick={() => {
                          const c = cases.find(item => item.id === e.caseId);
                          if (c) onSelectCase(c);
                        }}
                        title={`${e.title} (${e.time} h)`}
                        className={`text-[9px] px-1 py-0.5 rounded truncate font-medium cursor-pointer ${
                          e.isUrgentLEC ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {e.time} {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Judicial Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-lg p-6 shadow-xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-slate-800" />
                <h3 className="serif text-base font-semibold text-slate-900">
                  {t('agenda.modal.title')}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-mono p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('agenda.modal.case')}</label>
                <select
                  value={formCaseId}
                  onChange={(e) => setFormCaseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.client} ({localizeCaseTitle(c.code, c.title)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('agenda.modal.eventTitle')}</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={language === 'es' ? "Ej. Vista de Juicio Ordinario / Recurso de Apelación" : "E.g. Commercial Court Trial Hearing / Appeal Filing"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('agenda.modal.eventType')}</label>
                  <select
                    value={formEventType}
                    onChange={(e) => setFormEventType(e.target.value as JudicialEvent['eventType'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Señalamiento de Vista">{localizeEventType('Señalamiento de Vista')}</option>
                    <option value="Audiencia Previa">{localizeEventType('Audiencia Previa')}</option>
                    <option value="Escrito de Conclusiones">{localizeEventType('Escrito de Conclusiones')}</option>
                    <option value="Requerimiento Judicial">{localizeEventType('Requerimiento Judicial')}</option>
                    <option value="Firma Notarial">{localizeEventType('Firma Notarial')}</option>
                    <option value="Junta General Extraordinaria">{localizeEventType('Junta General Extraordinaria')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('agenda.modal.lawyer')}</label>
                  <input
                    type="text"
                    value={formLawyer}
                    onChange={(e) => setFormLawyer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('agenda.modal.date')}</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('agenda.modal.time')}</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('agenda.modal.courtroom')}</label>
                <input
                  type="text"
                  value={formCourtroom}
                  onChange={(e) => setFormCourtroom(e.target.value)}
                  placeholder={language === 'es' ? "Ej. Juzgado de lo Mercantil Nº 4 de Madrid" : "E.g. Commercial Courtroom No. 4"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-md">
                <input
                  type="checkbox"
                  id="urgentLecCheckbox"
                  checked={formIsUrgentLEC}
                  onChange={(e) => setFormIsUrgentLEC(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="urgentLecCheckbox" className="text-xs text-rose-900 font-medium cursor-pointer">
                  {t('agenda.modal.urgentLEC')}
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('agenda.modal.notes')}</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={language === 'es' ? "Instrucciones para procuradores, peritos o presentación telemática..." : "Instructions for court agents, expert witnesses, or e-filing..."}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  {t('action.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  {t('agenda.modal.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
