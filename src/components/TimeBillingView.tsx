import React, { useState } from 'react';
import { 
  Clock, 
  DollarSign, 
  FileSpreadsheet, 
  TrendingUp, 
  Plus, 
  CheckCircle, 
  Printer, 
  Search, 
  Filter
} from 'lucide-react';
import { TimeEntry, LegalCase, FirmProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface TimeBillingViewProps {
  timeEntries: TimeEntry[];
  cases: LegalCase[];
  firm: FirmProfile;
  onAddManualTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  onToggleInvoiced: (entryId: string) => void;
}

export const TimeBillingView: React.FC<TimeBillingViewProps> = ({
  timeEntries,
  cases,
  firm,
  onAddManualTimeEntry,
  onToggleInvoiced,
}) => {
  const { language, t, localizeTimeCategory, localizeCaseTitle } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseFilter, setSelectedCaseFilter] = useState('all');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceClient, setInvoiceClient] = useState(cases[0]?.client || '');

  // Manual Form State
  const [manualCaseId, setManualCaseId] = useState(cases[0]?.id || '');
  const [manualHours, setManualHours] = useState<number>(2.5);
  const [manualDescription, setManualDescription] = useState('');
  const [manualCategory, setManualCategory] = useState<TimeEntry['category']>('Redacción');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualIsBillable, setManualIsBillable] = useState(true);

  // Calculations
  const totalSeconds = timeEntries.reduce((acc, t) => acc + t.durationSeconds, 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);
  
  const unbilledAmount = timeEntries
    .filter(t => t.isBillable && !t.invoiced)
    .reduce((acc, t) => acc + t.billableAmount, 0);

  const billedAmount = timeEntries
    .filter(t => t.isBillable && t.invoiced)
    .reduce((acc, t) => acc + t.billableAmount, 0);

  const realizationRate = 96.4; // %

  const filteredEntries = timeEntries.filter(t => {
    const matchesSearch = 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lawyer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCase = selectedCaseFilter === 'all' || t.caseId === selectedCaseFilter;
    return matchesSearch && matchesCase;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCase = cases.find(c => c.id === manualCaseId) || cases[0];
    const durationSeconds = Math.round(Number(manualHours) * 3600);
    const hourlyRate = targetCase.hourlyRate;
    const billableAmount = manualIsBillable ? (durationSeconds / 3600) * hourlyRate : 0;

    onAddManualTimeEntry({
      caseId: targetCase.id,
      caseCode: targetCase.code,
      caseTitle: targetCase.title,
      client: targetCase.client,
      lawyer: targetCase.leadLawyer,
      description: manualDescription.trim() || `${language === 'es' ? 'Actuación profesional:' : 'Professional legal task:'} ${localizeTimeCategory(manualCategory)}`,
      date: manualDate,
      durationSeconds,
      hourlyRate,
      billableAmount: parseFloat(billableAmount.toFixed(2)),
      isBillable: manualIsBillable,
      invoiced: false,
      category: manualCategory,
    });

    setShowManualModal(false);
    setManualDescription('');
    setManualHours(2);
  };

  // Invoice Items for selected client
  const invoiceEntries = timeEntries.filter(t => t.client === invoiceClient);
  const invoiceSubtotal = invoiceEntries.reduce((acc, t) => acc + t.billableAmount, 0);
  const invoiceVat = invoiceSubtotal * 0.21;
  const invoiceTotal = invoiceSubtotal + invoiceVat;

  return (
    <div className="space-y-6">
      {/* Financial KPIs Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* WIP Unbilled */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('billing.kpi.wip')}</span>
            <DollarSign className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mono text-2xl font-bold text-slate-900">
            € {unbilledAmount.toLocaleString(language === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {t('billing.kpi.wipDesc')}
          </div>
        </div>

        {/* Total Billed */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('billing.kpi.billed')}</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mono text-2xl font-bold text-emerald-700">
            € {billedAmount.toLocaleString(language === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {t('billing.kpi.billedDesc')}
          </div>
        </div>

        {/* Total Billable Hours */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('billing.kpi.hours')}</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mono text-2xl font-bold text-slate-900">
            {totalHours} <span className="text-sm font-normal text-slate-500">{language === 'es' ? 'horas' : 'hours'}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {t('billing.kpi.hoursDesc')} € {firm.defaultHourlyRate} / h
          </div>
        </div>

        {/* Realization Rate */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('billing.kpi.realization')}</span>
            <TrendingUp className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mono text-2xl font-bold text-slate-900">
            {realizationRate}%
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
            <span>{t('billing.kpi.realizationDesc')}</span>
          </div>
        </div>
      </div>

      {/* Actions and Filter Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('billing.search.placeholder')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Filter by case */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label={t('billing.filter.case')}
              value={selectedCaseFilter}
              onChange={(e) => setSelectedCaseFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none max-w-[200px] truncate cursor-pointer"
            >
              <option value="all">{t('billing.filter.case')}</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>[{c.code}] {localizeCaseTitle(c.code, c.title)}</option>
              ))}
            </select>
          </div>

          {/* Action: Manual Imputation */}
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition border border-slate-200 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-700" />
            <span>{t('billing.btn.manualEntry')}</span>
          </button>

          {/* Action: Generate Proforma Invoice */}
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide shadow-xs active:scale-98 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t('billing.btn.generateInvoice')}</span>
          </button>
        </div>
      </div>

      {/* Timesheet Log Table */}
      <div className="rounded-lg bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">{t('billing.table.date')}</th>
                <th className="px-4 py-3.5">{t('billing.table.case')}</th>
                <th className="px-4 py-3.5">{t('billing.table.task')}</th>
                <th className="px-4 py-3.5">{t('billing.table.lawyer')}</th>
                <th className="px-4 py-3.5">{t('billing.table.time')}</th>
                <th className="px-4 py-3.5">{t('billing.table.rate')}</th>
                <th className="px-4 py-3.5">{t('billing.table.total')}</th>
                <th className="px-4 py-3.5 text-right">{t('billing.table.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    {language === 'es' ? 'No hay registros de tiempo imputados con los filtros actuales.' : 'No time entries match the selected filters.'}
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const hoursFormatted = (entry.durationSeconds / 3600).toFixed(2);
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Date */}
                      <td className="px-4 py-3.5 mono text-slate-500 whitespace-nowrap">
                        {entry.date}
                      </td>

                      {/* Case & Client */}
                      <td className="px-4 py-3.5">
                        <div className="mono text-[10px] text-slate-600 font-bold">
                          {entry.caseCode}
                        </div>
                        <div className="font-medium text-slate-900 truncate max-w-[170px]">
                          {entry.client}
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3.5 max-w-[280px]">
                        <div className="text-slate-900 font-medium line-clamp-1">
                          {entry.description}
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {localizeTimeCategory(entry.category)}
                        </span>
                      </td>

                      {/* Lawyer */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700">
                        {entry.lawyer}
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3.5 mono text-slate-900 font-semibold whitespace-nowrap">
                        {hoursFormatted} h
                      </td>

                      {/* Rate */}
                      <td className="px-4 py-3.5 mono text-slate-500 whitespace-nowrap">
                        € {entry.hourlyRate}
                      </td>

                      {/* Total Amount */}
                      <td className="px-4 py-3.5 mono text-emerald-700 font-bold whitespace-nowrap">
                        € {entry.billableAmount.toFixed(2)}
                      </td>

                      {/* Status / Invoice button */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onToggleInvoiced(entry.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition cursor-pointer ${
                            entry.invoiced
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {entry.invoiced ? t('billing.status.invoiced') : t('billing.status.pending')}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Imputation Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-800" />
                <h3 className="serif text-base font-semibold text-slate-900">
                  {t('billing.modal.title')}
                </h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-700 font-mono p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('billing.modal.case')}</label>
                <select
                  value={manualCaseId}
                  onChange={(e) => setManualCaseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                >
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.code}] {localizeCaseTitle(c.code, c.title)} — {c.client}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('billing.modal.hours')}</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    value={manualHours}
                    onChange={(e) => setManualHours(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('billing.modal.date')}</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('billing.modal.category')}</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as TimeEntry['category'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                >
                  <option value="Estudio y Análisis">{localizeTimeCategory('Estudio y Análisis')}</option>
                  <option value="Redacción">{localizeTimeCategory('Redacción')}</option>
                  <option value="Reunión / Audiencia">{localizeTimeCategory('Reunión / Audiencia')}</option>
                  <option value="Negociación">{localizeTimeCategory('Negociación')}</option>
                  <option value="Gestión Procesal">{localizeTimeCategory('Gestión Procesal')}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('billing.modal.taskDescription')}</label>
                <textarea
                  rows={3}
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder={language === 'es' ? "Ej. Revisión y alegaciones al escrito de conclusiones de la contraria..." : "E.g. Review and pleading rejoinder on defendant statement..."}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="billableCheck"
                  checked={manualIsBillable}
                  onChange={(e) => setManualIsBillable(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                <label htmlFor="billableCheck" className="text-slate-700 font-medium cursor-pointer">
                  {t('billing.modal.billableCheckbox')}
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  {t('action.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs cursor-pointer"
                >
                  {t('billing.modal.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proforma Invoice Legal Generation Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-lg p-8 shadow-xl overflow-y-auto max-h-[90vh] border border-slate-200">
            
            {/* Proforma Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6">
              <div>
                <h2 className="serif text-xl font-bold text-slate-900">
                  {firm.name}
                </h2>
                <p className="italic serif text-sm text-slate-600">
                  «{firm.latinMotto}»
                </p>
                <p className="text-xs text-slate-500 mt-1 mono">
                  NIF: B-84912093 • {firm.barAssociation} • {firm.city}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-800 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded inline-block">
                  {language === 'es' ? 'Liquidación de Honorarios / Minuta Proforma' : 'Proforma Fee Invoice & Statement'}
                </div>
                <p className="mono text-xs text-slate-600 mt-2">
                  {language === 'es' ? 'Minuta Nº: MIN-2026-088' : 'Invoice No: MIN-2026-088'}
                </p>
                <p className="mono text-xs text-slate-600">
                  {language === 'es' ? `Fecha: ${new Date().toLocaleDateString('es-ES')}` : `Date: ${new Date().toLocaleDateString('en-US')}`}
                </p>
              </div>
            </div>

            {/* Client Picker inside invoice */}
            <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                    {language === 'es' ? 'Cliente / Destinatario:' : 'Client / Addressee:'}
                  </span>
                  <select
                    aria-label="Seleccionar cliente para facturación"
                    value={invoiceClient}
                    onChange={(e) => setInvoiceClient(e.target.value)}
                    className="mt-1 font-semibold text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs cursor-pointer"
                  >
                    {Array.from(new Set(cases.map(c => c.client))).map(cl => (
                      <option key={cl} value={cl}>{cl}</option>
                    ))}
                  </select>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <span className="font-semibold block">{language === 'es' ? 'Socio Responsable:' : 'Lead Partner:'}</span>
                  <span>{firm.primaryPartner}</span>
                </div>
              </div>
            </div>

            {/* Breakdown of services */}
            <div className="mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase text-slate-500">
                    <th className="py-2">{language === 'es' ? 'Concepto / Actuación Jurídica' : 'Description / Legal Service'}</th>
                    <th className="py-2 text-center">{language === 'es' ? 'Horas' : 'Hours'}</th>
                    <th className="py-2 text-right">{language === 'es' ? 'Tarifa' : 'Rate'}</th>
                    <th className="py-2 text-right">{language === 'es' ? 'Importe' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceEntries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500">
                        {language === 'es' ? 'No hay actuaciones registradas para este cliente aún.' : 'No recorded billable tasks for this client yet.'}
                      </td>
                    </tr>
                  ) : (
                    invoiceEntries.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5">
                          <div className="font-semibold text-slate-900">{item.description}</div>
                          <div className="text-[10px] text-slate-500 mono">
                            {item.caseCode} • {item.date} • {language === 'es' ? 'Letrado:' : 'Counsel:'} {item.lawyer}
                          </div>
                        </td>
                        <td className="py-2.5 text-center mono">
                          {(item.durationSeconds / 3600).toFixed(2)} h
                        </td>
                        <td className="py-2.5 text-right mono">
                          € {item.hourlyRate}
                        </td>
                        <td className="py-2.5 text-right mono font-bold text-slate-900">
                          € {item.billableAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total and Tax Math */}
            <div className="flex justify-end mb-6">
              <div className="w-64 space-y-2 text-xs mono">
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'es' ? 'Base Imponible:' : 'Subtotal:'}</span>
                  <span>€ {invoiceSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'es' ? 'IVA (21%):' : 'VAT / Tax (21%):'}</span>
                  <span>€ {invoiceVat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-slate-950 pt-2 border-t-2 border-slate-900">
                  <span>{language === 'es' ? 'Total Minuta:' : 'Total Due:'}</span>
                  <span>€ {invoiceTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer and Print */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
              <span className="text-slate-500 text-[11px]">
                {language === 'es' ? 'Pago mediante transferencia a cuenta fiduciaria del bufete dentro de los 30 días naturales.' : 'Remittance via wire transfer to client trust account within 30 statutory days.'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  {t('action.close')}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Imprimir / PDF' : 'Print / PDF'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
