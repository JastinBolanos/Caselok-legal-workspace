import React, { useState } from 'react';
import { 
  LockKeyhole, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Scale, 
  KeyRound, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle,
  FileCheck,
  Headphones
} from 'lucide-react';
import { FirmProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AuthModalProps {
  currentFirm: FirmProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
  defaultTab?: 'login' | 'register' | 'support';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentFirm,
  isOpen,
  onClose,
  onSuccessLogin,
  defaultTab = 'login',
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'support'>(defaultTab);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regFirm, setRegFirm] = useState(currentFirm.name);
  const [regBarId, setRegBarId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCategory, setRegCategory] = useState<'socio' | 'asociado' | 'inhouse'>('socio');
  const [registerSubmitted, setRegisterSubmitted] = useState(false);
  const [regTicketId, setRegTicketId] = useState('');

  // Support form state
  const [supName, setSupName] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supTopic, setSupTopic] = useState('registro_manual');
  const [supMessage, setSupMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supTicketId, setSupTicketId] = useState('');

  if (!isOpen) return null;

  // Valid credentials whitelist for authorized partners / demonstration
  const AUTHORIZED_ACCOUNTS = [
    { email: 'socio@caselok.com', pass: 'Caselok2026!' },
    { email: 'elena.delavega@caselok.com', pass: 'Caselok2026!' },
    { email: 'santiago.bernabeu@caselok.com', pass: 'Caselok2026!' },
    { email: 'admin@caselok.com', pass: 'Admin2026!' },
    { email: 'demo@caselok.com', pass: 'Demo2026!' },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    setTimeout(() => {
      setIsLoggingIn(false);
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      const matched = AUTHORIZED_ACCOUNTS.find(
        acc => acc.email.toLowerCase() === cleanEmail && acc.pass === cleanPass
      );

      if (matched) {
        onSuccessLogin();
        onClose();
      } else {
        // Deny access to any non-authorized credential
        setLoginError(
          language === 'es'
            ? 'Acceso denegado por protocolo de seguridad. El correo o credenciales introducidas no figuran activas en el censo corporativo de Caselok. Por razones de confidencialidad y secreto profesional, los accesos requieren registro y verificación manual previa por parte del equipo de soporte.'
            : 'Access denied by strict security protocol. The provided credentials are not found in Caselok verified corporate roster. Due to professional secrecy and ISO 27001 compliance, user access must be manually verified and provisioned by support.'
        );
      }
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;

    const ticket = `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setRegTicketId(ticket);
    setRegisterSubmitted(true);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supEmail) return;

    const ticket = `SUP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSupTicketId(ticket);
    setSupportSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs p-4 sm:p-6 md:p-8 flex justify-center items-start min-h-screen">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-8 sm:my-12 md:my-14 shrink-0 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg p-1.5 rounded-md hover:bg-slate-800 transition cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="serif text-xl font-bold tracking-tight text-white">
                  Caselok
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {language === 'es' ? 'Acceso Corporativo' : 'Corporate Gateway'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentFirm.name} • {currentFirm.city}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-5 border-t border-slate-800 pt-3 text-xs">
            <button
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'es' ? 'Iniciar Sesión' : 'Sign In'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('register');
                setRegisterSubmitted(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'es' ? 'Solicitar Registro' : 'Register Account'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('support');
                setSupportSubmitted(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeTab === 'support'
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'es' ? 'Enviar a Soporte' : 'Support / Onboarding'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-xs text-slate-700">
          
          {/* TAB 1: INICIAR SESIÓN */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {loginError && (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-rose-950">
                    <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>{language === 'es' ? 'Acceso Bloqueado' : 'Unauthorized Access'}</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {loginError}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('register');
                        setRegisterSubmitted(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-900 hover:bg-rose-800 text-white font-medium text-[11px] transition cursor-pointer"
                    >
                      <User className="w-3 h-3" />
                      <span>{language === 'es' ? 'Solicitar Registro a Soporte' : 'Request Manual Onboarding'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('support');
                        setSupportSubmitted(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-rose-300 hover:bg-rose-100/50 text-rose-900 font-medium text-[11px] transition cursor-pointer"
                    >
                      <Headphones className="w-3 h-3" />
                      <span>{language === 'es' ? 'Contactar a Soporte Técnico' : 'Contact Support Desk'}</span>
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-800 font-medium mb-1 flex items-center justify-between">
                    <span>{language === 'es' ? 'Correo Electrónico Corporativo / Censo Colegial' : 'Corporate Email / Bar Registry'}</span>
                    <span className="text-[10px] text-slate-400">ej. socio@caselok.com</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setLoginError(null);
                      }}
                      placeholder="letrado@despacho.es"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none text-xs transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-medium mb-1 flex items-center justify-between">
                    <span>{language === 'es' ? 'Contraseña / Clave Criptográfica' : 'Password / Cryptographic Key'}</span>
                    <span className="text-[10px] text-slate-400">AES-256</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError(null);
                      }}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none text-xs transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('support')}
                    className="text-slate-500 hover:text-slate-900 text-[11px] underline cursor-pointer"
                  >
                    {language === 'es' ? '¿Problemas de acceso?' : 'Trouble logging in?'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>
                    {isLoggingIn 
                      ? (language === 'es' ? 'Verificando con Censo ICAM...' : 'Verifying with Bar Registry...') 
                      : (language === 'es' ? 'Iniciar Sesión en el Despacho' : 'Sign In to Workspace')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SOLICITAR REGISTRO (REGISTRARSE) */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              {!registerSubmitted ? (
                <>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <p className="font-semibold text-slate-900 mb-1">
                      {language === 'es' ? 'Registro Deontológico Homologado' : 'Statutory Registry Onboarding'}
                    </p>
                    <p>
                      {language === 'es'
                        ? 'Debido al secreto profesional y protección de sumarios judiciales, los nuevos despachos son dados de alta de forma manual tras validar su cédula colegial.'
                        : 'Due to attorney-client privilege and judicial secrecy, new firms are provisioned manually upon bar credential verification.'}
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          {language === 'es' ? 'Nombre y Apellidos' : 'Full Name & Title'}
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Dña. Elena de la Vega"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          {language === 'es' ? 'Firma / Despacho Jurídico' : 'Law Firm / Entity'}
                        </label>
                        <input
                          type="text"
                          required
                          value={regFirm}
                          onChange={(e) => setRegFirm(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          {language === 'es' ? 'Colegio de Abogados & Nº Colegiado' : 'Bar Association & License #'}
                        </label>
                        <input
                          type="text"
                          required
                          value={regBarId}
                          onChange={(e) => setRegBarId(e.target.value)}
                          placeholder="ICAM - Colegiado 88.412"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          {language === 'es' ? 'Cargo / Rol' : 'Position / Tier'}
                        </label>
                        <select
                          value={regCategory}
                          onChange={(e) => setRegCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="socio">{language === 'es' ? 'Socio Director / Partner' : 'Managing Partner'}</option>
                          <option value="asociado">{language === 'es' ? 'Letrado Asociado' : 'Senior Associate'}</option>
                          <option value="inhouse">{language === 'es' ? 'Director de Asesoría Jurídica' : 'General Counsel (In-House)'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          {language === 'es' ? 'Correo Electrónico Corporativo' : 'Corporate Email'}
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="elena@bufete-delavega.com"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          {language === 'es' ? 'Teléfono Directo' : 'Direct Phone'}
                        </label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+34 91 555 44 33"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>
                        {language === 'es' 
                          ? 'Enviar Solicitud a Soporte para Registro Manual' 
                          : 'Submit Request to Support for Manual Onboarding'}
                      </span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="serif text-base font-bold text-emerald-900">
                    {language === 'es' ? 'Solicitud de Registro Recibida en Soporte' : 'Registration Request Submitted to Support'}
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                    {language === 'es'
                      ? `Se ha generado el expediente de verificación colegial ${regTicketId}. El equipo de soporte técnico de Caselok procederá al cotejo manual con el censo del Consejo General de la Abogacía Española y le remitirá las llaves criptográficas de acceso en menos de 24 horas.`
                      : `Support onboarding ticket ${regTicketId} was generated. Caselok support engineers will verify your Bar credentials and dispatch cryptographic keys within 24 hours.`}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('login')}
                      className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                      {language === 'es' ? 'Volver al Inicio de Sesión' : 'Back to Sign In'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ENVIAR A SOPORTE DIRECTO */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              {!supportSubmitted ? (
                <>
                  <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-2.5">
                    <Headphones className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5">
                        {language === 'es' ? 'Mesa de Soporte e Integración Caselok' : 'Caselok Desk & Manual Registration'}
                      </span>
                      <span>
                        {language === 'es'
                          ? 'Contacte directamente con el equipo de ingenieros de soporte para altas manuales, configuración de certificados ACA o desbloqueo de cuentas.'
                          : 'Contact support directly for manual provisioning, ACA certificate setup or account unblocking.'}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSupportSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          {language === 'es' ? 'Nombre de Contacto' : 'Contact Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={supName}
                          onChange={(e) => setSupName(e.target.value)}
                          placeholder="Letrado / Administrador"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                        </label>
                        <input
                          type="email"
                          required
                          value={supEmail}
                          onChange={(e) => setSupEmail(e.target.value)}
                          placeholder="contacto@bufete.es"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        {language === 'es' ? 'Motivo del Requerimiento' : 'Request Purpose'}
                      </label>
                      <select
                        value={supTopic}
                        onChange={(e) => setSupTopic(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="registro_manual">{language === 'es' ? 'Registro Manual de Nuevo Despacho / Letrado' : 'Manual Law Firm / Solicitor Registration'}</option>
                        <option value="desbloqueo">{language === 'es' ? 'Desbloqueo de Credenciales y Restablecimiento' : 'Account Unlock & Key Reset'}</option>
                        <option value="integracion_icam">{language === 'es' ? 'Validación de Certificado ACA / LexNET' : 'ACA / LexNET Bar Integration'}</option>
                        <option value="facturacion">{language === 'es' ? 'Facturación y Licenciamiento Corporativo' : 'Enterprise Licensing'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        {language === 'es' ? 'Detalles de la Solicitud / Observaciones' : 'Details & Notes'}
                      </label>
                      <textarea
                        rows={3}
                        value={supMessage}
                        onChange={(e) => setSupMessage(e.target.value)}
                        placeholder={language === 'es' ? "Indique los datos de su despacho o requerimiento para el equipo de soporte..." : "Provide details for the support team..."}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-sky-400" />
                      <span>
                        {language === 'es' 
                          ? 'Enviar Requerimiento a Soporte Técnico' 
                          : 'Send Request to Technical Support'}
                      </span>
                    </button>
                  </form>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Email Directo: <strong className="text-slate-800">soporte@caselok.com</strong></span>
                    <span>Guardia 24/7: <strong className="text-slate-800">+34 910 00 28 44</strong></span>
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-lg bg-sky-50 border border-sky-200 text-sky-950 space-y-3 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 text-sky-700 mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="serif text-base font-bold text-sky-900">
                    {language === 'es' ? 'Incidencia Registrada en Soporte' : 'Support Ticket Dispatched'}
                  </h4>
                  <p className="text-xs text-sky-800 leading-relaxed max-w-md mx-auto">
                    {language === 'es'
                      ? `Su ticket ${supTicketId} ha sido asignado al equipo de soporte de guardia. Un ingeniero colegial se pondrá en contacto a través de ${supEmail || 'su correo'} para realizar el alta manual o resolver la consulta.`
                      : `Ticket ${supTicketId} was assigned to our on-call support team. An engineer will reach out to ${supEmail || 'your email'} to finalize manual registration.`}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('login')}
                      className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                      {language === 'es' ? 'Volver al Inicio de Sesión' : 'Back to Sign In'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
