import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  DollarSign, 
  Lock, 
  Check, 
  Save, 
  Sparkles, 
  FileText, 
  Users, 
  History, 
  Cpu
} from 'lucide-react';
import { FirmProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface FirmSettingsViewProps {
  currentFirm: FirmProfile;
  onUpdateFirm: (updated: Partial<FirmProfile>) => void;
}

export const FirmSettingsView: React.FC<FirmSettingsViewProps> = ({ currentFirm, onUpdateFirm }) => {
  const { language } = useLanguage();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [firmName, setFirmName] = useState(currentFirm.name);
  const [latinMotto, setLatinMotto] = useState(currentFirm.latinMotto);
  const [city, setCity] = useState(currentFirm.city);
  const [barAssoc, setBarAssoc] = useState(currentFirm.barAssociation);
  const [partner, setPartner] = useState(currentFirm.primaryPartner);
  const [partnerRate, setPartnerRate] = useState(currentFirm.defaultHourlyRate.toString());
  const [seniorRate, setSeniorRate] = useState('260');
  const [juniorRate, setJuniorRate] = useState('150');
  const [paralegalRate, setParalegalRate] = useState('95');
  const [vatRate, setVatRate] = useState('21');
  const [insurancePolicy, setInsurancePolicy] = useState('RC-MUTUA-ABOGACIA-2026-99128');
  const [insuranceAmount, setInsuranceAmount] = useState('10.000.000');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFirm({
      name: firmName,
      latinMotto,
      city,
      barAssociation: barAssoc,
      primaryPartner: partner,
      defaultHourlyRate: Number(partnerRate) || currentFirm.defaultHourlyRate
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-md bg-slate-100 text-slate-800">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="serif text-base font-semibold text-slate-900">
              {language === 'es' ? 'Configuración de la Firma & Parámetros Deontológicos' : 'Law Firm Profile & Statutory Settings'}
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              {language === 'es' 
                ? 'Identidad colegial, tarifas horarias arancelarias, pólizas de responsabilidad civil y sellado de tiempo eIDAS.'
                : 'Bar registry identity, hourly rate cards, professional liability indemnity and eIDAS timestamp configurations.'}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>{language === 'es' ? 'Parámetros Guardados' : 'Settings Saved'}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs text-slate-700">
        
        {/* Section 1: Firm Legal Identity */}
        <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-slate-700" />
            <h3 className="serif text-sm font-semibold text-slate-900">
              {language === 'es' ? '1. Datos Corporativos & Registro Colegial' : '1. Corporate Identity & Bar Registration'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                {language === 'es' ? 'Razón Social de la Firma' : 'Firm Legal Name'}
              </label>
              <input
                type="text"
                required
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                {language === 'es' ? 'Lema Institucional (Latín)' : 'Institutional Latin Motto'}
              </label>
              <input
                type="text"
                value={latinMotto}
                onChange={(e) => setLatinMotto(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 serif italic focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                {language === 'es' ? 'Ilustre Colegio de Abogados de Adscripción' : 'Governing Bar Association'}
              </label>
              <input
                type="text"
                value={barAssoc}
                onChange={(e) => setBarAssoc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                {language === 'es' ? 'Sede Central / Domicilio Social' : 'Headquarters City & Forum'}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                {language === 'es' ? 'Socio Director Responsable' : 'Managing Partner'}
              </label>
              <input
                type="text"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                {language === 'es' ? 'Número de Registro ICAM / CGAE' : 'Bar License ID'}
              </label>
              <input
                type="text"
                disabled
                value="ICAM-88412 / CGAE-0294"
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-slate-600 mono cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Rate Card & Billing Framework */}
        <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-4 h-4 text-slate-700" />
            <h3 className="serif text-sm font-semibold text-slate-900">
              {language === 'es' ? '2. Escala Arancelaria & Tarifas por Categoría Profesional' : '2. Rate Cards & Professional Tiers'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Socio (Partner)' : 'Partner Rate'}</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-mono">€</span>
                <input
                  type="number"
                  value={partnerRate}
                  onChange={(e) => setPartnerRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 mono font-bold"
                />
                <span className="text-slate-500 font-mono">/h</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Asociado Senior' : 'Senior Associate'}</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-mono">€</span>
                <input
                  type="number"
                  value={seniorRate}
                  onChange={(e) => setSeniorRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 mono font-bold"
                />
                <span className="text-slate-500 font-mono">/h</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Asociado Junior' : 'Junior Associate'}</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-mono">€</span>
                <input
                  type="number"
                  value={juniorRate}
                  onChange={(e) => setJuniorRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 mono font-bold"
                />
                <span className="text-slate-500 font-mono">/h</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Paralegal / Pasante' : 'Paralegal'}</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-mono">€</span>
                <input
                  type="number"
                  value={paralegalRate}
                  onChange={(e) => setParalegalRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-900 mono font-bold"
                />
                <span className="text-slate-500 font-mono">/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Professional Liability & Security */}
        <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <h3 className="serif text-sm font-semibold text-slate-900">
              {language === 'es' ? '3. Seguro de Responsabilidad Civil & Criptoseguridad' : '3. Professional Indemnity & Cryptosecurity'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                {language === 'es' ? 'Póliza RC Profesional (Mutua de la Abogacía)' : 'Indemnity Insurance Policy ID'}
              </label>
              <input
                type="text"
                value={insurancePolicy}
                onChange={(e) => setInsurancePolicy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                {language === 'es' ? 'Cobertura Asegurada por Siniestro (€)' : 'Coverage Cap (€)'}
              </label>
              <input
                type="text"
                value={insuranceAmount}
                onChange={(e) => setInsuranceAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono font-bold focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {language === 'es' 
                    ? 'Sellado de tiempo cualificado eIDAS activo en todos los documentos subidos a la Bóveda.'
                    : 'eIDAS qualified time-stamping active across all digital custody vault files.'}
                </span>
              </div>
              <span className="text-[10px] mono px-2 py-0.5 rounded bg-white border border-slate-200 text-emerald-700 font-bold">
                AES-256 / SHA-256
              </span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'es' ? 'Guardar Cambios de la Firma' : 'Save Firm Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
