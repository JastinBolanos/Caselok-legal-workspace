import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Scale, 
  ShieldCheck, 
  Building2, 
  LockKeyhole,
  CheckCircle2, 
  Award, 
  Globe,
  KeyRound,
  Play,
  UserPlus,
  Headphones,
  ShieldAlert
} from 'lucide-react';
import { FirmProfile } from '../types';
import { FIRM_PROFILES } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { AuthModal } from './AuthModal';

interface WelcomeScreenProps {
  currentFirm: FirmProfile;
  onSelectFirm: (firm: FirmProfile) => void;
  onEnterWorkspace: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  currentFirm,
  onSelectFirm,
  onEnterWorkspace,
}) => {
  const { language, toggleLanguage, t, localizeFirmDesc } = useLanguage();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register' | 'support'>('login');

  const openAuthWithTab = (tab: 'login' | 'register' | 'support') => {
    setAuthDefaultTab(tab);
    setIsAuthOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between overflow-x-hidden">
      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-slate-900 text-white shadow-xs">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="serif text-2xl font-bold tracking-tight text-slate-900">
                Caselok
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                {t('brand.subtitle')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              {t('brand.tagline')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          {/* Quick Access Sign In in Header */}
          <button
            onClick={() => openAuthWithTab('login')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs transition cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'es' ? 'Acceso Colegial' : 'Solicitor Login'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:border-slate-400 shadow-xs text-slate-800 font-medium transition cursor-pointer"
            title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-semibold">{language === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}</span>
            <span className="text-[10px] text-slate-400">| {language === 'es' ? 'EN' : 'ES'}</span>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 shadow-xs">
            <LockKeyhole className="w-3.5 h-3.5 text-emerald-600" />
            <span className="mono text-[11px]">{t('system.encryption')}</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-slate-800" />
            <span>{t('system.audit')}</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Welcome Typographic Showcase */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        {/* Top Heraldic Roman Motto Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="serif italic text-sm text-slate-800">
              «{currentFirm.latinMotto}»
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              {t('welcome.motto_tag')}
            </span>
          </div>
        </motion.div>

        {/* Central Display Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <h1 className="serif text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-tight italic font-semibold mb-4">
            {t('welcome.title')}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed">
            {t('welcome.subtitle')}
          </p>
        </motion.div>

        {/* Typographic Cards / Firm Switcher */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full mb-10"
        >
          {FIRM_PROFILES.map((firm) => {
            const isSelected = firm.id === currentFirm.id;
            return (
              <div
                key={firm.id}
                onClick={() => onSelectFirm(firm)}
                className={`relative cursor-pointer rounded-lg p-6 transition-all duration-200 text-left border ${
                  isSelected
                    ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Active Indicator Seal */}
                {isSelected && (
                  <div className="absolute -top-3 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{t('nav.currentFirm')}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-md border ${
                    isSelected 
                      ? 'bg-slate-900 text-amber-400 border-slate-900' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900">
                      {firm.name}
                    </h3>
                    <p className="mono text-[11px] text-slate-500 font-medium">
                      {t('timer.rate')} €{firm.defaultHourlyRate}/h
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 min-h-[36px]">
                  {localizeFirmDesc(firm.id, firm.shortDescription)}
                </p>

                {/* Micro-typography specs */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>{language === 'es' ? 'Colegio:' : 'Bar Assoc:'}</span>
                    <span className="font-medium text-slate-800 truncate max-w-[170px]">{firm.barAssociation}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>{t('welcome.primaryPartner')}:</span>
                    <span className="font-medium text-slate-800">{firm.primaryPartner}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>{t('welcome.portfolio')}:</span>
                    <span className="mono font-semibold text-emerald-700">{firm.managedPortfolioValue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Feature Highlights Minimalist Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto w-full mb-10"
        >
          <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-slate-100 text-slate-700 font-bold text-xs shrink-0">
              I
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                {language === 'es' ? 'Tablero Kanban Procesal' : 'Procedural Litigation Board'}
              </h4>
              <p className="text-xs text-slate-500 leading-snug">
                {language === 'es'
                  ? 'Seguimiento visual del ciclo de vida de litigios, arbitrajes y transacciones.'
                  : 'Visual tracking of the lifecycle of litigations, arbitrations, and deals.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-slate-100 text-slate-700 font-bold text-xs shrink-0">
              II
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                {language === 'es' ? 'Temporizador Facturable Live' : 'Live Billable Hours Stopwatch'}
              </h4>
              <p className="text-xs text-slate-500 leading-snug">
                {language === 'es'
                  ? 'Cronometraje en tiempo real vinculado a clientes y cálculo automático de honorarios.'
                  : 'Real-time billing linked to clients with automatic fee calculation.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-slate-100 text-slate-700 font-bold text-xs shrink-0">
              III
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                {language === 'es' ? 'Bóveda Documental Cifrada' : 'Encrypted Document Vault'}
              </h4>
              <p className="text-xs text-slate-500 leading-snug">
                {language === 'es'
                  ? 'Cadena de custodia digital, huella SHA-256 y clasificación estricta de secreto profesional.'
                  : 'Digital chain of custody, SHA-256 integrity, and strict legal privilege tiering.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Launch & Login Experience Buttons Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 max-w-xl mx-auto w-full"
        >
          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full">
            {/* Primary Secure Login Button */}
            <button
              onClick={() => openAuthWithTab('login')}
              className="w-full sm:w-auto flex-1 group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold tracking-wide shadow-sm hover:shadow active:scale-98 transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>
                {language === 'es'
                  ? `Iniciar Sesión en ${currentFirm.name.split(' ')[0]}`
                  : `Sign In to ${currentFirm.name.split(' ')[0]}`}
              </span>
            </button>

            {/* Demonstration Direct Exploration Button */}
            <button
              onClick={onEnterWorkspace}
              className="w-full sm:w-auto flex-1 group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 text-sm font-semibold tracking-wide shadow-xs active:scale-98 transition cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-600/30" />
              <span>
                {language === 'es' ? 'Ver Demostración' : 'Explore Live Demo'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 ml-1">
                {language === 'es' ? 'Libre' : 'Free'}
              </span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer Legal & Security Watermark */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-slate-600" />
          <span>{language === 'es' ? 'Certificación ISO 27001 / ENS Nivel Alto' : 'ISO 27001 / High Security Certified'}</span>
        </div>
        <div className="serif italic text-sm text-slate-600">
          «Iustitia est constans et perpetua voluntas ius suum cuique tribuendi» — Ulpiano
        </div>
      </footer>

      {/* Secure Authentication & Manual Onboarding Modal */}
      <AuthModal
        currentFirm={currentFirm}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={onEnterWorkspace}
        defaultTab={authDefaultTab}
      />
    </div>
  );
};
