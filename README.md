# 🌾 GrainGuard AI
### AI-Powered Food Grain Distribution Intelligence & Accountability Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%20%2F%20H2-blue.svg)](https://www.mysql.com/)

**GrainGuard AI** is a production-grade full-stack digital governance platform engineered to manage and monitor the end-to-end public food grain distribution lifecycle:
```
Government Allocation ➔ Central Godowns ➔ Transporters ➔ Ration Shops (FPS) ➔ Beneficiaries
```
The platform uses **Deterministic Anomaly Engines**, **Spring AI / Google Gemini**, and **Retrieval-Augmented Generation (RAG)** grounded in official PDS statutory circulars to detect leakage, flag transit shortages, prevent distribution anomalies, and assist human officers in formal inspections.

---

## 🌟 Key Features

1. **Beneficiary & Entitlement Engine:**
   - Real-time entitlement validation for Antyodaya Anna Yojana (**AAY**) and Priority Household (**PHH**) cardholders.
   - Point-of-Sale (POS) distribution recording with biometric verification logs.
2. **Godown & Ration Shop (FPS) Inventory:**
   - Multi-location stock accounts for Rice, Wheat, and coarse grains.
   - Live minimum threshold tracking and instant low-stock alerts.
   - Cryptographic transaction ledger maintaining an immutable audit history.
3. **Dispatch & Reconciliation (Transit Shortage Detection):**
   - Waybill generation tracking transporter vehicle registration numbers.
   - Automated discrepancy calculation upon receipt: `Shortage = Dispatched - Received`.
   - Automatic severity evaluation (LOW / MEDIUM / HIGH) based on deviation thresholds.
4. **AI Anomaly & Risk Profile Engine:**
   - **Distribution Deviation:** Flags shops exceeding 6-month historical moving averages (e.g. +73.3% volume spikes).
   - **Risk Score Calculator:** Continuously computes weighted risk indicators (0–100) across stock, distribution, transactions, and beneficiaries.
5. **AI Shop Audit Agent:**
   - Autonomous inspection agent synthesizing ledger balances, transit receipts, and relevant PDS policy guidelines.
   - Generates formal, evidence-backed audit findings with neutral, objective terminology.
6. **Policy RAG Assistant:**
   - Ask grounded questions about PDS guidelines, inspection manuals, and transit loss rules.
   - Document chunking, keyword-density semantic vector search, and verifiable document source citations.
7. **Human-in-the-Loop Governance:**
   - AI recommendations never take destructive actions automatically.
   - Authorized human inspecting officers formally review, approve, resolve, or mark alerts as false positives.

---

## 🛠️ Technology Stack

- **Backend:** Java 21, Spring Boot 3.2.3, Spring Data JPA, Hibernate, Spring Security, JWT (jjwt 0.11.5), SpringDoc OpenAPI / Swagger.
- **Frontend:** React 18, Vite, React Router 6, Recharts, Lucide-React, Axios, Tailwind CSS + Indian Agriculture & Government Design System.
- **Database:** MySQL 8+ / H2 In-Memory Database (Dual Mode).
- **AI & RAG:** Spring AI, Google Gemini API, Retrieval-Augmented Generation (RAG) vector chunking.

---

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Apache Maven 3.9+
- Node.js 18+ and npm

### 1. Run Backend
```bash
mvn clean compile
mvn package -DskipTests
java -jar target/grainguard-backend-1.0.0.jar
```
*Backend runs on `http://localhost:8080`*
*Swagger API Docs: `http://localhost:8080/swagger-ui.html`*

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🔐 Demo Credentials

Quick one-click login buttons are provided on the login page for:

| Role | Email | Password | Access / Scope |
| :--- | :--- | :--- | :--- |
| **OFFICER** | `officer@grainguard.gov.in` | `Officer@123` | Inspect shops, review alerts, run AI audits, view inventory |
| **ADMIN** | `admin@grainguard.gov.in` | `Admin@123` | System management, godowns, shops, users |
| **AUDITOR** | `auditor@grainguard.gov.in` | `Auditor@123` | Audit trail, anomaly reviews, compliance reports |
| **FPS OWNER** | `fps102@grainguard.gov.in` | `Owner@123` | Manage assigned shop, record receipts, distribute grain |
| **TRANSPORTER**| `transporter@grainguard.gov.in`| `Transporter@123`| Shipments, delivery confirmation, vehicle tracking |

---

## 🧪 Built-In Demo Scenario
The platform automatically seeds an end-to-end investigation scenario:
1. **Target Shop:** Fair Price Shop **FPS102** (Saraswati Fair Price Store, Pune).
2. **Transit Shortage:** Waybill `DISP-1002` dispatched 5,000 KG Rice; receipt `RCPT-1002` recorded 4,850 KG (**150 KG shortage** / 3.0% discrepancy).
3. **Distribution Surge:** 7,800 KG distributed against a 4,500 KG historical baseline (**+73.3% anomaly deviation**).
4. **AI Risk Score:** Evaluated automatically as **75.0 / 100 (HIGH RISK)**.
5. **AI Audit:** Inspect FPS102 on the dashboard and click **[RUN AI AUDIT]** to synthesize evidence and PDS policy rules.

---

## 📄 License
Developed for academic, research, and public distribution accountability demonstration purposes.
