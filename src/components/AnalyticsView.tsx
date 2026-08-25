import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Award, 
  PieChart, 
  Briefcase,
  Printer
} from 'lucide-react';
import { LegalCase, TimeEntry, FirmProfile, CorporateClient } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AnalyticsViewProps {
  cases: LegalCase[];
  timeEntries: TimeEntry[];
  clients: CorporateClient[];
  firm: FirmProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  cases,
  timeEntries,
  firm,
}) => {
  const { language, t, localizeJurisdiction } = useLanguage();
  const [reportPeriod, setReportPeriod] = useState<'Q3_2026' | 'YTD_2026' | 'ALL'>('YTD_2026');
  const [showExecutiveReport, setShowExecutiveReport] = useState(false);

  // Financial Computations
  const totalWIP = timeEntries
    .filter(t => !t.invoiced && t.isBillable)
    .reduce((acc, t) => acc + t.billableAmount, 0);

  const totalDisputedPortfolio = cases.reduce((acc, c) => acc + c.disputedAmount, 0);

  // Breakdown by Jurisdiction
  const practiceAreaMap: Record<string, { count: number; totalAmount: number; loggedHours: number }> = {};
  cases.forEach(c => {
    if (!practiceAreaMap[c.jurisdiction]) {
      practiceAreaMap[c.jurisdiction] = { count: 0, totalAmount: 0, loggedHours: 0 };
    }
    practiceAreaMap[c.jurisdiction].count += 1;
    practiceAreaMap[c.jurisdiction].totalAmount += c.disputedAmount;
    practiceAreaMap[c.jurisdiction].loggedHours += c.loggedHours;
  });

  const practiceAreas = Object.entries(practiceAreaMap).map(([name, data]) => ({
    name,
    ...data,
    share: Math.round((data.totalAmount / (totalDisputedPortfolio || 1)) * 100)
  }));

  // Breakdown by Partner / Lead Lawyer
  const partnerMap: Record<string, { casesCount: number; hours: number; revenue: number; role: string }> = {};
  cases.forEach(c => {
    if (!partnerMap[c.leadLawyer]) {
      partnerMap[c.leadLawyer] = { casesCount: 0, hours: 0, revenue: 0, role: c.leadLawyerRole };
    }
    partnerMap[c.leadLawyer].casesCount += 1;
    partnerMap[c.leadLawyer].hours += c.loggedHours;
    partnerMap[c.leadLawyer].revenue += c.loggedHours * c.hourlyRate;
  });

  const partners = Object.entries(partnerMap).map(([name, data]) => ({
    name,
    ...data,
    realizationRate: 95.8
  }));

  // Monthly breakdown mockup data
  const monthlyData = [
    { month: language === 'es' ? 'Ene' : 'Jan', billed: 42000, collected: 40500 },
    { month: language === 'es' ? 'Feb' : 'Feb', billed: 58000, collected: 55000 },
    { month: language === 'es' ? 'Mar' : 'Mar', billed: 64500, collected: 62000 },
    { month: language === 'es' ? 'Abr' : 'Apr', billed: 51000, collected: 49000 },
    { month: language === 'es' ? 'May' : 'May', billed: 79000, collected: 76500 },
    { month: language === 'es' ? 'Jun' : 'Jun', billed: 88500, collected: 84000 },
    { month: language === 'es' ? 'Jul' : 'Jul', billed: 94000, collected: 89500 },
    { month: language === 'es' ? 'Ago (WIP)' : 'Aug (WIP)', billed: 71200, collected: 62000 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('analytics.kpi.portfolio')}</span>
            <Briefcase className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mono text-2xl font-bold text-slate-900">
            € {(totalDisputedPortfolio / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {cases.length} {t('analytics.kpi.portfolioDesc')}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('analytics.kpi.wip')}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mono text-2xl font-bold text-emerald-700">
            € {totalWIP.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {t('analytics.kpi.wipDesc')}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('analytics.kpi.realization')}</span>
            <TrendingUp className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mono text-2xl font-bold text-slate-900">
            96.4%
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {t('analytics.kpi.realizationDesc')}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('analytics.kpi.dso')}</span>
            <Clock className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mono text-2xl font-bold text-slate-900">
            27.4 <span className="text-xs font-normal text-slate-500">{language === 'es' ? 'días' : 'days'}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {t('analytics.kpi.dsoDesc')}
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">{t('analytics.period.label')}</span>
          <div className="flex items-center p-1 rounded-md bg-slate-100 border border-slate-200">
            <button
              onClick={() => setReportPeriod('Q3_2026')}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition ${
                reportPeriod === 'Q3_2026' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Q3 2026
            </button>
            <button
              onClick={() => setReportPeriod('YTD_2026')}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition ${
                reportPeriod === 'YTD_2026' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {language === 'es' ? 'Ejercicio 2026 YTD' : 'FY 2026 YTD'}
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowExecutiveReport(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t('analytics.btn.generateReport')}</span>
        </button>
      </div>

      {/* Charts and Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Revenue Trend */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="serif text-sm font-bold text-slate-900">
                {t('analytics.chart.monthlyRevenue')}
              </h3>
              <p className="text-[11px] text-slate-500">
                {t('analytics.chart.monthlySubtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 inline-block"></span> {t('analytics.chart.billed')}
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block"></span> {t('analytics.chart.collected')}
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-3 pt-2">
            {monthlyData.map((item) => {
              const maxVal = 100000;
              const billedPct = (item.billed / maxVal) * 100;
              const collectedPct = (item.collected / maxVal) * 100;

              return (
                <div key={item.month} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700 w-16">{item.month}</span>
                    <div className="mono text-[11px] text-slate-500 flex items-center gap-3">
                      <span>{language === 'es' ? 'Fact:' : 'Billed:'} € {item.billed.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}</span>
                      <span className="text-emerald-700 font-bold">{language === 'es' ? 'Cob:' : 'Paid:'} € {item.collected.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    <div 
                      className="bg-slate-900 h-full rounded-l-full transition-all duration-500" 
                      style={{ width: `${billedPct}%` }}
                    ></div>
                    <div 
                      className="bg-emerald-600 h-full rounded-r-full transition-all duration-500" 
                      style={{ width: `${collectedPct * 0.9}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Practice Area Distribution */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="serif text-sm font-bold text-slate-900">
                {t('analytics.chart.practiceAreas')}
              </h3>
              <p className="text-[11px] text-slate-500">
                {t('analytics.chart.practiceSubtitle')}
              </p>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 pt-1">
            {practiceAreas.map((area) => (
              <div key={area.name} className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{localizeJurisdiction(area.name)}</span>
                  <span className="mono font-bold text-slate-900">€ {(area.totalAmount / 1000000).toFixed(1)}M ({area.share}%)</span>
                </div>
                
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-slate-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, area.share * 1.5)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>{area.count} {language === 'es' ? 'asuntos activos' : 'active matters'}</span>
                  <span className="mono">{area.loggedHours.toFixed(1)} {language === 'es' ? 'horas imputadas' : 'hours logged'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Partner League Table & Productivity */}
      <div className="rounded-lg bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="serif text-sm font-bold text-slate-900">
              {t('analytics.table.partnerTitle')}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t('analytics.table.partnerSubtitle')}
            </p>
          </div>
          <Award className="w-4 h-4 text-slate-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{t('analytics.table.partner')}</th>
                <th className="px-4 py-3">{t('analytics.table.role')}</th>
                <th className="px-4 py-3 text-center">{t('analytics.table.cases')}</th>
                <th className="px-4 py-3 text-right">{t('analytics.table.hours')}</th>
                <th className="px-4 py-3 text-right">{t('analytics.table.revenue')}</th>
                <th className="px-4 py-3 text-right">{t('analytics.table.realization')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partners.map((partner) => (
                <tr key={partner.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    {partner.name}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {language === 'es' ? partner.role : (
                      partner.role.includes('Socio') ? 'Managing Partner' : 'Senior Associate'
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center mono font-bold text-slate-800">
                    {partner.casesCount}
                  </td>
                  <td className="px-4 py-3.5 text-right mono text-slate-700">
                    {partner.hours.toFixed(1)} h
                  </td>
                  <td className="px-4 py-3.5 text-right mono font-bold text-emerald-700">
                    € {partner.revenue.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="inline-block mono text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      {partner.realizationRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executive PDF Report Modal */}
      {showExecutiveReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white border border-slate-300 rounded-lg p-8 shadow-2xl overflow-y-auto max-h-[92vh] text-slate-900">
            
            {/* Report Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6">
              <div>
                <span className="serif text-xl font-bold uppercase tracking-wide text-slate-900 block">
                  {firm.name}
                </span>
                <span className="text-xs text-slate-500 italic block mt-0.5">
                  "{firm.latinMotto}" — {firm.city}
                </span>
                <div className="text-[11px] text-slate-600 mt-1">
                  {language === 'es' ? 'Colegiación:' : 'Bar Registration:'} {firm.barAssociation}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'es' ? 'Dictamen Ejecutivo' : 'Executive Legal Opinion'}
                </div>
                <div className="mono text-sm font-bold text-slate-900">INFORME BI-Q3-2026</div>
                <div className="text-[11px] text-slate-500">
                  {language === 'es' ? 'Fecha: 22 de Agosto de 2026' : 'Date: August 22, 2026'}
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-800">
              <div>
                <h4 className="serif font-bold text-sm uppercase tracking-wider text-slate-900 mb-1">
                  {language === 'es' ? '1. Resumen Ejecutivo del Despacho' : '1. Firm Executive Overview'}
                </h4>
                <p>
                  {language === 'es' 
                    ? <>Durante el ejercicio corriente, <strong>{firm.name}</strong> ha gestionado una cartera litigiosa y de asesoramiento transaccional de <strong>€ {(totalDisputedPortfolio / 1000000).toFixed(2)} millones</strong>, con un total de <strong>{cases.length} expedientes abiertos</strong> de alta complejidad en las jurisdicciones de Madrid, Barcelona, Valencia, Londres y Nueva York.</>
                    : <>During the current fiscal term, <strong>{firm.name}</strong> has managed an active litigation and transactional portfolio valued at <strong>€ {(totalDisputedPortfolio / 1000000).toFixed(2)} million</strong>, with <strong>{cases.length} active complex matters</strong> across Madrid, Barcelona, Valencia, London, and New York jurisdictions.</>
                  }
                </p>
              </div>

              <div>
                <h4 className="serif font-bold text-sm uppercase tracking-wider text-slate-900 mb-1">
                  {language === 'es' ? '2. Indicadores de Rentabilidad & Eficiencia Operativa' : '2. Profitability & Operational Efficiency Indicators'}
                </h4>
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded my-2">
                  <div>
                    <div className="text-[10px] uppercase text-slate-500">{t('analytics.kpi.wip')}</div>
                    <div className="mono text-base font-bold text-slate-900">€ {totalWIP.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-500">{t('analytics.kpi.realization')}</div>
                    <div className="mono text-base font-bold text-emerald-700">96.4%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-500">{t('analytics.kpi.dso')}</div>
                    <div className="mono text-base font-bold text-slate-900">27.4 {language === 'es' ? 'días' : 'days'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="serif font-bold text-sm uppercase tracking-wider text-slate-900 mb-1">
                  {language === 'es' ? '3. Certificación de Secreto Profesional & Auditoría' : '3. Professional Secrecy & Audit Certification'}
                </h4>
                <p className="text-[11px] text-slate-600">
                  {language === 'es'
                    ? 'El presente dictamen ha sido emitido bajo estricta observancia de los estatutos del Estatuto General de la Abogacía Española (EGAE) y las normas deontológicas del CCBE. Todos los datos de honorarios e imputaciones se encuentran custodiados bajo cifrado criptográfico conforme al Nivel 1 de Secreto Profesional.'
                    : 'This statement is issued in strict compliance with the General Statute of the Legal Profession (EGAE) and CCBE Code of Conduct. All billing and ledger records are protected under Level 1 Professional Secrecy cryptographic safeguards.'
                  }
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Imprimir / Guardar en PDF' : 'Print / Save as PDF'}</span>
              </button>

              <button
                onClick={() => setShowExecutiveReport(false)}
                className="px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
              >
                {t('action.close')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
