# Caselok Enterprise LegalTech Workspace `v2.4.0-ENT`

[![Build Status](https://img.shields.io/badge/Build-Passing-10B981?style=flat-square&logo=github-actions)](https://github.com/JastinBolanos/caselok-legal-workspace)
[![Deployment](https://img.shields.io/badge/Deployment-Cloud%20Run%20Production-0EA5E9?style=flat-square&logo=google-cloud)](https://github.com/JastinBolanos/caselok-legal-workspace)
[![Compliance / Architecture](https://img.shields.io/badge/Architecture-Clean%20DDD%20%2F%20Hexagonal-8B5CF6?style=flat-square)](https://github.com/JastinBolanos/caselok-legal-workspace)
[![Security Audited](https://img.shields.io/badge/Security-SHA--256%20Chain%20of%20Custody-0F172A?style=flat-square&logo=shield)](https://github.com/JastinBolanos/caselok-legal-workspace)

> **High-availability enterprise system for comprehensive legal case management**, complex litigation orchestration, strict real-time billable hours tracking, ethical conflict-of-interest prevention, and cryptographic document asset custody for elite law firms and multinational legal departments.

🌍 **[View Live Platform (Production) 🟢](https://caselok.vercel.app)**

![Caselok Workspace Preview](https://github.com/user-attachments/assets/b1b31fcc-fe69-4c86-b00a-d340f127d534)

---

## 🎥 LegalTech Environment Demonstration

**🎬 Control Panel & Case Orchestration**  
Exploration of the legal ecosystem: procedural management via Kanban board, real-time billable hours (WIP) telemetry, conflict-of-interest detection engine, and document custody with SHA-256 integrity verification.

https://github.com/user-attachments/assets/265bf4ce-b1ee-480d-b1dc-273adf21cbd1

---

## 🏛️ System Architecture & Technology Stack

Caselok implements a decoupled architecture based on **Clean Architecture** and **Domain-Driven Design (DDD)** with high-performance client/edge execution. Due to strict data governance policies, corporate confidentiality, and regulatory compliance (GDPR / Organic Law of the Judiciary), distributed persistence microservices, enterprise relational databases, and judicial synchronization pipelines reside in private repositories within isolated virtual networks.

Below is the certified operational technology suite used in the system:

### Core & Runtime
- **`react`** (`^19.0.1`): Latest generation declarative and reactive UI engine for high-density interfaces.
- **`react-dom`** (`^19.0.1`): Optimized rendering and hydration layer for the DOM.
- **`typescript`** (`~5.8.2`): Strict static typing across all domain and infrastructure layers.

### UI Engine, Styling & Motion
- **`@tailwindcss/vite`** (`^4.1.14`) & **`tailwindcss`** (`^4.1.14`): Native compilation zero-runtime CSS utility engine.
- **`motion`** (`^12.23.24`): Orchestrator for micro-interactions, complex state transitions, and layout animations.
- **`lucide-react`** (`^0.546.0`): Standardized technical vector iconography for legal and financial environments.
- **`autoprefixer`** (`^10.4.21`): CSS compatibility optimization and vendor prefixes.

### Inference Engine & Legal AI
- **`@google/genai`** (`^2.4.0`): Enterprise SDK for integrating advanced Gemini language models in contract analysis, jurisprudential synthesis, and assisted drafting of complex clauses.

### Backend, Proxy & Tooling
- **`express`** (`^4.21.2`): Proxy server for secure request routing, middleware, and security header controls.
- **`vite`** (`^6.2.3`): Bundling platform, Hot Module Replacement, and production-optimized compilation.
- **`@vitejs/plugin-react`** (`^5.0.4`): Advanced Fast Refresh integration for React in Vite.
- **`dotenv`** (`^17.2.3`): Secure loading of environment variables and execution parameters.
- **`tsx`** (`^4.21.0`): TypeScript runtime for direct execution of the proxy server in development environments.
- **`esbuild`** (`^0.25.0`): Ultra-fast compiler and minifier for packaging server artifacts.
- **`@types/node`** (`^22.14.0`) & **`@types/express`** (`^4.17.21`): Types and contracts for Node.js and Express environments.

---

## ⚡ Operational Modules (Deployed)

1. **Procedural Orchestrator & Case Workflow (`KanbanBoard` & `CaseDetailModal`)**
   - Visual management of the judicial/corporate lifecycle structured into 5 standard procedural stages: *Intake & Compliance*, *Due Diligence & Analysis*, *Drafting & Negotiation*, *Litigation & Court Proceedings*, and *Closing / Enforcement*.
   - Supervision of amounts in dispute, calculation of budgeted vs. accrued billable hours, risk categorization, and monitoring of preclusive statutory milestones.

2. **Billable Hours Telemetry & Invoicing (`LiveTimerBar` & `TimeBillingView`)**
   - Persistent floating stopwatch with dynamic real-time calculation of accrued legal fees based on managing partner or practice group rates.
   - Work in Progress (WIP) settlement, granular time allocation by procedural category, and generation of billing statements.

3. **Ethical Conflict-of-Interest Detection Engine (`ConflictCheckModal` & `conflictDetection`)**
   - Cross-checking algorithm that analyzes affiliated entities, corporate groups, and adverse parties across active and historical matters.
   - Automated issuance of compatibility opinions and Clearance certificates with partner signature traceability.

4. **Cryptographic Vault & Document Chain of Custody (`DocumentVault` & `documentSecurity`)**
   - Secure repository with procedural categorization (*M&A Contracts*, *Legal Opinions*, *Court Pleadings*, *Powers of Attorney*).
   - Classification under strict confidentiality tiers (*Attorney-Client Privilege*, *Firm Confidential*) and SHA-256 hash generation for evidentiary integrity auditing.

5. **Trust Account & Retainer Ledger (`TrustAccountView`)**
   - Strict administration of third-party funds (*IOLTA / Escrow*), litigation expense retainers, judicial deposits, and transparent disbursement of earned fees.

6. **Legal Artificial Intelligence Copilot (`LegalAICopilotModal`)**
   - Parametric drafting assistant for critical contractual clauses (CAM/ICC Arbitration, MAC Clauses, Indemnity Caps, Non-Compete Covenants) and legal risk assessment.

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
