import React, { useState } from 'react';
import { 
  FolderLock, 
  Upload, 
  FileText, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle, 
  Eye, 
  Download, 
  Trash2, 
  FileCheck2, 
  Hash, 
  Sparkles
} from 'lucide-react';
import { LegalDocument, LegalCase, ConfidentialityLevel } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface DocumentVaultProps {
  documents: LegalDocument[];
  cases: LegalCase[];
  onUploadDocument: (doc: Omit<LegalDocument, 'id' | 'uploadedAt' | 'sha256'>) => void;
  onDeleteDocument: (docId: string) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  cases,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const { language, t, localizeDocCategory, localizeConfidentiality, localizeCaseTitle } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedConfidentiality, setSelectedConfidentiality] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<LegalDocument | null>(null);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCaseId, setUploadCaseId] = useState(cases[0]?.id || '');
  const [uploadCategory, setUploadCategory] = useState<LegalDocument['category']>('Contrato / SPA');
  const [uploadConfidentiality, setUploadConfidentiality] = useState<ConfidentialityLevel>('Estrictamente Confidencial (Socios)');
  const [uploadVersion, setUploadVersion] = useState('v1.0');
  const [uploadSummary, setUploadSummary] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Filtered Docs
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCase = selectedCaseFilter === 'all' || doc.caseId === selectedCaseFilter;
    const matchesCat = selectedCategoryFilter === 'all' || doc.category === selectedCategoryFilter;
    const matchesConf = selectedConfidentiality === 'all' || doc.confidentiality === selectedConfidentiality;

    return matchesSearch && matchesCase && matchesCat && matchesConf;
  });

  const handleSimulatedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadFileName(file.name);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      setShowUploadModal(true);
    }
  };

  const handleSimulatedFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFileName(file.name);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      setShowUploadModal(true);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCase = cases.find(c => c.id === uploadCaseId) || cases[0];
    
    onUploadDocument({
      caseId: targetCase.id,
      caseCode: targetCase.code,
      caseTitle: targetCase.title,
      title: uploadTitle || uploadFileName,
      fileName: uploadFileName || `${uploadTitle.replace(/\s+/g, '_')}.pdf`,
      category: uploadCategory,
      version: uploadVersion,
      fileSize: `${(Math.random() * 8 + 1.2).toFixed(1)} MB`,
      fileType: uploadFileName.endsWith('.docx') ? 'docx' : 'signed_pdf',
      uploadedBy: 'Elena de la Vega (Socia)',
      confidentiality: uploadConfidentiality,
      tags: [uploadCategory.split(' ')[0], targetCase.jurisdiction.split(' ')[0]],
      summary: uploadSummary || (language === 'es' ? 'Documento judicial cargado y verificado en la bóveda de custodia digital.' : 'Legal document uploaded and verified in digital custody vault.'),
      pagesCount: Math.floor(Math.random() * 40 + 6),
      isSigned: true,
    });

    setShowUploadModal(false);
    setUploadTitle('');
    setUploadFileName('');
    setUploadSummary('');
  };

  const getConfidentialityBadge = (conf: ConfidentialityLevel) => {
    switch (conf) {
      case 'Secreto Profesional (Nivel 1)':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Estrictamente Confidencial (Socios)':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confidencial Bufete':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Público / Registral':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Security Header Banner */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-md bg-slate-100 text-slate-800">
            <FolderLock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="serif text-base font-semibold text-slate-900">
              {t('vault.banner.title')}
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              {t('vault.banner.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* File Upload Trigger */}
          <label className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide shadow-xs active:scale-98 transition cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{t('vault.btn.upload')}</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleSimulatedFileInput}
              accept=".pdf,.docx,.xlsx"
            />
          </label>
        </div>
      </div>

      {/* Drag and Drop Zone Simulator */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleSimulatedDrop}
        className={`p-6 rounded-lg border-2 border-dashed transition-all duration-150 text-center flex flex-col items-center justify-center gap-1.5 ${
          isDragOver 
            ? 'border-slate-800 bg-slate-100 text-slate-900' 
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 text-slate-600'
        }`}
      >
        <Upload className="w-6 h-6 text-slate-500 mb-1" />
        <p className="serif text-sm font-semibold text-slate-800">
          {t('vault.dropzone.title')}
        </p>
        <p className="text-xs text-slate-500">
          {t('vault.dropzone.subtitle')}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('vault.search.placeholder')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Case Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label={t('vault.filter.case')}
              value={selectedCaseFilter}
              onChange={(e) => setSelectedCaseFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none max-w-[200px] truncate cursor-pointer"
            >
              <option value="all">{t('vault.filter.case')}</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>[{c.code}] {localizeCaseTitle(c.code, c.title)}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <select
              aria-label={t('vault.filter.category')}
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="all">{t('vault.filter.category')}</option>
              <option value="Contrato / SPA">{localizeDocCategory('Contrato / SPA')}</option>
              <option value="Escrito Procesal">{localizeDocCategory('Escrito Procesal')}</option>
              <option value="Dictamen Jurídico">{localizeDocCategory('Dictamen Jurídico')}</option>
              <option value="Prueba Documental">{localizeDocCategory('Prueba Documental')}</option>
              <option value="Poder Notarial">{localizeDocCategory('Poder Notarial')}</option>
            </select>
          </div>

          {/* Confidentiality Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <select
              aria-label={t('vault.filter.confidentiality')}
              value={selectedConfidentiality}
              onChange={(e) => setSelectedConfidentiality(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="all">{t('vault.filter.confidentiality')}</option>
              <option value="Secreto Profesional (Nivel 1)">{localizeConfidentiality('Secreto Profesional (Nivel 1)')}</option>
              <option value="Estrictamente Confidencial (Socios)">{localizeConfidentiality('Estrictamente Confidencial (Socios)')}</option>
              <option value="Confidencial Bufete">{localizeConfidentiality('Confidencial Bufete')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-lg bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">{t('vault.table.document')}</th>
                <th className="px-4 py-3.5">{t('vault.table.case')}</th>
                <th className="px-4 py-3.5">{t('vault.table.category')}</th>
                <th className="px-4 py-3.5">{t('vault.table.confidentiality')}</th>
                <th className="px-4 py-3.5">{t('vault.table.version')}</th>
                <th className="px-4 py-3.5">{t('vault.table.signature')}</th>
                <th className="px-4 py-3.5 text-right">{t('vault.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    {language === 'es' ? 'No se encontraron documentos en la bóveda con los filtros seleccionados.' : 'No documents found in vault matching selected filters.'}
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr 
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Document Title & File */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded bg-slate-100 text-slate-700 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1">
                            {doc.title}
                          </div>
                          <div className="mono text-[10px] text-slate-500 flex items-center gap-2">
                            <span>{doc.fileName}</span>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                            <span>•</span>
                            <span>{doc.pagesCount} {language === 'es' ? 'págs.' : 'pgs.'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Case */}
                    <td className="px-4 py-3.5">
                      <div className="mono text-[10px] text-slate-600 font-bold">
                        {doc.caseCode}
                      </div>
                      <div className="text-slate-700 text-[11px] truncate max-w-[180px]">
                        {localizeCaseTitle(doc.caseCode, doc.caseTitle)}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                        {localizeDocCategory(doc.category)}
                      </span>
                    </td>

                    {/* Confidentiality */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border text-[10px] ${getConfidentialityBadge(doc.confidentiality)}`}>
                        {localizeConfidentiality(doc.confidentiality)}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="px-4 py-3.5 mono text-slate-700 font-semibold whitespace-nowrap">
                      {doc.version}
                    </td>

                    {/* Signature */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {doc.isSigned ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t('vault.status.signed')}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {t('vault.status.draft')}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          title={language === 'es' ? "Inspeccionar documento y análisis de cláusulas" : "Inspect document and clause breakdown"}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => alert(language === 'es' ? `Descargando copia legal certificada de ${doc.fileName} con huella digital SHA-256.` : `Downloading certified legal copy of ${doc.fileName} with SHA-256 timestamp.`)}
                          title={language === 'es' ? "Descargar archivo verificado" : "Download verified file"}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(language === 'es' ? `¿Confirma eliminar ${doc.fileName} de la bóveda?` : `Confirm delete ${doc.fileName} from vault?`)) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          title={language === 'es' ? "Eliminar registro" : "Delete record"}
                          className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal Form */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-slate-800" />
                <h3 className="serif text-base font-semibold text-slate-900">
                  {t('vault.modal.title')}
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 font-mono p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('vault.modal.docTitle')}</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder={language === 'es' ? "Ej. Cláusula de Indemnidad SPA v3.2..." : "E.g. Indemnity Clause SPA v3.2..."}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('vault.modal.fileName')}</label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('vault.modal.version')}</label>
                  <input
                    type="text"
                    value={uploadVersion}
                    onChange={(e) => setUploadVersion(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 mono focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('vault.modal.case')}</label>
                <select
                  value={uploadCaseId}
                  onChange={(e) => setUploadCaseId(e.target.value)}
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
                  <label className="block text-slate-700 font-medium mb-1">{t('vault.modal.category')}</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as LegalDocument['category'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Contrato / SPA">{localizeDocCategory('Contrato / SPA')}</option>
                    <option value="Escrito Procesal">{localizeDocCategory('Escrito Procesal')}</option>
                    <option value="Dictamen Jurídico">{localizeDocCategory('Dictamen Jurídico')}</option>
                    <option value="Prueba Documental">{localizeDocCategory('Prueba Documental')}</option>
                    <option value="Poder Notarial">{localizeDocCategory('Poder Notarial')}</option>
                    <option value="NDA / Secreto">{localizeDocCategory('NDA / Secreto')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('vault.modal.confidentiality')}</label>
                  <select
                    value={uploadConfidentiality}
                    onChange={(e) => setUploadConfidentiality(e.target.value as ConfidentialityLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Secreto Profesional (Nivel 1)">{localizeConfidentiality('Secreto Profesional (Nivel 1)')}</option>
                    <option value="Estrictamente Confidencial (Socios)">{localizeConfidentiality('Estrictamente Confidencial (Socios)')}</option>
                    <option value="Confidencial Bufete">{localizeConfidentiality('Confidencial Bufete')}</option>
                    <option value="Público / Registral">{localizeConfidentiality('Público / Registral')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t('vault.modal.summary')}</label>
                <textarea
                  rows={2}
                  value={uploadSummary}
                  onChange={(e) => setUploadSummary(e.target.value)}
                  placeholder={language === 'es' ? "Síntesis jurídica del documento..." : "Legal synthesis of document contents..."}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  {t('action.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs cursor-pointer"
                >
                  {t('vault.modal.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Inspector & Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-lg p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-md bg-slate-100 text-slate-800">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="mono text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                      {previewDoc.caseCode}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${getConfidentialityBadge(previewDoc.confidentiality)}`}>
                      {localizeConfidentiality(previewDoc.confidentiality)}
                    </span>
                  </div>
                  <h3 className="serif text-base font-semibold text-slate-900 mt-1">
                    {previewDoc.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-700 font-mono p-1 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Digital Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-4">
              <div>
                <span className="text-slate-500 block">{language === 'es' ? 'Archivo:' : 'File:'}</span>
                <span className="text-slate-800 font-medium">{previewDoc.fileName} ({previewDoc.fileSize})</span>
              </div>
              <div>
                <span className="text-slate-500 block">{language === 'es' ? 'Fecha y Letrado:' : 'Date & Counsel:'}</span>
                <span className="text-slate-800">{previewDoc.uploadedAt} • {previewDoc.uploadedBy}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500 block flex items-center gap-1">
                  <Hash className="w-3 h-3 text-slate-600" />
                  <span>{language === 'es' ? 'Huella Criptográfica SHA-256 (Cadena de Custodia):' : 'SHA-256 Cryptographic Hash (Custody Chain):'}</span>
                </span>
                <span className="mono text-slate-700 break-all text-[11px]">
                  {previewDoc.sha256}
                </span>
              </div>
            </div>

            {/* Simulated Legal Document Content & AI Clause Breakdown */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 leading-relaxed text-sm text-slate-700">
                <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                  <span>{language === 'es' ? 'Síntesis y Cláusulas Clave Extraídas' : 'Extracted Key Clauses & Executive Synthesis'}</span>
                </div>
                <p className="mb-3 italic serif text-slate-800 text-base">
                  «{previewDoc.summary}»
                </p>

                <div className="pt-3 border-t border-slate-200 text-xs space-y-2 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{language === 'es' ? 'Jurisdicción y Ley Aplicable:' : 'Governing Law & Forum:'}</span>
                    <span className="font-medium text-slate-800">{language === 'es' ? 'Derecho Común Español / Corte de Arbitraje de Madrid' : 'Spanish Civil Code / Madrid Court of Arbitration'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{language === 'es' ? 'Límite de Responsabilidad (Liability Cap):' : 'Liability Cap:'}</span>
                    <span className="mono text-emerald-700 font-semibold">{language === 'es' ? '15% del Precio de Compraventa (€6.375.000)' : '15% of Aggregate Purchase Price (€6,375,000)'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{language === 'es' ? 'Periodo de Supervivencia de R&W:' : 'R&W Survival Period:'}</span>
                    <span className="text-slate-800 font-medium">{language === 'es' ? '24 meses (Generales) / 5 años (Fiscales y Ambientales)' : '24 months (General) / 5 years (Tax & Environmental)'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'es' ? 'Documento Criptográficamente Sellado' : 'Cryptographically Sealed Document'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(language === 'es' ? `Exportando copia certificada con sello de tiempo eIDAS.` : `Exporting certified copy with eIDAS timestamp.`)}
                  className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs transition cursor-pointer"
                >
                  {language === 'es' ? 'Descargar Copia Certificada' : 'Download Certified Copy'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
