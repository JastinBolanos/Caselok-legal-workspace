import React from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Navbar } from './components/Navbar';
import { LiveTimerBar } from './components/LiveTimerBar';
import { KanbanBoard } from './components/KanbanBoard';
import { DocumentVault } from './components/DocumentVault';
import { TimeBillingView } from './components/TimeBillingView';
import { ClientsView } from './components/ClientsView';
import { AgendaView } from './components/AgendaView';
import { AnalyticsView } from './components/AnalyticsView';
import { TrustAccountView } from './components/TrustAccountView';
import { FirmSettingsView } from './components/FirmSettingsView';
import { CaseDetailModal } from './components/CaseDetailModal';
import { ClientDetailModal } from './components/ClientDetailModal';
import { ConflictCheckModal } from './components/ConflictCheckModal';
import { LegalAICopilotModal } from './components/LegalAICopilotModal';
import { useWorkspaceState } from './application/hooks/useWorkspaceState';

export default function App() {
  const {
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
    setActiveView,
    setSelectedCaseIdForTimer,
    setSelectedCaseDetail,
    setSelectedClientForDetail,
    setShowCopilotModal,
    setShowConflictModal,
    setConflictSearchQuery,
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
  } = useWorkspaceState();

  // Welcome Screen Presentation
  if (activeView === 'welcome') {
    return (
      <WelcomeScreen
        currentFirm={currentFirm}
        onSelectFirm={handleSelectFirm}
        onEnterWorkspace={() => setActiveView('kanban')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Main Navigation */}
      <Navbar
        currentFirm={currentFirm}
        onSelectFirm={handleSelectFirm}
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        onOpenWelcome={() => setActiveView('welcome')}
        onOpenCopilot={() => setShowCopilotModal(true)}
        onOpenConflictModal={() => {
          setConflictSearchQuery('');
          setShowConflictModal(true);
        }}
      />

      {/* Floating Integrated Live Billable Hours Stopwatch Widget */}
      <LiveTimerBar
        cases={cases}
        selectedCaseId={selectedCaseIdForTimer}
        onSelectCaseId={setSelectedCaseIdForTimer}
        onSaveTimeEntry={handleSaveTimeEntry}
        defaultHourlyRate={currentFirm.defaultHourlyRate}
      />

      {/* Main Workspace View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeView === 'kanban' && (
          <KanbanBoard
            cases={cases}
            onSelectCase={(caseItem) => setSelectedCaseDetail(caseItem)}
            onUpdateCaseStage={handleUpdateCaseStage}
            onCreateNewCase={handleCreateNewCase}
          />
        )}

        {activeView === 'agenda' && (
          <AgendaView
            events={judicialEvents}
            cases={cases}
            firm={currentFirm}
            onAddEvent={handleAddJudicialEvent}
            onToggleEventComplete={handleToggleEventComplete}
            onSelectCase={(c) => setSelectedCaseDetail(c)}
          />
        )}

        {activeView === 'clients' && (
          <ClientsView
            clients={clients}
            cases={cases}
            firm={currentFirm}
            onAddClient={handleAddCorporateClient}
            onSelectClientForDetail={(cl) => setSelectedClientForDetail(cl)}
            onOpenConflictModalForClient={handleOpenConflictForEntity}
          />
        )}

        {activeView === 'vault' && (
          <DocumentVault
            documents={documents}
            cases={cases}
            onUploadDocument={handleUploadDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {activeView === 'billing' && (
          <TimeBillingView
            timeEntries={timeEntries}
            cases={cases}
            firm={currentFirm}
            onAddManualTimeEntry={handleSaveTimeEntry}
            onToggleInvoiced={handleToggleInvoiced}
          />
        )}

        {activeView === 'trust' && (
          <TrustAccountView
            clients={clients}
            cases={cases}
          />
        )}

        {activeView === 'analytics' && (
          <AnalyticsView
            cases={cases}
            timeEntries={timeEntries}
            clients={clients}
            firm={currentFirm}
          />
        )}

        {activeView === 'settings' && (
          <FirmSettingsView
            currentFirm={currentFirm}
            onUpdateFirm={handleUpdateFirm}
          />
        )}
      </main>

      {/* Deep-Dive Case Detail Modal */}
      {selectedCaseDetail && (
        <CaseDetailModal
          caseItem={selectedCaseDetail}
          timeEntries={timeEntries}
          documents={documents}
          onClose={() => setSelectedCaseDetail(null)}
          onUpdateStage={(stageId) => handleUpdateCaseStage(selectedCaseDetail.id, stageId)}
          onToggleMilestone={handleToggleMilestone}
          onStartTimekeeperForCase={handleStartTimekeeperForCase}
        />
      )}

      {/* Deep-Dive Client Detail Modal */}
      {selectedClientForDetail && (
        <ClientDetailModal
          client={selectedClientForDetail}
          cases={cases}
          timeEntries={timeEntries}
          onClose={() => setSelectedClientForDetail(null)}
          onSelectCase={(c) => {
            setSelectedClientForDetail(null);
            setSelectedCaseDetail(c);
          }}
          onOpenConflictModal={handleOpenConflictForEntity}
        />
      )}

      {/* Conflict of Interest Check Modal */}
      {showConflictModal && (
        <ConflictCheckModal
          initialSearchQuery={conflictSearchQuery}
          cases={cases}
          clients={clients}
          firm={currentFirm}
          conflictRecords={conflictRecords}
          onAddConflictRecord={handleAddConflictRecord}
          onClose={() => setShowConflictModal(false)}
        />
      )}

      {/* Legal AI Copilot Modal */}
      {showCopilotModal && (
        <LegalAICopilotModal
          onClose={() => setShowCopilotModal(false)}
        />
      )}
    </div>
  );
}
