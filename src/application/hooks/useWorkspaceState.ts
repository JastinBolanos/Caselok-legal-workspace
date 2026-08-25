import { useState, useEffect, useCallback } from 'react';
import { 
  FirmProfile, 
  LegalCase, 
  TimeEntry, 
  LegalDocument, 
  CorporateClient, 
  JudicialEvent, 
  ConflictCheckRecord, 
  CaseStageId 
} from '../../domain/models';
import {
  FirmRepository,
  CaseRepository,
  TimeBillingRepository,
  DocumentRepository,
  ClientRepository,
  AgendaRepository,
  ConflictRepository,
} from '../../infrastructure/repositories';
import { generateSha256Checksum, formatAuditTimestamp } from '../../domain/services';
import { AppNavView } from '../../components/Navbar';

export function useWorkspaceState() {
  // Persistence state initialized via Repositories
  const [currentFirm, setCurrentFirm] = useState<FirmProfile>(() => FirmRepository.getActiveFirm());
  const [activeView, setActiveView] = useState<AppNavView | 'welcome'>('welcome');
  const [cases, setCases] = useState<LegalCase[]>(() => CaseRepository.getAll());
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => TimeBillingRepository.getAll());
  const [documents, setDocuments] = useState<LegalDocument[]>(() => DocumentRepository.getAll());
  const [clients, setClients] = useState<CorporateClient[]>(() => ClientRepository.getAll());
  const [judicialEvents, setJudicialEvents] = useState<JudicialEvent[]>(() => AgendaRepository.getAll());
  const [conflictRecords, setConflictRecords] = useState<ConflictCheckRecord[]>(() => ConflictRepository.getAll());

  // Interactive UI selection state
  const [selectedCaseIdForTimer, setSelectedCaseIdForTimer] = useState<string>(cases[0]?.id || 'case-1');
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<LegalCase | null>(null);
  const [selectedClientForDetail, setSelectedClientForDetail] = useState<CorporateClient | null>(null);
  const [showCopilotModal, setShowCopilotModal] = useState<boolean>(false);
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);
  const [conflictSearchQuery, setConflictSearchQuery] = useState<string>('');

  // Sync state to Infrastructure Storage Repositories
  useEffect(() => {
    FirmRepository.saveActiveFirm(currentFirm);
  }, [currentFirm]);

  useEffect(() => {
    CaseRepository.saveAll(cases);
  }, [cases]);

  useEffect(() => {
    TimeBillingRepository.saveAll(timeEntries);
  }, [timeEntries]);

  useEffect(() => {
    DocumentRepository.saveAll(documents);
  }, [documents]);

  useEffect(() => {
    ClientRepository.saveAll(clients);
  }, [clients]);

  useEffect(() => {
    AgendaRepository.saveAll(judicialEvents);
  }, [judicialEvents]);

  useEffect(() => {
    ConflictRepository.saveAll(conflictRecords);
  }, [conflictRecords]);

  // Business Action Handlers
  const handleSelectFirm = useCallback((firm: FirmProfile) => {
    setCurrentFirm(firm);
  }, []);

  const handleUpdateFirm = useCallback((updated: Partial<FirmProfile>) => {
    setCurrentFirm(prev => ({ ...prev, ...updated }));
  }, []);

  const handleUpdateCaseStage = useCallback((caseId: string, newStageId: CaseStageId) => {
    setCases(prev => prev.map(c => (c.id === caseId ? { ...c, stageId: newStageId } : c)));

    setSelectedCaseDetail(prev => (prev && prev.id === caseId ? { ...prev, stageId: newStageId } : prev));
  }, []);

  const handleCreateNewCase = useCallback((newCaseData: Omit<LegalCase, 'id' | 'loggedHours'>) => {
    const newCase: LegalCase = {
      ...newCaseData,
      id: `case-${Date.now()}`,
      loggedHours: 0,
    };
    setCases(prev => [newCase, ...prev]);
    setSelectedCaseIdForTimer(newCase.id);
  }, []);

  const handleSaveTimeEntry = useCallback((entryData: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entryData,
      id: `time-${Date.now()}`,
    };
    setTimeEntries(prev => [newEntry, ...prev]);

    // Update logged hours in the target case
    const hoursAdded = newEntry.durationSeconds / 3600;
    setCases(prev => prev.map(c => {
      if (c.id === newEntry.caseId) {
        return {
          ...c,
          loggedHours: Number((c.loggedHours + hoursAdded).toFixed(2)),
        };
      }
      return c;
    }));
  }, []);

  const handleToggleInvoiced = useCallback((entryId: string) => {
    setTimeEntries(prev => prev.map(e => (e.id === entryId ? { ...e, invoiced: !e.invoiced } : e)));
  }, []);

  const handleUploadDocument = useCallback((docData: Omit<LegalDocument, 'id' | 'uploadedAt' | 'sha256'>) => {
    const newDoc: LegalDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: formatAuditTimestamp(),
      sha256: generateSha256Checksum(),
    };
    setDocuments(prev => [newDoc, ...prev]);
  }, []);

  const handleDeleteDocument = useCallback((docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  }, []);

  const handleAddCorporateClient = useCallback((clientData: Omit<CorporateClient, 'id' | 'totalBilledYTD' | 'openMattersCount'>) => {
    const newClient: CorporateClient = {
      ...clientData,
      id: `cli-${Date.now()}`,
      totalBilledYTD: 0,
      openMattersCount: 0,
    };
    setClients(prev => [newClient, ...prev]);
  }, []);

  const handleAddJudicialEvent = useCallback((eventData: Omit<JudicialEvent, 'id' | 'status'>) => {
    const newEvent: JudicialEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
      status: 'Pendiente',
    };
    setJudicialEvents(prev => [...prev, newEvent]);
  }, []);

  const handleToggleEventComplete = useCallback((eventId: string) => {
    setJudicialEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          status: ev.status === 'Completado' ? 'Pendiente' : 'Completado',
        };
      }
      return ev;
    }));
  }, []);

  const handleToggleMilestone = useCallback((caseId: string, milestoneIndex: number) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedMilestones = [...c.keyMilestones];
        if (updatedMilestones[milestoneIndex]) {
          updatedMilestones[milestoneIndex] = {
            ...updatedMilestones[milestoneIndex],
            completed: !updatedMilestones[milestoneIndex].completed,
          };
        }
        return { ...c, keyMilestones: updatedMilestones };
      }
      return c;
    }));

    setSelectedCaseDetail(prev => {
      if (!prev || prev.id !== caseId) return prev;
      const updated = [...prev.keyMilestones];
      if (updated[milestoneIndex]) {
        updated[milestoneIndex] = {
          ...updated[milestoneIndex],
          completed: !updated[milestoneIndex].completed,
        };
      }
      return { ...prev, keyMilestones: updated };
    });
  }, []);

  const handleStartTimekeeperForCase = useCallback((caseId: string) => {
    setSelectedCaseIdForTimer(caseId);
    setSelectedCaseDetail(null);
  }, []);

  const handleAddConflictRecord = useCallback((record: ConflictCheckRecord) => {
    setConflictRecords(prev => [record, ...prev]);
  }, []);

  const handleOpenConflictForEntity = useCallback((entityName: string) => {
    setConflictSearchQuery(entityName);
    setShowConflictModal(true);
  }, []);

  return {
    // State
    currentFirm,
    activeView,
    cases,
    timeEntries,
    documents,
    clients,
    judicialEvents,
    conflictRecords,
    selectedCaseIdForTimer,
    selectedCaseDetail,
    selectedClientForDetail,
    showCopilotModal,
    showConflictModal,
    conflictSearchQuery,

    // Setters
    setActiveView,
    setSelectedCaseIdForTimer,
    setSelectedCaseDetail,
    setSelectedClientForDetail,
    setShowCopilotModal,
    setShowConflictModal,
    setConflictSearchQuery,

    // Action Handlers
    handleSelectFirm,
    handleUpdateFirm,
    handleUpdateCaseStage,
    handleCreateNewCase,
    handleSaveTimeEntry,
    handleToggleInvoiced,
    handleUploadDocument,
    handleDeleteDocument,
    handleAddCorporateClient,
    handleAddJudicialEvent,
    handleToggleEventComplete,
    handleToggleMilestone,
    handleStartTimekeeperForCase,
    handleAddConflictRecord,
    handleOpenConflictForEntity,
  };
}
