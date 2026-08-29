import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Check, 
  ChevronDown
} from 'lucide-react';
import { LegalCase, TimeEntry } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface LiveTimerBarProps {
  cases: LegalCase[];
  selectedCaseId: string;
  onSelectCaseId: (id: string) => void;
  onSaveTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  defaultHourlyRate: number;
}

export const LiveTimerBar: React.FC<LiveTimerBarProps> = ({
  cases,
  selectedCaseId,
  onSelectCaseId,
  onSaveTimeEntry,
  defaultHourlyRate,
}) => {
  const { language, t, localizeTimeCategory, localizeCaseTitle } = useLanguage();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [category, setCategory] = useState<TimeEntry['category']>('Estudio y Análisis');
  const [isBillable] = useState<boolean>(true);
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const currentRate = activeCase ? activeCase.hourlyRate : defaultHourlyRate;

  // Accrued amount calculation in real time
  const accruedAmount = (seconds / 3600) * currentRate;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStopAndSave = () => {
    if (seconds === 0) return;

    const defaultDesc = language === 'es'
      ? `Actuación legal: ${category} en expediente ${activeCase.code}`
      : `Legal service: ${localizeTimeCategory(category)} in matter ${activeCase.code}`;

    const newEntry: Omit<TimeEntry, 'id'> = {
      caseId: activeCase.id,
      caseCode: activeCase.code,
      caseTitle: activeCase.title,
      client: activeCase.client,
      lawyer: activeCase.leadLawyer,
      description: taskDescription.trim() || defaultDesc,
      date: new Date().toISOString().split('T')[0],
      durationSeconds: seconds,
      hourlyRate: currentRate,
      billableAmount: isBillable ? parseFloat(accruedAmount.toFixed(2)) : 0,
      isBillable,
      invoiced: false,
      category,
    };

    onSaveTimeEntry(newEntry);
    setIsRunning(false);
    setSeconds(0);
    setTaskDescription('');
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  const handleReset = () => {
    const confirmMsg = language === 'es'
      ? '¿Desea descartar el tiempo cronometrado sin registrarlo?'
      : 'Discard the current elapsed time without logging it?';
    if (confirm(confirmMsg)) {
      setIsRunning(false);
      setSeconds(0);
    }
  };

  return (
    <div className="relative z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Stopwatch Display & Case Indicator */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Live pulsing indicator */}
            <div className="flex items-center gap-2">
              <span className={`timer-pulse ${isRunning ? 'bg-red-500' : 'bg-slate-300'}`} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  {isRunning ? (language === 'es' ? 'Sesión Activa' : 'Live Session') : (language === 'es' ? 'Cronómetro' : 'Stopwatch')}
                </span>
                <span className="mono text-xl sm:text-2xl font-semibold tracking-tighter text-slate-900">
                  {formatTime(seconds)}
                </span>
              </div>
            </div>

            {/* Accrued Billable Calculation */}
            <div className="hidden sm:flex items-center gap-2.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">{t('timer.currentAmount')}</div>
                <div className="mono text-xs font-semibold text-slate-900">
                  € {accruedAmount.toFixed(2)}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 border-l border-slate-200 pl-2">
                €{currentRate}/h
              </div>
            </div>
          </div>

          {/* Center: Case & Activity Selector Inputs */}
          <div className="flex-1 min-w-[260px] max-w-3xl flex items-center gap-2">
            {/* Case Dropdown */}
            <div className="relative flex-1 min-w-[140px]">
              <select
                aria-label={t('timer.selectMatter')}
                value={selectedCaseId}
                onChange={(e) => onSelectCaseId(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-slate-800 focus:border-slate-400 focus:bg-white focus:outline-none appearance-none truncate pr-7 cursor-pointer transition-colors"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.code}] {localizeCaseTitle(c.code, c.title)} — {c.client}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Task Description */}
            <div className="flex-1 min-w-[140px]">
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder={language === 'es' ? 'Descripción de la actuación (ej. Revisión de escrito)...' : 'Task description (e.g. Brief review, client call)...'}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Category Dropdown */}
            <div className="shrink-0 hidden md:block">
              <select
                aria-label={t('timer.category')}
                value={category}
                onChange={(e) => setCategory(e.target.value as TimeEntry['category'])}
                className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-slate-700 focus:border-slate-400 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="Estudio y Análisis">{localizeTimeCategory('Estudio y Análisis')}</option>
                <option value="Redacción">{localizeTimeCategory('Redacción')}</option>
                <option value="Reunión / Audiencia">{localizeTimeCategory('Reunión / Audiencia')}</option>
                <option value="Negociación">{localizeTimeCategory('Negociación')}</option>
                <option value="Gestión Procesal">{localizeTimeCategory('Gestión Procesal')}</option>
              </select>
            </div>
          </div>

          {/* Right: Actions Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs active:scale-95 transition cursor-pointer shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{t('timer.start')}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition cursor-pointer shrink-0"
              >
                <Pause className="w-3 h-3 fill-current" />
                <span>{t('timer.pause')}</span>
              </button>
            )}

            <button
              onClick={handleStopAndSave}
              disabled={seconds === 0}
              title={language === 'es' ? "Guardar y registrar en hoja de horas" : "Save and log to timesheet"}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition cursor-pointer shrink-0 ${
                seconds > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'es' ? 'Imputar' : 'Log Time'}</span>
            </button>

            {seconds > 0 && !isRunning && (
              <button
                onClick={handleReset}
                title={language === 'es' ? "Descartar tiempo" : "Discard time"}
                className="p-2 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-200 transition cursor-pointer shrink-0"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Success toast feedback */}
        {showSavedFeedback && (
          <div className="mt-2 text-center py-1.5 px-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'es' ? 'Tiempo imputado exitosamente en la bitácora del expediente.' : 'Time entry successfully logged to the matter billing records.'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
