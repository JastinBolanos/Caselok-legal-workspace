import React, { useState } from 'react';
import { 
  Scale, 
  Layers, 
  FolderLock, 
  Clock, 
  Home, 
  Building2, 
  ChevronDown,
  Calendar,
  BarChart3,
  Users,
  Globe,
  Landmark,
  Sliders
} from 'lucide-react';
import { FirmProfile } from '../types';
import { FIRM_PROFILES } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

export type AppNavView = 'kanban' | 'vault' | 'billing' | 'clients' | 'agenda' | 'analytics' | 'trust' | 'settings';

interface NavbarProps {
  currentFirm: FirmProfile;
  onSelectFirm: (firm: FirmProfile) => void;
  activeView: AppNavView;
  onSelectView: (view: AppNavView) => void;
  onOpenWelcome: () => void;
  onOpenCopilot?: () => void;
  onOpenConflictModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentFirm,
  onSelectFirm,
  activeView,
  onSelectView,
  onOpenWelcome,
}) => {
  const [showFirmMenu, setShowFirmMenu] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-3">
          
          {/* Left: Brand & Firm Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Logo */}
            <div 
              onClick={onOpenWelcome}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
              title={language === 'es' ? "Volver a la pantalla de bienvenida" : "Back to Welcome Screen"}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 border border-slate-700 text-slate-200 group-hover:border-slate-500 transition shrink-0">
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <div className="shrink-0">
                <span className="serif text-base sm:text-lg tracking-tight font-semibold text-slate-100 block leading-tight">
                  Caselok
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-slate-400 block -mt-0.5">
                  {t('brand.subtitle')}
                </span>
              </div>
            </div>

            {/* Firm Dropdown Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowFirmMenu(!showFirmMenu)}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                <span className="max-w-[100px] sm:max-w-[130px] xl:max-w-[160px] truncate font-medium text-[11px] text-slate-100">
                  {currentFirm.name.split('&')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {showFirmMenu && (
                <div className="absolute left-0 mt-2 w-64 rounded-lg bg-slate-900 border border-slate-700 shadow-xl p-1.5 z-50">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 px-2.5 py-1.5 font-semibold">
                    {language === 'es' ? 'Bufetes Registrados' : 'Registered Law Firms'}
                  </div>
                  {FIRM_PROFILES.map((firm) => (
                    <button
                      key={firm.id}
                      onClick={() => {
                        onSelectFirm(firm);
                        setShowFirmMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition cursor-pointer ${
                        firm.id === currentFirm.id
                          ? 'bg-slate-800 text-white font-medium border border-slate-700'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-100">{firm.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{firm.city} • €{firm.defaultHourlyRate}/h</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Main View Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-750 shrink-0">
            <button
              onClick={() => onSelectView('kanban')}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] xl:text-xs font-medium transition cursor-pointer ${
                activeView === 'kanban'
                  ? 'bg-slate-950 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.litigation')}</span>
            </button>

            <button
              onClick={() => onSelectView('agenda')}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] xl:text-xs font-medium transition cursor-pointer ${
                activeView === 'agenda'
                  ? 'bg-slate-950 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.agenda')}</span>
            </button>

            <button
              onClick={() => onSelectView('clients')}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] xl:text-xs font-medium transition cursor-pointer ${
                activeView === 'clients'
                  ? 'bg-slate-950 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.clients')}</span>
            </button>

            <button
              onClick={() => onSelectView('vault')}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] xl:text-xs font-medium transition cursor-pointer ${
                activeView === 'vault'
                  ? 'bg-slate-950 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderLock className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.vault')}</span>
            </button>

            <button
              onClick={() => onSelectView('billing')}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] xl:text-xs font-medium transition cursor-pointer ${
                activeView === 'billing'
                  ? 'bg-slate-950 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.billing')}</span>
            </button>

            <button
              onClick={() => onSelectView('trust')}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] xl:text-xs font-medium transition cursor-pointer ${
                activeView === 'trust'
                  ? 'bg-slate-950 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.trust')}</span>
            </button>

            <button
              onClick={() => onSelectView('analytics')}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] xl:text-xs font-medium transition cursor-pointer ${
                activeView === 'analytics'
                  ? 'bg-slate-950 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.analytics')}</span>
            </button>

            <button
              onClick={() => onSelectView('settings')}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] xl:text-xs font-medium transition cursor-pointer ${
                activeView === 'settings'
                  ? 'bg-slate-950 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.settings')}</span>
            </button>
          </nav>

          {/* Right: Quick Tools & Language Switcher & Home Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="whitespace-nowrap flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer shadow-xs"
              title={language === 'es' ? 'Cambiar a English (EN)' : 'Switch to Español (ES)'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold text-slate-100">{language === 'es' ? 'ES' : 'EN'}</span>
              <span className="text-[10px] text-slate-400 hidden xl:inline">({language === 'es' ? 'Español' : 'English'})</span>
            </button>

            {/* Home / Welcome Portal Button (Kept in place) */}
            <button
              onClick={onOpenWelcome}
              title={language === 'es' ? "Pantalla de Bienvenida y Portal" : "Welcome Portal"}
              className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer shrink-0"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile/Tablet Sub-Navigation Scrollbar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800 text-xs no-scrollbar">
          <button
            onClick={() => onSelectView('kanban')}
            className={`px-3 py-1 rounded-md shrink-0 font-medium ${
              activeView === 'kanban' ? 'bg-slate-950 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {t('nav.litigation')}
          </button>
          <button
            onClick={() => onSelectView('agenda')}
            className={`px-3 py-1 rounded-md shrink-0 font-medium ${
              activeView === 'agenda' ? 'bg-slate-950 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {t('nav.agenda')}
          </button>
          <button
            onClick={() => onSelectView('clients')}
            className={`px-3 py-1 rounded-md shrink-0 font-medium ${
              activeView === 'clients' ? 'bg-slate-950 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {t('nav.clients')}
          </button>
          <button
            onClick={() => onSelectView('vault')}
            className={`px-3 py-1 rounded-md shrink-0 font-medium ${
              activeView === 'vault' ? 'bg-slate-950 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {t('nav.vault')}
          </button>
          <button
            onClick={() => onSelectView('billing')}
            className={`px-3 py-1 rounded-md shrink-0 font-medium ${
              activeView === 'billing' ? 'bg-slate-950 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {t('nav.billing')}
          </button>
          <button
            onClick={() => onSelectView('trust')}
            className={`px-3 py-1 rounded-md shrink-0 font-medium ${
              activeView === 'trust' ? 'bg-slate-950 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {t('nav.trust')}
          </button>
          <button
            onClick={() => onSelectView('analytics')}
            className={`px-3 py-1 rounded-md shrink-0 font-medium ${
              activeView === 'analytics' ? 'bg-slate-950 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {t('nav.analytics')}
          </button>
          <button
            onClick={() => onSelectView('settings')}
            className={`px-3 py-1 rounded-md shrink-0 font-medium ${
              activeView === 'settings' ? 'bg-slate-950 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            {t('nav.settings')}
          </button>
        </div>
      </div>
    </header>
  );
};
