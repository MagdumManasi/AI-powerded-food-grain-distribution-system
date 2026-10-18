# GrainGuard AI — Project Status

## Project Overview
**GrainGuard AI** is an enterprise-grade AI-Powered Food Grain Distribution Intelligence & Accountability Platform for managing India's Public Distribution System (PDS) lifecycle:
`Government Allocation → Godown → Transporter → Ration Shop (FPS) → Beneficiary`.

---

## Current Status: COMPLETED & RUNNING 🚀

### 1. Live Application Access Links
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API & H2 Console:** [http://localhost:8080](http://localhost:8080)
- **Swagger / OpenAPI Documentation:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON Spec:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

### 2. Demo Credentials (One-Click Available on Login Page)
| Role | Email | Password | Access / Scope |
| :--- | :--- | :--- | :--- |
| **OFFICER** | `officer@grainguard.gov.in` | `Officer@123` | Inspect shops, review alerts, run AI audits, view inventory |
| **ADMIN** | `admin@grainguard.gov.in` | `Admin@123` | Full administrative control, godowns, shops, users |
| **AUDITOR** | `auditor@grainguard.gov.in` | `Auditor@123` | Audit logs, anomaly reviews, compliance reports |
| **FPS_OWNER** | `fps102@grainguard.gov.in` | `Owner@123` | Manage assigned shop, record receipts, distribute grain |
| **TRANSPORTER** | `transporter@grainguard.gov.in` | `Transporter@123` | Shipments, delivery confirmation, vehicle tracking |

---

### 3. End-to-End Demo Scenario Verified (Section 40)
- **Target Shop:** **FPS102** (Saraswati Fair Price Store, Pune)
- **Waybill Dispatch DISP-1002:** 5000.0 KG Rice dispatched from Central Godown #1 via vehicle `MH-12-PQ-9988`.
- **Receipt RCPT-1002:** Actual receipt recorded at 4850.0 KG (Shortage: **150.0 KG / 3.0% discrepancy**).
- **Distribution Surge:** 7800.0 KG Rice distributed in current month (**+73.3% deviation** above 4500.0 KG baseline).
- **Automated AI Risk Score:** **75.0 / 100 (HIGH RISK)** calculated by deterministic Anomaly Engine.
- **AI Shop Audit Agent:** Grounded in retrieved PDS standard operating procedure circulars with explainable advisory findings and human officer sign-off.

---

### 4. Completed Modules & Files

#### Backend (Spring Boot 3.2.3, Java 21, Hibernate, JWT, Spring Security)
- `src/main/java/com/grainguard/GrainGuardApplication.java`: Spring Boot main application class
- `src/main/java/com/grainguard/entity/`: User, Beneficiary, FamilyMember, RationShop, Godown, Supplier, Transporter, GrainType, Inventory, InventoryTransaction, GrainDispatch, GrainReceipt, DistributionTransaction, EntitlementRule, AuditLog, Alert, ShopRiskProfile, Document, DocumentChunk
- `src/main/java/com/grainguard/repository/`: Spring Data JPA repositories with query methods
- `src/main/java/com/grainguard/security/`: JwtTokenProvider, CustomUserDetailsService, JwtAuthFilter, SecurityConfig
- `src/main/java/com/grainguard/service/`: AuthService, BeneficiaryService, RationShopService, GodownService, InventoryService, DispatchService, ReceiptService, DistributionService, EntitlementService, AnomalyEngineService, AlertService, AuditLogService
- `src/main/java/com/grainguard/ai/`:
  - `service/GeminiService.java`: Google Gemini 1.5 Pro integration with deterministic local reasoning engine fallback
  - `rag/RagService.java`: Policy document chunking, semantic similarity retrieval, grounded response synthesis
  - `agent/AgentToolsService.java`: Controlled Spring AI tool functions for agents
  - `agent/AiAuditAgentService.java`: AI Shop Audit Agent cross-referencing ledger data & PDS guidelines
  - `agent/DemandPlanningAgentService.java`: Next-period grain allocation recommendation engine
- `src/main/java/com/grainguard/controller/`: REST endpoints for Auth, Dashboard, Beneficiaries, Shops, Godowns, Inventory, Dispatch, Receipts, Distributions, Alerts, AI, RAG, and Audit Logs
- `src/main/java/com/grainguard/config/DataInitializer.java`: Pre-populates demo scenario, users, godowns, shops, inventories, and PDS circulars

#### Frontend (React, Vite, React Router 6, Recharts, Lucide-React, Axios)
- `frontend/src/index.css`: Indian Government & Agriculture design system (forest green `#14532d`, emerald, warm ivory, saffron `#f97316`, tricolour accents)
- `frontend/src/api/client.js`: Axios client with automatic JWT token attachment and error interception
- `frontend/src/context/AuthContext.jsx`: Authentication state, persistent sessions, one-click demo logins
- `frontend/src/components/`: Navbar, Sidebar, Layout, StatCard
- `frontend/src/pages/`:
  - `Login.jsx`: Login with fast one-click demo credentials switcher
  - `Dashboard.jsx`: Executive statistics, Recharts shop distribution bar chart, grain stock pie chart, flagged shop spotlight
  - `Beneficiaries.jsx` & `BeneficiaryDetail.jsx`: Cardholders directory, family members, entitlement calculations
  - `RationShops.jsx` & `RationShopDetail.jsx`: Fair Price Shops directory, risk badges, **[RUN AI AUDIT]** and **[DEMAND PLAN]** modals
  - `Godowns.jsx`: Central and regional bulk storage depots
  - `Inventory.jsx`: Stock balances across locations with Stock Transfer modal
  - `Dispatch.jsx`: Transit waybills with New Dispatch Order modal
  - `Receipts.jsx`: Delivery confirmation with automated shortage calculation
  - `Distributions.jsx`: Point-of-sale grain issue records
  - `Alerts.jsx` & `AlertDetail.jsx`: Anomaly inspection with Human-in-the-Loop decision actions (`UNDER_REVIEW`, `RESOLVED`, `FALSE_POSITIVE`)
  - `AiAudit.jsx`: Dedicated AI Shop Audit Agent execution page
  - `AiAssistant.jsx`: Interactive chat assistant with grounded PDS knowledge citations
  - `Documents.jsx`: PDS circulars and policy knowledge indexing
  - `AuditLogs.jsx`: Immutable compliance audit trail

---

## How to Run Locally

### Start Backend
```bash
mvn package -DskipTests
java -jar target/grainguard-backend-1.0.0.jar
```
*Backend runs on `http://localhost:8080`*

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*
