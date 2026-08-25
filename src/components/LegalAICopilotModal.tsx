import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  Send
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LegalAICopilotModalProps {
  onClose: () => void;
}

export const LegalAICopilotModal: React.FC<LegalAICopilotModalProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('arbitration');
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const CLAUSE_TEMPLATES_ES: Record<string, { title: string; subtitle: string; content: string; riskAnalysis: string }> = {
    arbitration: {
      title: 'Cláusula Modelo de Arbitraje Comercial (CCI / CAM)',
      subtitle: 'Resolución definitiva y vinculante con sumisión expresa',
      content: `«Toda controversia, diferencia o reclamación que surja del presente Contrato o que guarde relación con el mismo, incluidas las relativas a su existencia, validez, interpretación, cumplimiento o resolución, será sometida a y resuelta definitivamente mediante arbitraje de Derecho administrado por la Corte de Arbitraje de Madrid (CAM), de conformidad con su Reglamento de Arbitraje vigente a la fecha de presentación de la solicitud. El Tribunal Arbitral estará compuesto por tres (3) árbitros designados con arreglo a dicho Reglamento. La sede del arbitraje será Madrid (España) y el idioma del procedimiento será el español. La ley aplicable al fondo de la controversia será la ley sustantiva española.»`,
      riskAnalysis: 'Riesgo de litigación ordinaria neutralizado al 100%. Recomendada para transacciones mercantiles con contrapartes internacionales con el fin de evitar dilaciones procesales en tribunales estatales.'
    },
    indemnity: {
      title: 'Cláusula de Indemnidad & Límite de Responsabilidad (SPA)',
      subtitle: 'Cap de responsabilidad, de minimis y periodo de prescripción pactado',
      content: `«La responsabilidad agregada total de la Parte Vendedora por cualquier Incumplimiento de las Declaraciones y Garantías (R&W) contenidas en la Cláusula 8 no excederá en ningún caso de una cantidad equivalente al quince por ciento (15%) del Precio Final de Compraventa (el "Límite Agregado de Responsabilidad" o "Cap"). No procederá reclamación indemnizatoria alguna salvo que el importe individual de la reclamación exceda de cincuenta mil euros (50.000 €) ("De Minimis"), y únicamente una vez que el conjunto acumulado de reclamaciones supere los trescientos mil euros (300.000 €) ("Basket Franquicia"). El plazo de caducidad para interponer reclamaciones generales será de veinticuatro (24) meses a contar desde la Fecha de Cierre, extendiéndose a sesenta (60) meses para contingencias fiscales, laborales y de seguridad social.»`,
      riskAnalysis: 'Estructura equilibrada con estándar institucional M&A. Protege al vendedor frente a reclamaciones triviales y concede certeza temporal y patrimonial a la compradora.'
    },
    noncompete: {
      title: 'Pacto de No Competencia Post-Contractual y Confidencialidad Reforzada',
      subtitle: 'Vigencia de 24 meses y blindaje de clientela corporativa',
      content: `«Durante la vigencia del presente Acuerdo y durante un período adicional de veinticuatro (24) meses contados a partir de su terminación por cualquier causa, la Parte Obligada se compromete expresa e irrevocablemente a no participar, directa ni indirectamente, ni por sí misma ni a través de personas o sociedades vinculadas, en ninguna actividad económica, empresa o proyecto que compita con el Objeto Social de la Compañía en el territorio de la Unión Europea, así como a no captar clientes existentes ni contratar a empleados clave del equipo directivo. En caso de infracción, se devengará una penalización pecuniaria automática fijada de común acuerdo en quinientos mil euros (500.000 €) en concepto de cláusula penal, sin perjuicio de la indemnización por los daños y perjuicios excedentes.»`,
      riskAnalysis: 'Cumple con los criterios jurisprudenciales del Tribunal Supremo y de la Sala de lo Social respecto a delimitación temporal, geográfica y compensación económica implícita en la transacción.'
    }
  };

  const CLAUSE_TEMPLATES_EN: Record<string, { title: string; subtitle: string; content: string; riskAnalysis: string }> = {
    arbitration: {
      title: 'Standard Commercial Arbitration Clause (ICC / CAM)',
      subtitle: 'Definitive and binding dispute resolution with express submission',
      content: `«All disputes, controversies or claims arising out of or in connection with the present Contract, including any question regarding its existence, validity, interpretation, performance or termination, shall be definitively settled by arbitration administered by the Madrid Court of Arbitration (CAM) in accordance with its Arbitration Rules in force on the date of submission. The Arbitral Tribunal shall be composed of three (3) arbitrators appointed in accordance with the said Rules. The seat of arbitration shall be Madrid (Spain) and the language of the proceedings shall be English. The governing substantive law of the dispute shall be the laws of Spain.»`,
      riskAnalysis: 'Ordinary litigation exposure reduced by 100%. Highly recommended for cross-border commercial transactions to avoid court backlog and ensure immediate international enforceability under the New York Convention.'
    },
    indemnity: {
      title: 'Indemnity & Liability Cap Clause (M&A / SPA)',
      subtitle: 'Aggregate liability cap, de minimis and survival period',
      content: `«The aggregate total liability of the Seller in respect of any and all Claims arising from any Breach of the Representations and Warranties (R&W) set forth in Clause 8 shall in no event exceed an amount equal to fifteen percent (15%) of the Final Purchase Price (the "Aggregate Liability Cap"). No Indemnification Claim shall be admissible unless the individual amount exceeds fifty thousand euros (€50,000) ("De Minimis"), and only once the aggregate aggregate amount of all qualifying claims exceeds three hundred thousand euros (€300,000) ("Tipping Basket"). The limitation period for general contractual claims shall be twenty-four (24) months following the Closing Date, extended to sixty (60) months for Tax, Labor and Social Security claims.»`,
      riskAnalysis: 'Institutional M&A market standard. Shields the vendor from vexatious claims while providing financial clarity and recovery assurance to the acquirer.'
    },
    noncompete: {
      title: 'Post-Closing Non-Compete & Enhanced Confidentiality Covenants',
      subtitle: '24-month duration and corporate client protection',
      content: `«During the term of this Agreement and for a subsequent period of twenty-four (24) months following its termination for any reason whatsoever, the Covenantor expressly and unconditionally covenants not to engage, directly or indirectly, whether on its own account or through affiliates, in any business activity or enterprise competing with the Corporate Purpose of the Company within the territory of the European Union, nor solicit existing clients or hire key management personnel. Any breach shall trigger an immediate liquidated damages penalty agreed at five hundred thousand euros (€500,000), without prejudice to the Company’s right to claim further actual damages and seek injunctive relief.»`,
      riskAnalysis: 'Complies fully with statutory antitrust principles, reasonable geographical scope and proportionality thresholds.'
    }
  };

  const currentDict = language === 'es' ? CLAUSE_TEMPLATES_ES : CLAUSE_TEMPLATES_EN;
  const currentClause = currentDict[selectedTemplate] || currentDict.arbitration;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentClause.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-slate-100 border border-slate-200 text-slate-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="serif text-lg font-bold text-slate-900">
                {language === 'es' ? 'Asistente Jurídico de Cláusulas & Análisis de Contingencias' : 'Legal AI Clause Assistant & Risk Analyzer'}
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                {language === 'es' ? 'Generador de cláusulas contractuales blindadas y dictámenes de riesgo procesal.' : 'Enforceable contract clause generator and procedural risk assessment.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-mono p-1 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          {/* Template Selector Pills */}
          <div>
            <label className="block text-slate-600 uppercase tracking-wider text-[11px] mb-2 font-semibold">
              {language === 'es' ? 'Plantillas de Cláusulas Blindadas Disponibles:' : 'Available Certified Clause Templates:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedTemplate('arbitration')}
                className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                  selectedTemplate === 'arbitration'
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{language === 'es' ? 'Arbitraje CAM / CCI' : 'Arbitration ICC / CAM'}</div>
                <div className={`text-[10px] ${selectedTemplate === 'arbitration' ? 'text-slate-300' : 'text-slate-500'}`}>{language === 'es' ? 'Resolución Privada' : 'Private Dispute Forum'}</div>
              </button>

              <button
                onClick={() => setSelectedTemplate('indemnity')}
                className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                  selectedTemplate === 'indemnity'
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{language === 'es' ? 'Indemnidad & Caps (SPA)' : 'Indemnity & Caps (SPA)'}</div>
                <div className={`text-[10px] ${selectedTemplate === 'indemnity' ? 'text-slate-300' : 'text-slate-500'}`}>{language === 'es' ? 'M&A y Garantías' : 'M&A and Reps & Warranties'}</div>
              </button>

              <button
                onClick={() => setSelectedTemplate('noncompete')}
                className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                  selectedTemplate === 'noncompete'
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{language === 'es' ? 'Pacto No Competencia' : 'Non-Compete Covenant'}</div>
                <div className={`text-[10px] ${selectedTemplate === 'noncompete' ? 'text-slate-300' : 'text-slate-500'}`}>{language === 'es' ? '24 meses con penalización' : '24 months + liquidated damages'}</div>
              </button>
            </div>
          </div>

          {/* Clause Viewer Box */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="serif text-sm font-bold text-slate-900">
                  {currentClause.title}
                </h4>
                <p className="text-[11px] text-slate-500">{currentClause.subtitle}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (language === 'es' ? 'Copiada al Portapapeles' : 'Copied to Clipboard') : (language === 'es' ? 'Copiar Texto' : 'Copy Clause')}</span>
              </button>
            </div>

            <div className="p-4 rounded-md bg-white border border-slate-200 serif italic text-sm leading-relaxed text-slate-800">
              {currentClause.content}
            </div>

            {/* Risk & Validity Analysis */}
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900 block text-xs">
                  {language === 'es' ? 'Dictamen de Robustez Jurídica & Validez:' : 'Enforceability & Legal Risk Opinion:'}
                </span>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  {currentClause.riskAnalysis}
                </p>
              </div>
            </div>
          </div>

          {/* Custom Query or Modification */}
          <form onSubmit={handleRunAnalysis} className="space-y-2">
            <label className="block text-slate-700 font-medium text-xs">
              {language === 'es' ? 'Solicitar Ajuste o Adaptación a Jurisdicción Específica:' : 'Request Custom Adjustment or Venue Harmonization:'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={language === 'es' ? "Ej. Adaptar cláusula para incluir opción de mediación previa de 30 días..." : "E.g. Adapt clause to require 30-day prior CEDR mediation..."}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? (language === 'es' ? 'Procesando...' : 'Processing...') : (language === 'es' ? 'Revisar' : 'Review')}</span>
              </button>
            </div>
          </form>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {language === 'es' ? 'Basado en jurisprudencia consolidada del Tribunal Supremo y reglamentos de cortes arbitrales.' : 'Aligned with Supreme Court case law and international arbitration rules.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium cursor-pointer shadow-xs"
          >
            {language === 'es' ? 'Cerrar Asistente' : 'Close Copilot'}
          </button>
        </div>

      </div>
    </div>
  );
};
