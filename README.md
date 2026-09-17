<div align="center">
  <img alt="Caselok Banner" src="https://github.com/user-attachments/assets/fbfd5932-584f-431f-a95e-74470a884a52" width="40%" />

  <br>

  <h3>Enterprise LegalTech Workspace (v2.4.0-ENT)</h3>

  <p>
    <img src="https://img.shields.io/badge/Build-Passing-10B981?style=flat-square&logo=github-actions" alt="Build Status" />
    <img src="https://img.shields.io/badge/Deployment-Cloud%20Run%20Production-0EA5E9?style=flat-square&logo=google-cloud" alt="Deployment" />
    <img src="https://img.shields.io/badge/Architecture-Clean%20DDD%20%2F%20Hexagonal-8B5CF6?style=flat-square" alt="Compliance / Architecture" />
    <img src="https://img.shields.io/badge/Security-SHA--256%20Chain%20of%20Custody-0F172A?style=flat-square&logo=shield" alt="Security Audited" />
  </p>
</div>

<br>

> **Legal Practice Management & Case Workflow Interface.**  
> A client-side workspace designed for legal case tracking, workflow management, billable hour timers, conflict-of-interest review, and simulated cryptographic document integrity verification.

<br>

<div align="center">
  <h3>🌍 <b><a href="https://caselok.vercel.app">View Live Platform (Production) 🟢</a></b></h3>
  <br>
  <img alt="Caselok Preview" src="https://github.com/user-attachments/assets/b1b31fcc-fe69-4c86-b00a-d340f127d534" width="80%" />
</div>

## 🎥 LegalTech Environment Demonstration

**🎬 Control Panel & Case Orchestration**  
Workspace walkthrough: procedural case tracking via Kanban board, active billable time tracking, conflict-of-interest checking tool, and document management with SHA-256 hash calculations.

https://github.com/user-attachments/assets/265bf4ce-b1ee-480d-b1dc-273adf21cbd1

---

## 🏛️ System Architecture & Technology Stack

Caselok is organized around clean frontend architecture and domain modeling patterns with client-side state execution. Production database backends and external court synchronization systems are simulated locally within client repositories to provide an independent, fully interactive environment.

Below is the technology suite used across the client application:

### Core & Runtime
- **`react`** (`^19.0.1`): Component-based UI library powering interactive boards and detailed views.
- **`react-dom`** (`^19.0.1`): DOM rendering and hydration engine.
- **`typescript`** (`~5.8.2`): Strict static typing across domain models and application state.

### UI Engine, Styling & Motion
- **`@tailwindcss/vite`** (`^4.1.14`) & **`tailwindcss`** (`^4.1.14`): Utility-first styling framework with clean institutional design tokens.
- **`motion`** (`^12.23.24`): Smooth transitions for modals, side panels, and Kanban card movements.
- **`lucide-react`** (`^0.546.0`): Unified vector icon set for interface actions and navigation.
- **`autoprefixer`** (`^10.4.21`): CSS parsing and vendor prefix automation.

### Inference & Drafting Assistance
- **`@google/genai`** (`^2.4.0`): Integration with Gemini language models to provide drafting assistance, clause suggestions, and case summaries.

### Backend, Proxy & Tooling
- **`express`** (`^4.21.2`): Local proxy server managing routing and local development middleware.
- **`vite`** (`^6.2.3`): Development server and client asset bundler.
- **`@vitejs/plugin-react`** (`^5.0.4`): Fast refresh support for React in Vite.
- **`dotenv`** (`^17.2.3`): Environment variable loader.
- **`tsx`** (`^4.21.0`): TypeScript execution environment for running the proxy script.
- **`esbuild`** (`^0.25.0`): Bundler for preparing backend scripts.
- **`@types/node`** (`^22.14.0`) & **`@types/express`** (`^4.17.21`): Type definitions for Node.js and Express.

---

## ⚡ Operational Modules (Deployed)

1. **Procedural Orchestrator & Case Workflow (`KanbanBoard` & `CaseDetailModal`)**
   - Visual board tracking matters across 5 procedural stages: *Intake & Compliance*, *Due Diligence & Analysis*, *Drafting & Negotiation*, *Litigation & Court Proceedings*, and *Closing / Enforcement*.
   - Overview of disputed amounts, estimated vs. logged hours, risk labels, and upcoming procedural deadlines.

2. **Billable Hours Telemetry & Invoicing (`LiveTimerBar` & `TimeBillingView`)**
   - Floating timer component with dynamic calculation of accrued billable time based on practice rates.
   - Work in Progress (WIP) tracking, category breakdowns, and exportable billing summaries.

3. **Ethical Conflict-of-Interest Detection Engine (`ConflictCheckModal` & `conflictDetection`)**
   - Matching tool comparing corporate entities, associated groups, and opposing parties against active and closed records.
   - Evaluation reports and printable clearance summaries.

4. **Cryptographic Vault & Document Chain of Custody (`DocumentVault` & `documentSecurity`)**
   - Document repository organized by categories (*M&A Contracts*, *Legal Opinions*, *Court Pleadings*, *Powers of Attorney*).
   - Confidentiality tags (*Attorney-Client Privilege*, *Firm Confidential*) and local SHA-256 hash generation for file integrity auditing.

5. **Trust Account & Retainer Ledger (`TrustAccountView`)**
   - Ledger interface for tracking client retainer funds (*IOLTA / Escrow*), expense reserves, and fee disbursements.

6. **Legal Artificial Intelligence Copilot (`LegalAICopilotModal`)**
   - Structured drafting assistant providing contextual contract clause templates and legal risk checklists.

---

## 🚀 Deployment & Audit Guide

### System Requirements
- **Node.js**: Runtime environment `v20.x` or higher (LTS recommended).
- **Package Manager**: `npm` v10+ (or equivalent).

### Installation & Getting Started

1. **Repository Cloning:**
   ```bash
   git clone https://github.com/JastinBolanos/caselok-legal-workspace.git
   cd caselok-legal-workspace
   ```

2. **Certified Dependency Installation:**
   ```bash
   npm install
   ```

3. **Environment Variable Configuration:**
   ```bash
   cp .env.example .env
   ```
   *(Configure required API credentials and proxy parameters in your `.env` file)*

4. **Running in Development Mode:**
   ```bash
   npm run dev
   ```
   The client suite will be immediately available at `http://localhost:3000`.

---

## 🛠️ Integration & Deployment Tools (CI/CD)

| Command | Purpose / Pipeline |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with Hot Module Replacement on port 3000. |
| `npm run build` | Compiles production artifacts and outputs the optimized bundle in `/dist`. |
| `npm run preview` | Spins up a local pre-deployment validation server over the `/dist` binaries. |
| `npm run lint` | Runs the static TypeScript validator (`tsc --noEmit`) to enforce strict typing. |

---

## 📁 Domain Architecture (Tree)

```text
src/
├── application/             # Orchestration Layer & Custom Hooks
│   └── hooks/               # useWorkspaceState (reactive global state machine)
├── domain/                  # Legal Core Logic & Business Models
│   ├── models/              # Strict entity definitions (Case, Client, Document, Event, Firm, TimeEntry)
│   └── services/            # Pure algorithms (billingCalculations, conflictDetection, deadlineCalculations, documentSecurity)
├── infrastructure/          # Persistence Adapters & External Communication
│   ├── repositories/        # Isolated entity repositories (caseRepo, clientRepo, documentRepo, etc.)
│   └── storage/             # Secure storage adapters & persistence contracts
├── components/              # User Interface & Operational Panels
│   ├── KanbanBoard.tsx      # Procedural board across jurisdictional phases
│   ├── LiveTimerBar.tsx     # Real-time billable hours telemetry
│   ├── DocumentVault.tsx    # Document vault & custody hash computation
│   ├── ConflictCheckModal.tsx # Incompatibility analysis & certification engine
│   ├── TrustAccountView.tsx # Trust account & IOLTA escrow management
│   ├── AnalyticsView.tsx    # Business intelligence & firm operational metrics
│   └── LegalAICopilotModal.tsx # Legal AI inference with Gemini models
├── i18n/                    # Internationalization Module & Legal Terminology (ES / EN)
├── data/                    # Pre-configured seed data for auditable demo environments
├── types.ts                 # Global TypeScript contract exports
├── index.css                # Base styles & institutional design tokens
└── main.tsx                 # Application entry point and hydration
```

---

Software Architecture Property - Jastin Bolaños © 2026. Enterprise Technical Showcase Project.
