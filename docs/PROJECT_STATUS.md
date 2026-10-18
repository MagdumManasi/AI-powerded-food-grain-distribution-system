# GrainGuard AI — Project Status

## Project Overview
**GrainGuard AI** is an enterprise-grade AI-Powered Food Grain Distribution Intelligence & Accountability Platform designed for India's Public Distribution System (PDS) lifecycle:
`STATE ALLOCATION → CENTRAL GODOWN → TRANSPORTER → VILLAGE FAIR PRICE SHOP (FPS) → BENEFICIARY CITIZEN`.

---

## Current Status: FRONTEND COMPLETE & LIVE IN DEMO MODE 🚀

### 1. Live Application Access Link
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Data Mode:** Standalone Mock Architecture (Stateful, local reactive store with LocalStorage persistence)
- **Backend API (Future Integration):** Configured via unified adapter boundary `frontend/src/services/dataService.js` (`VITE_DATA_MODE=mock` / `api`)

---

### 2. Geographic & Jurisdictional Hierarchy (Sangli District)
- **State:** Maharashtra
- **District:** Sangli (10 Talukas, 1,480 Fair Price Shops)
- **Taluka:** Miraj Sub-Division
- **Demo Villages & Pincodes:**
  1. **Bedag (Pincode: 416410)** — 2 Fair Price Shops (`FPS-BED-001` Suresh Patil, `FPS-BED-002` Anand Shinde)
  2. **Belanki (Pincode: 416418)** — 2 Fair Price Shops (`FPS-BEL-001` Mahesh Kale, `FPS-BEL-002` Savita Jadhav)
- **Bulk Godowns:** Sangli Central Grain Godown #1 (`WH-SAN-001`, 100 MT) & Miraj Buffer Depot (`WH-SAN-002`, 80 MT)

---

### 3. Canonical Demo Roles & Instant Login Credentials
The application provides 7 canonical role profiles with one-click instant authentication on the login screen and a live role-switcher in the top navigation bar:

| Role Name | Demo Email | Jurisdiction / Scope | Key Operational Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin.demo@example.com` | Maharashtra State Headquarters | Full administrative control, system logs, user administration |
| **District Officer** | `officer.demo@example.com` | Sangli District Supply Office (DSO) | Miraj Taluka quotas, anomaly reviews, AI audits, grievance escalation |
| **Warehouse Manager** | `warehouse.demo@example.com` | Sangli Central Godown (`WH-SAN-001`) | Bulk grain receipt, digital bag weighing, electronic waybill creation |
| **Transporter** | `transporter.demo@example.com` | Krishna Valley Logistics (`MH-10-AZ-5542`) | Route checkpoints, transit milestone updates, electronic seal verification |
| **FPS Owner** | `fps.demo@example.com` | Bedag Seva Store (`FPS-BED-001`) | Electronic weighbridge receipts, e-PoS biometric disbursals, stock balance |
| **Beneficiary Citizen** | `beneficiary.demo@example.com` | Tukaram Shinde (`RC-SAN-AAY-1001`), Bedag | Digital ration card passbook, monthly quota balance, grievance filing |
| **Auditor** | `auditor.demo@example.com` | State Vigilance & Audit Bureau | SHA-256 immutable audit trail, transit shortage analysis, policy adherence |

---

### 4. End-to-End Core Demo Scenario
- **Consignment Waybill:** `DISP-SAN-1002` dispatched from Sangli Central Godown (`WH-SAN-001`) to Bedag Seva Store (`FPS-BED-001`) via carrier `MH-10-AZ-5542`.
- **Dispatched Manifest:** 5,000.0 KG Fortified Rice.
- **Weighbridge Receipt:** Received & weighed at only 4,850.0 KG.
- **Transit Discrepancy:** Unaccounted shortage of **150.0 KG (3.0% shortage)** exceeding NFSA statutory 1.0% tolerance limit.
- **Distribution Velocity Surge:** +73.3% distribution deviation (7,800.0 KG disbursed vs 4,500.0 KG historical average).
- **Composite Risk Score:** **78.0 / 100 (HIGH RISK)** on Bedag Seva Store.
- **AI Audit Agent & Assistant:** Grounded in statutory NFSA regulations and Maharashtra GR No. PDS-2024/CR-88/CS-21 with human-in-the-loop resolution sign-off.

---

### 5. Architectural Implementation
- **Mock Store (`frontend/src/services/mock/mockStore.js`):** Stateful in-memory repository with `localStorage` persistence, reactive subscriber pattern, stock validation, and cryptographic SHA-256 audit logging.
- **Unified Boundary (`frontend/src/services/dataService.js`):** Clean abstraction layer decoupling all React components from backend transport. Supports seamless switching between mock mode and Spring Boot REST API.
- **All 18 Navigable Screens Completed & Subscribed:**
  1. `Login.jsx`: 7 demo user logins with instant bypass.
  2. `Dashboard.jsx`: Dynamic role-specific executive dashboards.
  3. `HierarchyExplorer.jsx`: 6-tier administrative tree & physical grain movement pipeline.
  4. `BeneficiaryPortal.jsx`: Citizen portal for Tukaram Shinde (Bedag) with digital passbook & grievance filing.
  5. `WarehouseConsole.jsx`: Sangli Central Godown console with live dispatch generation modal.
  6. `TransporterConsole.jsx`: Carrier fleet console for truck `MH-10-AZ-5542` with trip milestones.
  7. `Complaints.jsx`: Citizen grievances for Bedag & Belanki with show-cause notices.
  8. `Beneficiaries.jsx` & `BeneficiaryDetail.jsx`: Sangli cardholders dossier & quota tracking.
  9. `RationShops.jsx` & `RationShopDetail.jsx`: Fair Price Shop registry & risk scoring.
  10. `Godowns.jsx`: Bulk depot capacity & stock ledgers.
  11. `Inventory.jsx`: Real-time stock levels across warehouses and shops.
  12. `Dispatch.jsx`: Outbound waybill ledger & e-waybill generation.
  13. `Receipts.jsx`: Weighbridge receipt reconciliation & automated discrepancy alerts.
  14. `Distributions.jsx`: Point-of-sale grain issue transactions with Aadhaar biometric verification.
  15. `Alerts.jsx` & `AlertDetail.jsx`: AI anomaly inspection & human-in-the-loop review.
  16. `AiAudit.jsx`: AI-assisted shop audit agent with forensic inspection report.
  17. `AiAssistant.jsx`: Grounded RAG policy chat assistant with statutory citations.
  18. `Documents.jsx` & `AuditLogs.jsx`: Statutory policy indexing & tamper-evident audit trail.
