# Caselok Enterprise LegalTech Workspace `v2.4.0-ENT`

[![Build Status](https://img.shields.io/badge/Build-Passing-10B981?style=flat-square&logo=github-actions)](https://github.com/JastinBolanos/caselok-legal-workspace)
[![Deployment](https://img.shields.io/badge/Deployment-Cloud%20Run%20Production-0EA5E9?style=flat-square&logo=google-cloud)](https://github.com/JastinBolanos/caselok-legal-workspace)
[![Compliance / Architecture](https://img.shields.io/badge/Architecture-Clean%20DDD%20%2F%20Hexagonal-8B5CF6?style=flat-square)](https://github.com/JastinBolanos/caselok-legal-workspace)
[![Security Audited](https://img.shields.io/badge/Security-SHA--256%20Chain%20of%20Custody-0F172A?style=flat-square&logo=shield)](https://github.com/JastinBolanos/caselok-legal-workspace)

> **Sistema corporativo de alta disponibilidad para la gestión integral de expedientes jurídicos**, orquestación de litigios complejos, control estricto de horas facturables en tiempo real, prevención deontológica de conflictos de interés y custodia criptográfica de activos documentales para bufetes de élite y departamentos legales multinacionales.

🌍 **[Ver Plataforma en Vivo (Producción) 🟢](https://caselok.vercel.app)**

![Vista Previa de Caselok Workspace](https://github.com/user-attachments/assets/f6dbbf5d-d220-44b4-b7ea-976356a0050a)

---

## 🎥 Demostración del Entorno LegalTech

**🎬 Panel de Control y Orquestación de Casos**  
Exploración del ecosistema jurídico: gestión procesal mediante tablero Kanban, telemetría de horas facturables (WIP) en tiempo real, motor de detección de conflictos de interés y custodia de documentos con verificación de integridad SHA-256.

https://github.com/user-attachments/assets/622a64f5-585e-4915-a023-36d605ce5380

---

## 🏛️ Arquitectura de Sistema y Stack Tecnológico

Caselok implementa una arquitectura desacoplada basada en **Clean Architecture** y **Domain-Driven Design (DDD)** con ejecución cliente/edge de alto rendimiento. Por estrictas políticas de gobernanza de datos, confidencialidad corporativa y cumplimiento normativo (RGPD / Ley Orgánica del Poder Judicial), los microservicios de persistencia distribuida, bases de datos relacionales empresariales y el pipeline de sincronización judicial residen en repositorios privados bajo redes virtuales aisladas.

A continuación se detalla la suite tecnológica operativa homologada en el sistema:

### Core & Runtime
- **`react`** (`^19.0.1`): Motor declarativo y reactivo de última generación para interfaces de alta densidad.
- **`react-dom`** (`^19.0.1`): Capa de renderizado e hidratación optimizada para DOM.
- **`typescript`** (`~5.8.2`): Tipado estático estricto en todas las capas del dominio y la infraestructura.

### UI Engine, Styling & Motion
- **`@tailwindcss/vite`** (`^4.1.14`) & **`tailwindcss`** (`^4.1.14`): Motor de utilidades CSS de compilación nativa zero-runtime.
- **`motion`** (`^12.23.24`): Orquestador de micro-interacciones, transiciones de estado complejas y layout animations.
- **`lucide-react`** (`^0.546.0`): Iconografía vectorial técnica estandarizada para entornos jurídicos y financieros.
- **`autoprefixer`** (`^10.4.21`): Optimización de compatibilidad CSS y vendor prefixes.

### Motor de Inferencia & IA Legal
- **`@google/genai`** (`^2.4.0`): SDK empresarial para la integración de modelos de lenguaje avanzados Gemini en análisis contractual, síntesis jurisprudencial y redacción asistida de cláusulas complejas.

### Backend, Proxy & Tooling
- **`express`** (`^4.21.2`): Servidor proxy para enrutamiento seguro de peticiones, middlewares y control de cabeceras de seguridad.
- **`vite`** (`^6.2.3`): Plataforma de empaquetado, Hot Module Replacement y compilación optimizada para producción.
- **`@vitejs/plugin-react`** (`^5.0.4`): Integración avanzada de Fast Refresh para React en Vite.
- **`dotenv`** (`^17.2.3`): Carga segura de variables de entorno y parámetros de ejecución.
- **`tsx`** (`^4.21.0`): Runtime TypeScript para ejecución directa del servidor proxy en entornos de desarrollo.
- **`esbuild`** (`^0.25.0`): Compilador y minificador ultraveloz para empaquetado de artefactos del servidor.
- **`@types/node`** (`^22.14.0`) & **`@types/express`** (`^4.17.21`): Tipos y contratos del entorno Node.js y Express.

---

## ⚡ Módulos Operativos (Desplegados)

1. **Orquestador Procesal y Flujo de Expedientes (`KanbanBoard` & `CaseDetailModal`)**
   - Gestión visual del ciclo de vida judicial/corporativo estructurado en 5 etapas normativas: *Intake & Compliance*, *Due Diligence & Análisis*, *Redacción & Negociación*, *Litigación & Sede Judicial* y *Cierre / Ejecución*.
   - Supervisión de cuantías en litigio, cálculo de horas presupuestadas vs. devengadas, categorización por riesgo y seguimiento de hitos preclusivos.

2. **Telemetría de Horas Facturables y Facturación (`LiveTimerBar` & `TimeBillingView`)**
   - Cronómetro flotante persistente con cálculo dinámico de honorarios devengados en tiempo real según la tarifa del socio director o área jurídica.
   - Liquidación de *Work in Progress* (WIP), imputación granular por categoría procesal y generación de estados de facturación.

3. **Motor Deontológico de Detección de Conflictos (`ConflictCheckModal` & `conflictDetection`)**
   - Algoritmo de comprobación cruzada que analiza entidades vinculadas, grupos empresariales y partes contrarias en pleitos activos e históricos.
   - Emisión automatizada de dictámenes de compatibilidad y certificados de *Clearance* con trazabilidad de firma de socio.

4. **Bóveda Criptográfica y Cadena de Custodia Documental (`DocumentVault` & `documentSecurity`)**
   - Repositorio seguro con categorización procesal (*Contratos M&A*, *Dictámenes Jurídicos*, *Escritos Procesales*, *Poderes Notariales*).
   - Clasificación por niveles de estricta confidencialidad (*Secreto Profesional*, *Confidencial Bufete*) y generación de firmas hash SHA-256 para auditoría de integridad probatoria.

5. **Libro Mayor de Cuentas Fiduciarias y Provisiones (`TrustAccountView`)**
   - Administración estricta de fondos de terceros (*IOLTA / Escrow*), provisiones de fondos para gastos procesales, consignaciones judiciales y aplicación transparente de honorarios devengados.

6. **Copiloto de Inteligencia Artificial Jurídica (`LegalAICopilotModal`)**
   - Asistente de redacción paramétrica de cláusulas críticas (Arbitraje CAM/CCI, Cláusulas MAC, Cap de Indemnidad, Pactos de No Competencia) y análisis de contingencias legales.

---

## 🚀 Guía de Despliegue y Auditoría

### Requisitos del Sistema
- **Node.js**: Entorno de ejecución `v20.x` o superior (LTS recomendado).
- **Gestor de Paquetes**: `npm` v10+ (o equivalente).

### Pasos de Instalación y Puesta en Marcha

1. **Clonación del Repositorio:**
   ```bash
   git clone https://github.com/JastinBolanos/caselok-legal-workspace.git
   cd caselok-legal-workspace
   ```

2. **Instalación de Dependencias Homologadas:**
   ```bash
   npm install
   ```

3. **Configuración de Variables de Entorno:**
   ```bash
   cp .env.example .env
   ```
   *(Configure las credenciales de API requeridas y parámetros de proxy en su archivo `.env`)*

4. **Ejecución en Modo Desarrollo:**
   ```bash
   npm run dev
   ```
   La suite cliente estará disponible inmediatamente en `http://localhost:3000`.

---

## 🛠️ Herramientas de Integración y Despliegue (CI/CD)

| Comando | Propósito / Pipeline |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo Vite con Hot Module Replacement en el puerto 3000. |
| `npm run build` | Compila los artefactos de producción y genera el bundle optimizado en `/dist`. |
| `npm run preview` | Levanta un servidor local de validación previa al despliegue sobre los binarios de `/dist`. |
| `npm run lint` | Ejecuta el validador estático de TypeScript (`tsc --noEmit`) para garantizar tipado estricto. |

---

## 📁 Arquitectura de Dominio (Tree)

```text
src/
├── application/             # Capa de Orquestación y Hooks
│   └── hooks/               # useWorkspaceState (máquina de estado global reactiva)
├── domain/                  # Núcleo de Lógica Jurídica y Modelos de Negocio
│   ├── models/              # Definiciones estrictas de entidades (Case, Client, Document, Event, Firm, TimeEntry)
│   └── services/            # Algoritmos puros (billingCalculations, conflictDetection, deadlineCalculations, documentSecurity)
├── infrastructure/          # Adaptadores de Persistencia y Comunicación
│   ├── repositories/        # Repositorios aislados por entidad (caseRepo, clientRepo, documentRepo, etc.)
│   └── storage/             # Adaptadores de almacenamiento seguro y contratos de persistencia
├── components/              # Interfaz de Usuario y Paneles Operativos
│   ├── KanbanBoard.tsx      # Tablero procesal de fases jurisdiccionales
│   ├── LiveTimerBar.tsx     # Telemetría de horas facturables en tiempo real
│   ├── DocumentVault.tsx    # Bóveda documental y cálculo de hash de custodia
│   ├── ConflictCheckModal.tsx # Motor de análisis y certificación de incompatibilidades
│   ├── TrustAccountView.tsx # Gestión de cuentas fiduciarias y depósitos IOLTA
│   ├── AnalyticsView.tsx    # Business intelligence y métricas operativas del bufete
│   └── LegalAICopilotModal.tsx # Inferencia de IA legal y modelos Gemini
├── i18n/                    # Módulo de Internacionalización y Terminología Jurídica (ES / EN)
├── data/                    # Semillas de datos pre-configuradas para entornos auditables
├── types.ts                 # Exportación de contratos globales de TypeScript
├── index.css                # Estilos base y variables de diseño institucional
└── main.tsx                 # Punto de entrada e hidratación de la aplicación
```

---

Propiedad de Arquitectura de Software - Jastin Bolaños © 2026. Proyecto de Demostración Técnica Empresarial.
