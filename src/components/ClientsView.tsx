import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink,
  DollarSign, 
  Briefcase, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { CorporateClient, LegalCase, FirmProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ClientsViewProps {
  clients: CorporateClient[];
  cases: LegalCase[];
  firm: FirmProfile;
  onAddClient: (newClient: CorporateClient) => void;
  onSelectClientForDetail: (client: CorporateClient) => void;
  onOpenConflictModalForClient: (clientName: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  cases,
  firm,
  onAddClient,
  onSelectClientForDetail,
  onOpenConflictModalForClient
}) => {
  const { language, t, localizeClientTier, localizeKycStatus, localizeBillingModel } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedKycStatus, setSelectedKycStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Client Form State
  const [formName, setFormName] = useState('');
  const [formTaxId, setFormTaxId] = useState('');
  const [formIndustry, setFormIndustry] = useState('Energía Renovable & Utilities');
  const [formTier, setFormTier] = useState<CorporateClient['tier']>('Key Account (Tier 1)');
  const [formLeadPartner, setFormLeadPartner] = useState(firm.primaryPartner);
  const [formBillingModel, setFormBillingModel] = useState<CorporateClient['billingModel']>('Por Horas');
  const [formCity] = useState(firm.city.split('/')[0].trim());
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('+34 91 ');
  const [formHeadquarters, setFormHeadquarters] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formContactRole, setFormContactRole] = useState('General Counsel');
  const [formNotes, setFormNotes] = useState('');
  const [formAmlRisk, setFormAmlRisk] = useState<CorporateClient['amlRisk']>('Bajo');

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = selectedTier === 'all' || c.tier === selectedTier;
    const matchesKyc = selectedKycStatus === 'all' || c.kycStatus === selectedKycStatus;

    return matchesSearch && matchesTier && matchesKyc;
  });

  // Financial aggregation
  const totalBilled = clients.reduce((acc, c) => acc + c.totalBilledYTD, 0);
  const activeCount = clients.filter(c => c.status === 'Activo').length;
  const verifiedKycCount = clients.filter(c => c.kycStatus === 'Verificado (Nivel 1)').length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTaxId.trim()) return;

    const newClient: CorporateClient = {
      id: `client-${Date.now()}`,
      name: formName,
      taxId: formTaxId,
      industry: formIndustry,
      tier: formTier,
      status: 'Activo',
      kycStatus: 'Verificado (Nivel 1)',
      amlRisk: formAmlRisk,
      leadPartner: formLeadPartner,
      billingModel: formBillingModel,
      totalBilledYTD: 0,
      openMattersCount: 0,
      city: formCity,
      email: formEmail || `legal@${formName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: formPhone,
      headquarters: formHeadquarters || `${formCity}, España`,
      contactPerson: formContactPerson || (language === 'es' ? 'Director de Asesoría Jurídica' : 'Head of Legal Counsel'),
      contactRole: formContactRole,
      notes: formNotes || (language === 'es' ? 'Cliente incorporado tras clearance deontológico satisfactorio.' : 'Client onboarded following standard conflict and ethical clearance.'),
      clientSince: new Date().getFullYear().toString()
    };

    onAddClient(newClient);
    setShowAddModal(false);

    // Reset
    setFormName('');
    setFormTaxId('');
    setFormHeadquarters('');
    setFormContactPerson('');
    setFormNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('clients.kpi.active')}</span>
            <Building2 className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mono text-2xl font-bold text-slate-900">
            {activeCount} <span className="text-sm font-normal text-slate-500">{language === 'es' ? 'entidades' : 'entities'}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {clients.length} {t('clients.kpi.activeDesc')}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('clients.kpi.ytd')}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mono text-2xl font-bold text-emerald-700">
            € {totalBilled.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-700 font-medium">{t('clients.kpi.ytdDesc')}</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('clients.kpi.kyc')}</span>
            <ShieldCheck className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mono text-2xl font-bold text-slate-900">
            {Math.round((verifiedKycCount / (clients.length || 1)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {verifiedKycCount} {t('clients.kpi.kycDesc')}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">{t('clients.kpi.firm')}</span>
            <Briefcase className="w-4 h-4 text-slate-700" />
          </div>
          <div className="serif text-base font-bold text-slate-900 truncate">
            {firm.name.split('&')[0]}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {firm.barAssociation.split('(')[0]}
          </div>
        </div>
      </div>

      {/* Action and Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('clients.search.placeholder')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Filter by Tier */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none cursor-pointer"
          >
            <option value="all">{t('clients.filter.tier')}</option>
            <option value="Key Account (Tier 1)">{localizeClientTier('Key Account (Tier 1)')}</option>
            <option value="Corporate">{localizeClientTier('Corporate')}</option>
            <option value="Venture / Tech">{localizeClientTier('Venture / Tech')}</option>
            <option value="Family Office & Banca Privada">{localizeClientTier('Family Office & Banca Privada')}</option>
          </select>

          {/* Filter by KYC */}
          <select
            value={selectedKycStatus}
            onChange={(e) => setSelectedKycStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none cursor-pointer"
          >
            <option value="all">{t('clients.filter.kyc')}</option>
            <option value="Verificado (Nivel 1)">{localizeKycStatus('Verificado (Nivel 1)')}</option>
            <option value="Pendiente Documentación">{localizeKycStatus('Pendiente Documentación')}</option>
            <option value="Revisión Anual">{localizeKycStatus('Revisión Anual')}</option>
          </select>

          {/* Add Client Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer transition active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('clients.btn.newClient')}</span>
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-lg bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">{t('clients.table.company')}</th>
                <th className="px-4 py-3.5">{t('clients.table.tier')}</th>
                <th className="px-4 py-3.5">{t('clients.table.contact')}</th>
                <th className="px-4 py-3.5">{t('clients.table.partner')}</th>
                <th className="px-4 py-3.5">{t('clients.table.billing')}</th>
                <th className="px-4 py-3.5">{t('clients.table.kyc')}</th>
                <th className="px-4 py-3.5 text-right">{t('clients.table.billed')}</th>
                <th className="px-4 py-3.5 text-right">{t('clients.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    {language === 'es' ? 'No se encontraron entidades o clientes con los filtros aplicados.' : 'No entities found matching selected filters.'}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const clientMatters = cases.filter(c => c.client === client.name);
                  return (
                    <tr 
                      key={client.id} 
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Name and NIF */}
                      <td className="px-4 py-3.5">
                        <div 
                          onClick={() => onSelectClientForDetail(client)}
                          className="font-semibold text-slate-900 hover:text-slate-700 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{client.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="mono text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{language === 'es' ? 'NIF/TaxID:' : 'Tax ID:'} {client.taxId}</span>
                          <span>•</span>
                          <span>{client.city}</span>
                        </div>
                      </td>

                      {/* Tier & Industry */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-medium ${
                          client.tier === 'Key Account (Tier 1)' ? 'bg-slate-900 text-white' :
                          client.tier === 'Venture / Tech' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {localizeClientTier(client.tier)}
                        </span>
                        <div className="text-slate-500 text-[11px] mt-0.5 truncate max-w-[150px]">
                          {client.industry}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-900">{client.contactPerson}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          {client.contactRole}
                        </div>
                      </td>

                      {/* Partner */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700">
                        {client.leadPartner}
                      </td>

                      {/* Billing Model */}
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {localizeBillingModel(client.billingModel)}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {clientMatters.length} {language === 'es' ? 'expedientes abiertos' : 'active matters'}
                        </div>
                      </td>

                      {/* KYC Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${
                          client.kycStatus === 'Verificado (Nivel 1)' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : client.kycStatus === 'Pendiente Documentación'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {client.kycStatus === 'Verificado (Nivel 1)' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {client.kycStatus === 'Pendiente Documentación' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                          <span>{localizeKycStatus(client.kycStatus)}</span>
                        </span>
                      </td>

                      {/* Total Billed */}
                      <td className="px-4 py-3.5 text-right mono font-bold text-slate-900 whitespace-nowrap">
                        € {client.totalBilledYTD.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenConflictModalForClient(client.name)}
                            title={language === 'es' ? "Comprobar Conflicto de Interés" : "Check Conflict of Interest"}
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectClientForDetail(client)}
                            className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-medium transition cursor-pointer shadow-xs"
                          >
                            {language === 'es' ? 'Ver Ficha' : 'View Profile'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-lg p-6 shadow-xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-800" />
                <h3 className="serif text-base font-semibold text-slate-900">
                  {t('clients.modal.title')}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('clients.modal.companyName')}</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Acciona Infraestructuras S.A."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('clients.modal.taxId')}</label>
                  <input
                    type="text"
                    required
                    value={formTaxId}
                    onChange={(e) => setFormTaxId(e.target.value)}
                    placeholder="Ej. A-28001923"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('clients.modal.tier')}</label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as CorporateClient['tier'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Key Account (Tier 1)">{localizeClientTier('Key Account (Tier 1)')}</option>
                    <option value="Corporate">{localizeClientTier('Corporate')}</option>
                    <option value="Venture / Tech">{localizeClientTier('Venture / Tech')}</option>
                    <option value="Family Office & Banca Privada">{localizeClientTier('Family Office & Banca Privada')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('clients.modal.industry')}</label>
                  <input
                    type="text"
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('clients.modal.billingModel')}</label>
                  <select
                    value={formBillingModel}
                    onChange={(e) => setFormBillingModel(e.target.value as CorporateClient['billingModel'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Por Horas">{localizeBillingModel('Por Horas')}</option>
                    <option value="Retainer Mensual">{localizeBillingModel('Retainer Mensual')}</option>
                    <option value="Fixed Fee + Success">{localizeBillingModel('Fixed Fee + Success')}</option>
                    <option value="Abono Mixto">{localizeBillingModel('Abono Mixto')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('clients.modal.leadPartner')}</label>
                  <input
                    type="text"
                    value={formLeadPartner}
                    onChange={(e) => setFormLeadPartner(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Calificación de Riesgo AML' : 'AML Risk Rating'}</label>
                  <select
                    value={formAmlRisk}
                    onChange={(e) => setFormAmlRisk(e.target.value as CorporateClient['amlRisk'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Bajo">{language === 'es' ? 'Riesgo Bajo (Estándar)' : 'Low Risk (Standard)'}</option>
                    <option value="Moderado">{language === 'es' ? 'Riesgo Moderado' : 'Moderate Risk'}</option>
                    <option value="Alto">{language === 'es' ? 'Riesgo Alto (PEP / Jurisdicción sensible)' : 'High Risk (PEP / Sensitive)'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('clients.modal.contactPerson')}</label>
                  <input
                    type="text"
                    value={formContactPerson}
                    onChange={(e) => setFormContactPerson(e.target.value)}
                    placeholder="D. Juan Manuel Pérez"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Cargo / Función' : 'Role / Function'}</label>
                  <input
                    type="text"
                    value={formContactRole}
                    onChange={(e) => setFormContactRole(e.target.value)}
                    placeholder="General Counsel / CCO"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Email Legal' : 'Legal Email'}</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="legal@empresa.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Sede Social / Domicilio' : 'Headquarters / Address'}</label>
                  <input
                    type="text"
                    value={formHeadquarters}
                    onChange={(e) => setFormHeadquarters(e.target.value)}
                    placeholder="Paseo de la Castellana 200, Madrid"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Teléfono Directo' : 'Direct Phone'}</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Instrucciones & Notas Deontológicas' : 'Ethical Notes & Instructions'}</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={language === 'es' ? "Información sobre tarifas pactadas, límites de autorización o notas de conflicto..." : "Agreed fee arrangements, signature caps, or conflict notes..."}
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
                  {t('clients.modal.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
