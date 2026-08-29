import React, { useState } from 'react';
import { 
  Landmark, 
  ShieldCheck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Search, 
  Filter, 
  Lock, 
  FileCheck2, 
  Building2, 
  AlertCircle
} from 'lucide-react';
import { CorporateClient, LegalCase } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export interface TrustTransaction {
  id: string;
  clientName: string;
  caseCode: string;
  type: 'deposit' | 'disbursement' | 'court_bond' | 'fee_transfer';
  amount: number;
  date: string;
  description: string;
  descriptionEn?: string;
  bankAccount: string;
  authorizedBy: string;
  status: 'Audited' | 'Pending';
  voucherId: string;
}

const INITIAL_TRUST_TRANSACTIONS: TrustTransaction[] = [
  {
    id: 'tr-01',
    clientName: 'Banco Santander Corporate & Investment',
    caseCode: 'EXP-2025-084',
    type: 'deposit',
    amount: 150000,
    date: '2026-08-18',
    description: 'Provisión de fondos para peritaje financiero forense internacional',
    descriptionEn: 'Retainer provision for international forensic financial expert valuation',
    bankAccount: 'ES91 0049 1500 0512 3456 7890 (Santander Escrow)',
    authorizedBy: 'Elena de la Vega',
    status: 'Audited',
    voucherId: 'VCH-2026-8821',
  },
  {
    id: 'tr-02',
    clientName: 'Iberia Renovables Holdings',
    caseCode: 'EXP-2025-091',
    type: 'court_bond',
    amount: 85000,
    date: '2026-08-15',
    description: 'Consignación de fianza procesal en la Cuenta de Depósitos Judiciales del TSJM',
    descriptionEn: 'Consignment of procedural court bond into TSJM Judicial Escrow Account',
    bankAccount: 'ES21 0182 2300 1198 7654 3210 (BBVA Depósitos)',
    authorizedBy: 'Santiago Bernabéu',
    status: 'Audited',
    voucherId: 'VCH-2026-8794',
  },
  {
    id: 'tr-03',
    clientName: 'Meridia Real Estate Partners',
    caseCode: 'EXP-2025-042',
    type: 'disbursement',
    amount: 14200,
    date: '2026-08-10',
    description: 'Pago de aranceles notariales y liquidación del Impuesto de Actos Jurídicos Documentados',
    descriptionEn: 'Payment of notary fees and settlement of Stamp Duty Tax (AJD)',
    bankAccount: 'ES91 0049 1500 0512 3456 7890 (Santander Escrow)',
    authorizedBy: 'Elena de la Vega',
    status: 'Audited',
    voucherId: 'VCH-2026-8650',
  },
  {
    id: 'tr-04',
    clientName: 'PharmaCore Therapeutics S.A.',
    caseCode: 'EXP-2025-037',
    type: 'deposit',
    amount: 60000,
    date: '2026-08-04',
    description: 'Depósito en garantía de honorarios para arbitraje ante la Corte de Arbitraje de Madrid',
    descriptionEn: 'Fee escrow deposit for commercial arbitration before the Madrid Court of Arbitration',
    bankAccount: 'ES91 0049 1500 0512 3456 7890 (Santander Escrow)',
    authorizedBy: 'Elena de la Vega',
    status: 'Audited',
    voucherId: 'VCH-2026-8512',
  },
  {
    id: 'tr-05',
    clientName: 'AeroTech Propulsion Systems',
    caseCode: 'EXP-2025-078',
    type: 'fee_transfer',
    amount: 25000,
    date: '2026-07-29',
    description: 'Liberación de fondos en custodia a cuenta operativa tras aprobación de factura FE-2026-104',
    descriptionEn: 'Release of escrow custody funds to operating account upon invoice FE-2026-104 approval',
    bankAccount: 'ES91 0049 1500 0512 3456 7890 (Santander Escrow)',
    authorizedBy: 'Santiago Bernabéu',
    status: 'Audited',
    voucherId: 'VCH-2026-8430',
  }
];

interface TrustAccountViewProps {
  clients: CorporateClient[];
  cases: LegalCase[];
}

export const TrustAccountView: React.FC<TrustAccountViewProps> = ({ clients, cases }) => {
  const { language, localizeCaseTitle } = useLanguage();
  const [transactions, setTransactions] = useState<TrustTransaction[]>(INITIAL_TRUST_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // New movement form
  const [newClient, setNewClient] = useState(clients[0]?.name || '');
  const [newCase, setNewCase] = useState(cases[0]?.code || '');
  const [newType, setNewType] = useState<TrustTransaction['type']>('deposit');
  const [newAmount, setNewAmount] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newBank, setNewBank] = useState('ES91 0049 1500 0512 3456 7890 (Santander Escrow)');

  const totalInTrust = transactions.reduce((acc, t) => {
    if (t.type === 'deposit') return acc + t.amount;
    if (t.type === 'court_bond' || t.type === 'disbursement' || t.type === 'fee_transfer') return acc - t.amount;
    return acc;
  }, 350000);

  const totalBondsInCourt = transactions
    .filter(t => t.type === 'court_bond')
    .reduce((acc, t) => acc + t.amount, 0);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.caseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.voucherId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || isNaN(Number(newAmount))) return;

    const newTx: TrustTransaction = {
      id: `tr-${Date.now()}`,
      clientName: newClient,
      caseCode: newCase,
      type: newType,
      amount: Number(newAmount),
      date: new Date().toISOString().split('T')[0],
      description: newDesc || (language === 'es' ? 'Movimiento en cuenta de provisión de fondos' : 'Trust account disbursement transaction'),
      bankAccount: newBank,
      authorizedBy: 'Elena de la Vega',
      status: 'Audited',
      voucherId: `VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setTransactions([newTx, ...transactions]);
    setShowModal(false);
    setNewAmount('');
    setNewDesc('');
  };

  const getBadgeType = (type: TrustTransaction['type']) => {
    switch (type) {
      case 'deposit':
        return {
          label: language === 'es' ? 'Ingreso Provisión' : 'Trust Deposit',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: ArrowDownLeft
        };
      case 'disbursement':
        return {
          label: language === 'es' ? 'Suplido / Gasto' : 'Disbursement',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: ArrowUpRight
        };
      case 'court_bond':
        return {
          label: language === 'es' ? 'Fianza Judicial' : 'Court Bond',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Lock
        };
      case 'fee_transfer':
        return {
          label: language === 'es' ? 'Traspaso a Honorarios' : 'Fee Transfer',
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: ArrowUpRight
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {language === 'es' ? 'Fondos en Custodia (Escrow)' : 'Total Funds in Trust (Escrow)'}
            </span>
            <div className="p-2 rounded bg-slate-100 text-slate-800">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold mono text-slate-900">
            € {totalInTrust.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            {language === 'es' ? '100% Segregado en Cuentas Fiduciarias' : '100% Segregated in Trust Accounts'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {language === 'es' ? 'Fianzas Procesales Depositadas' : 'Court Bonds Consigned'}
            </span>
            <div className="p-2 rounded bg-amber-50 text-amber-700">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold mono text-amber-800">
            € {totalBondsInCourt.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {language === 'es' ? 'Depósitos en Juzgados y Tribunales' : 'Consignments in Judicial Venues'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {language === 'es' ? 'Cuentas Fiduciarias Activas' : 'Active Trust Accounts'}
            </span>
            <div className="p-2 rounded bg-slate-100 text-slate-800">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold mono text-slate-900">
            2 {language === 'es' ? 'Entidades' : 'Banks'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate">
            Santander Corporate • BBVA Depósitos
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {language === 'es' ? 'Auditoría Deontológica' : 'Bar Compliance Audit'}
            </span>
            <div className="p-2 rounded bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-sm font-bold text-emerald-800 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4" />
            <span>{language === 'es' ? 'Libro Mayor Certificado' : 'Certified Trust Ledger'}</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {language === 'es' ? 'Art. 20 Código Deontológico ICAM' : 'Full Compliance with Bar Standards'}
          </div>
        </div>
      </div>

      {/* Trust Bank Accounts Details Banner */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h3 className="serif text-sm font-semibold text-slate-900">
              {language === 'es' ? 'Régimen Especial de Provisión de Fondos y Depósitos de Clientes' : 'Client Retainers & Escrow Custody Framework'}
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            {language === 'es' 
              ? 'Los fondos pertenecientes a clientes se encuentran depositados de forma estrictamente segregada respecto al patrimonio de la firma, con conciliación bancaria diaria automática.'
              : 'Client retainers and escrow balances are maintained strictly separate from firm operating capital, with daily automated ledger reconciliation.'}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'es' ? 'Registrar Movimiento' : 'New Trust Movement'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'es' ? "Buscar por cliente, expediente o comprobante..." : "Search by client, case or voucher..."}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-700 focus:border-slate-400 focus:outline-none cursor-pointer"
          >
            <option value="all">{language === 'es' ? 'Todos los Movimientos' : 'All Movement Types'}</option>
            <option value="deposit">{language === 'es' ? 'Ingresos de Provisión' : 'Trust Deposits'}</option>
            <option value="court_bond">{language === 'es' ? 'Fianzas Procesales' : 'Court Bonds'}</option>
            <option value="disbursement">{language === 'es' ? 'Suplidos / Notarías' : 'Disbursements'}</option>
            <option value="fee_transfer">{language === 'es' ? 'Traspaso a Honorarios' : 'Fee Transfers'}</option>
          </select>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="rounded-lg bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">{language === 'es' ? 'Fecha / Comprobante' : 'Date / Voucher'}</th>
                <th className="px-4 py-3.5">{language === 'es' ? 'Cliente & Expediente' : 'Client & Case'}</th>
                <th className="px-4 py-3.5">{language === 'es' ? 'Tipo de Operación' : 'Operation Type'}</th>
                <th className="px-4 py-3.5">{language === 'es' ? 'Concepto Jurídico' : 'Legal Purpose'}</th>
                <th className="px-4 py-3.5">{language === 'es' ? 'Cuenta Bancaria' : 'Escrow Bank'}</th>
                <th className="px-4 py-3.5 text-right">{language === 'es' ? 'Importe (€)' : 'Amount (€)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const badge = getBadgeType(tx.type);
                const isCredit = tx.type === 'deposit';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 mono">{tx.date}</div>
                      <div className="text-[10px] text-slate-500 mono">{tx.voucherId}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{tx.clientName}</div>
                      <div className="mono text-[10px] text-slate-500">{tx.caseCode}</div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}>
                        <badge.icon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="text-slate-800 line-clamp-1">
                        {language === 'en' && tx.descriptionEn ? tx.descriptionEn : tx.description}
                      </div>
                      <div className="text-[10px] text-slate-500">{language === 'es' ? 'Autorizado por' : 'Authorized by'} {tx.authorizedBy}</div>
                    </td>

                    <td className="px-4 py-3.5 mono text-[11px] text-slate-600 whitespace-nowrap">
                      {tx.bankAccount.split(' ')[0]} {tx.bankAccount.split(' ')[1]}...
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span className={`mono font-bold text-sm ${isCredit ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {isCredit ? '+' : '-'} € {tx.amount.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Movement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-lg p-6 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-slate-900" />
                <h3 className="serif text-base font-semibold text-slate-900">
                  {language === 'es' ? 'Registrar Movimiento en Cuenta de Provisión' : 'Log Movement in Client Trust Account'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-mono p-1 cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMovement} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Cliente Principal' : 'Client Entity'}</label>
                <select
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Expediente' : 'Matter'}</label>
                  <select
                    value={newCase}
                    onChange={(e) => setNewCase(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {cases.map(c => (
                      <option key={c.id} value={c.code}>[{c.code}] {localizeCaseTitle(c.code, c.title).substring(0, 24)}...</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Tipo de Operación' : 'Operation Type'}</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TrustTransaction['type'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="deposit">{language === 'es' ? 'Ingreso de Provisión' : 'Trust Deposit'}</option>
                    <option value="court_bond">{language === 'es' ? 'Fianza Judicial (Juzgado)' : 'Court Bond Consignment'}</option>
                    <option value="disbursement">{language === 'es' ? 'Pago Suplido / Notaría' : 'Disbursement'}</option>
                    <option value="fee_transfer">{language === 'es' ? 'Traspaso a Honorarios' : 'Fee Transfer'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Importe (€)' : 'Amount (€)'}</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Ej. 25000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Concepto Jurídico Detallado' : 'Legal Purpose Description'}</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={language === 'es' ? "Ej. Provisión para peritaje de valoración de daño emergente..." : "E.g. Retainer for financial forensic valuation..."}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{language === 'es' ? 'Cuenta Fiduciaria Destino' : 'Trust Escrow Account'}</label>
                <select
                  value={newBank}
                  onChange={(e) => setNewBank(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:outline-none cursor-pointer font-mono"
                >
                  <option value="ES91 0049 1500 0512 3456 7890 (Santander Escrow)">ES91 0049 (Banco Santander Fiduciaria)</option>
                  <option value="ES21 0182 2300 1198 7654 3210 (BBVA Depósitos)">ES21 0182 (BBVA Depósitos Judiciales)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs cursor-pointer"
                >
                  {language === 'es' ? 'Registrar y Auditar' : 'Record & Audit Movement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
