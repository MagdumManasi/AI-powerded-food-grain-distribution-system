# 🌾 GrainGuard AI
### AI-Powered Food Grain Distribution Intelligence & Accountability Platform

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)

**GrainGuard AI** is an enterprise-grade digital governance platform engineered to manage and monitor the end-to-end public food grain distribution lifecycle:
```
STATE ALLOCATION ➔ CENTRAL GODOWNS ➔ TRANSPORTERS ➔ VILLAGE FAIR PRICE SHOPS (FPS) ➔ BENEFICIARIES
```
The platform uses **Deterministic Anomaly Detection**, **Policy RAG Grounding**, and **Human-in-the-Loop Governance** to detect leakage, flag transit shortages, prevent diversion, and assist civil officers in formal statutory inspections.

---

## 🏛️ Administrative & Locality Hierarchy (Sangli District Demo)

- **State:** Maharashtra
- **District:** Sangli (1,480 Fair Price Shops)
- **Taluka:** Miraj Sub-Division
- **Demo Villages & Pincodes:**
  - **Bedag (Pincode: 416410)** — 2 Fair Price Shops (`FPS-BED-001` Suresh Patil, `FPS-BED-002` Anand Shinde)
  - **Belanki (Pincode: 416418)** — 2 Fair Price Shops (`FPS-BEL-001` Mahesh Kale, `FPS-BEL-002` Savita Jadhav)
- **Bulk Godowns:** Sangli Central Grain Godown #1 (`WH-SAN-001`, 100 MT) & Miraj Buffer Depot (`WH-SAN-002`, 80 MT)

---

## 🌟 Key Features

1. **Beneficiary & Entitlement Engine:**
   - Real-time entitlement validation for Antyodaya Anna Yojana (**AAY** - 35 KG) and Priority Household (**PHH** - 5 KG/member) cardholders.
   - Point-of-Sale (e-PoS) distribution recording with Aadhaar biometric verification simulation.
2. **Godown & Ration Shop (FPS) Inventory:**
   - Multi-tier stock ledgers for Fortified Rice (@ ₹3/kg) and Sharbati Wheat (@ ₹2/kg).
   - Buffer threshold tracking and low-stock alerts.
   - Cryptographic SHA-256 transaction ledger maintaining an immutable audit history.
3. **Dispatch & Reconciliation (Transit Shortage Detection):**
   - Electronic waybill generation tracking transporter vehicle registration numbers (e.g. `MH-10-AZ-5542`) and security seals.
   - Automated discrepancy calculation upon receipt: `Shortage = Dispatched - Received`.
   - Automatic severity evaluation based on NFSA 1.0% tolerance thresholds.
4. **AI Anomaly & Risk Profile Engine:**
   - **Distribution Deviation:** Flags shops exceeding historical baselines (e.g. +73.3% volume surge at Bedag Seva Store).
   - **Risk Score Calculator:** Continuously computes weighted risk indicators (0–100) across stock, distribution, transactions, and grievances.
5. **AI Shop Audit Agent:**
   - Autonomous inspection agent synthesizing ledger balances, transit receipts, and relevant PDS policy guidelines.
   - Generates formal, evidence-backed audit findings with neutral, objective terminology.
6. **Policy RAG Assistant:**
   - Ask grounded questions about Maharashtra PDS guidelines, inspection manuals, and transit loss rules.
   - Document chunking, semantic vector grounding, and verifiable document source citations.
7. **Human-in-the-Loop Governance:**
   - AI recommendations never take destructive actions automatically.
   - Authorized human inspecting officers formally review, approve, resolve, or mark alerts as false positives.

---

## 🚀 Running the Frontend (Standalone Demo Mode)

The frontend operates in standalone demo mode with a full stateful mock store and LocalStorage persistence. It does **not** require a running backend or external API keys to demonstrate the entire application.

```bash
cd frontend
npm install
npm run dev
```

- **Live Application:** [http://localhost:3000](http://localhost:3000)
- **Toggle Data Mode:** Configure `VITE_DATA_MODE=mock` (default) or `VITE_DATA_MODE=api` in `.env`

---

## 🔐 7 Canonical Demo Accounts (1-Click Instant Login)

| Role | Demo Email | Password | Scope / Responsibilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin.demo@example.com` | `Admin@123` | Full administrative control, system logs, user administration |
| **District Officer** | `officer.demo@example.com` | `Officer@123` | Miraj Taluka quotas, anomaly reviews, AI audits, grievance escalation |
| **Warehouse Manager** | `warehouse.demo@example.com` | `Warehouse@123` | Bulk grain receipt, digital weighing, waybill issuance |
| **Transporter** | `transporter.demo@example.com` | `Transporter@123` | Route checkpoints, transit milestone updates, seal verification |
| **FPS Owner** | `fps.demo@example.com` | `Owner@123` | Electronic weighbridge receipts, e-PoS biometric disbursals |
| **Beneficiary Citizen** | `beneficiary.demo@example.com` | `Citizen@123` | Tukaram Shinde (Bedag) passbook, quota status, grievance filing |
| **Auditor** | `auditor.demo@example.com` | `Auditor@123` | SHA-256 immutable audit trail, transit shortage analysis |

---

## 🧪 Built-In Sangli Core Demo Scenario

The application seeds a realistic end-to-end investigation scenario:
1. **Target Shop:** Fair Price Shop **FPS-BED-001** (Bedag Seva Fair Price Store #1, Miraj Taluka).
2. **Transit Shortage:** Waybill `DISP-SAN-1002` dispatched 5,000 KG Fortified Rice; delivery receipt recorded 4,850 KG (**150 KG shortage** / 3.0% discrepancy).
3. **Distribution Surge:** 7,800 KG distributed against a 4,500 KG historical baseline (**+73.3% anomaly deviation**).
4. **AI Risk Score:** Evaluated automatically as **78.0 / 100 (HIGH RISK)**.
5. **AI Audit:** Open **AI Shop Audit Agent** on the navigation bar, select `FPS-BED-001`, and click **[Execute AI Audit]** to synthesize evidence and statutory NFSA policy rules.

---

## 📄 License
Developed for academic, research, and public distribution accountability demonstration purposes.
