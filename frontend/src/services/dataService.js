// Unified API & Mock Service Adapter Boundary for GrainGuard AI
// Controls data mode (defaults to 'mock' for standalone frontend development)

import { mockStore } from './mock/mockStore';
import api from '../api/client';

const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'mock';

export const isMockMode = () => DATA_MODE === 'mock';

// Deterministic mock AI response generator for standalone demo
const getMockAiResponse = (query) => {
  const q = query.toLowerCase();

  if (q.includes('discrepancy') || q.includes('shortage') || q.includes('disp-san-1002') || q.includes('150')) {
    return {
      answer: `**Consignment DISP-SAN-1002 Shortage Analysis:**\n\n1. **Origin:** Sangli Central Grain Godown #1 (WH-SAN-001) dispatched **5,000.0 KG Fortified Rice** on 14-Oct-2026.\n2. **Destination Receipt:** Bedag Seva Fair Price Store #1 (FPS-BED-001) weighed and acknowledged only **4,850.0 KG**.\n3. **Unaccounted Shortage:** **150.0 KG (3.0% shortage)**.\n4. **Statutory Non-Compliance:** Exceeds the NFSA Standard Operating Procedure limit (Section 1.2 permits a maximum of 1.0% or 50 KG in-transit moisture/handling tolerance).\n5. **Recommended Action:** District Supply Officer (DSO) Anand Kulkarni must inspect truck vehicle MH-10-AZ-5542 electronic seal integrity and calibrate the Bedag shop weighbridge.`,
      sources: [
        { title: 'NFSA Transit Shortage Regulation v2024.1', section: 'Section 1.2: Permissible Moisture & Tare Limits' },
        { title: 'Maharashtra PDS Inspection Manual', section: 'Chapter 4: Weighbridge Discrepancy Escalation Protocol' },
      ],
      confidence: 0.96,
    };
  }

  if (q.includes('quota') || q.includes('entitlement') || q.includes('aay') || q.includes('phh')) {
    return {
      answer: `**NFSA Statutory Entitlement Norms (Maharashtra State):**\n\n- **Antyodaya Anna Yojana (AAY):** 35 KG food grain per household per month (composed of **20 KG Fortified Rice @ ₹3/kg** and **15 KG Quality Wheat @ ₹2/kg**).\n- **Priority Households (PHH):** 5 KG food grain per individual member per month (**3 KG Rice @ ₹3/kg** and **2 KG Wheat @ ₹2/kg**).\n- **Non-Priority (NPHH):** As per seasonal state buffer allotment quotas.\n\nAll distributions must be validated via electronic Point-of-Sale (e-PoS) biometric verification.`,
      sources: [
        { title: 'National Food Security Act (NFSA) 2013', section: 'Schedule I: Norms for Foodgrains Distribution' },
        { title: 'Government Resolution No. PDS-2024/CR-88/CS-21', section: 'Subsidized Central Issue Prices' },
      ],
      confidence: 0.98,
    };
  }

  if (q.includes('bedag') || q.includes('belanki') || q.includes('sangli')) {
    return {
      answer: `**Sangli District Demo Locality Overview:**\n\n- **District:** Sangli (10 Talukas, 1,480 Fair Price Shops).\n- **Taluka:** Miraj Taluka (Food & Civil Supplies Tehsildar: Smt. Vandana Patil).\n- **Active Demo Villages:**\n  1. **Bedag (Pincode: 416410):** 2 FPS shops (\`FPS-BED-001\` Suresh Patil - Under Review, \`FPS-BED-002\` Anand Shinde - Active).\n  2. **Belanki (Pincode: 416418):** 2 FPS shops (\`FPS-BEL-001\` Mahesh Kale - Active, \`FPS-BEL-002\` Savita Jadhav - Active).\n- **Source Godown Depot:** Sangli Central Grain Godown #1 (\`WH-SAN-001\`) & Miraj Buffer Depot (\`WH-SAN-002\`).`,
      sources: [
        { title: 'District Supply Office Sangli Gazetteer', section: 'Miraj Sub-Division PDS Directory' },
      ],
      confidence: 0.95,
    };
  }

  return {
    answer: `**PDS Intelligence Analysis for Sangli District:**\n\nQuery: *"${query}"*\n\nBased on centralized PDS policies for Sangli District, grain movement is strictly tracked along the verified administrative chain: **State (Allocation) ➔ District (Quota) ➔ Taluka/Godown (Bulk Buffer) ➔ Transporter (E-Waybill) ➔ Village FPS (Weighbridge Check) ➔ Beneficiary (e-PoS Biometric Disbursal)**.\n\nAll anomalous variances (such as the 150 kg transit shortage on DISP-SAN-1002 and the +73.3% distribution volume spike at Bedag Seva Store) require human-in-the-loop audit signoff before subsequent quota sanctions.`,
    sources: [
      { title: 'GrainGuard AI Statutory Governance SOP', section: 'Human-in-the-Loop Decision Boundaries' },
    ],
    confidence: 0.91,
  };
};

export const dataService = {
  // Subscribe to reactive state updates
  subscribe: (listener) => mockStore.subscribe(listener),

  // Reset demo dataset
  resetDemoData: async () => {
    mockStore.reset();
    return { success: true };
  },

  // 1. Dashboard Statistics
  getDashboardSummary: async () => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getDashboardSummary() };
    }
    const res = await api.get('/dashboard/summary');
    return res.data;
  },

  // 2. Warehouses / Godowns
  getWarehouses: async () => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getWarehouses() };
    }
    const res = await api.get('/godowns');
    return res.data;
  },

  getWarehouseById: async (id) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getWarehouseById(id) };
    }
    const res = await api.get(`/godowns/${id}`);
    return res.data;
  },

  // 3. Fair Price Shops (FPS)
  getFpsShops: async (filters) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getFpsShops(filters) };
    }
    const res = await api.get('/ration-shops', { params: filters });
    return res.data;
  },

  getFpsShopById: async (id) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getFpsShopById(id) };
    }
    const res = await api.get(`/ration-shops/${id}`);
    return res.data;
  },

  // 4. Beneficiaries
  getBeneficiaries: async (filters) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getBeneficiaries(filters) };
    }
    const res = await api.get('/beneficiaries', { params: filters });
    return res.data;
  },

  getBeneficiaryById: async (id) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getBeneficiaryById(id) };
    }
    const res = await api.get(`/beneficiaries/${id}`);
    return res.data;
  },

  // 5. Stock Inventory
  getInventory: async (filters) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getInventory(filters) };
    }
    const res = await api.get('/inventory', { params: filters });
    return res.data;
  },

  // 6. Grain Dispatches
  getDispatches: async (filters) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getDispatches(filters) };
    }
    const res = await api.get('/dispatch', { params: filters });
    return res.data;
  },

  createDispatch: async (dispatchData) => {
    if (isMockMode()) {
      const created = mockStore.createDispatch(dispatchData);
      return { success: true, data: created, message: 'Electronic Waybill created successfully!' };
    }
    const res = await api.post('/dispatch', dispatchData);
    return res.data;
  },

  updateDispatchStatus: async (dispatchId, status, notes) => {
    if (isMockMode()) {
      const updated = mockStore.updateDispatchStatus(dispatchId, status, notes);
      return { success: true, data: updated };
    }
    const res = await api.patch(`/dispatch/${dispatchId}/status`, { status, notes });
    return res.data;
  },

  // 7. Receipts & Weighbridge Shortages
  getReceipts: async () => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getReceipts() };
    }
    const res = await api.get('/receipts');
    return res.data;
  },

  confirmReceipt: async (receiptData) => {
    if (isMockMode()) {
      const confirmed = mockStore.confirmReceipt(receiptData);
      return { success: true, data: confirmed, message: 'Weighbridge delivery receipt confirmed!' };
    }
    const res = await api.post('/receipts', receiptData);
    return res.data;
  },

  // 8. Distributions (e-PoS Point-of-Sale)
  getDistributions: async (filters) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getDistributions(filters) };
    }
    const res = await api.get('/distributions', { params: filters });
    return res.data;
  },

  recordDistribution: async (distData) => {
    if (isMockMode()) {
      const record = mockStore.recordDistribution(distData);
      return { success: true, data: record, message: 'Grain disbursement logged successfully!' };
    }
    const res = await api.post('/distributions', distData);
    return res.data;
  },

  getAlerts: async (filters) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getAlerts(filters) };
    }
    const res = await api.get('/alerts', { params: filters });
    return res.data;
  },

  getAlertById: async (id) => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getAlertById(id) };
    }
    const res = await api.get(`/alerts/${id}`);
    return res.data;
  },

  updateAlert: async (alertId, updateData) => {
    if (isMockMode()) {
      const updated = mockStore.updateAlert(alertId, updateData);
      return { success: true, data: updated, message: 'Investigation notes and status updated.' };
    }
    const res = await api.put(`/alerts/${alertId}/review`, updateData);
    return res.data;
  },

  // 10. Audit Logs
  getAuditLogs: async () => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getAuditLogs() };
    }
    const res = await api.get('/audit-logs');
    return res.data;
  },

  // 11. Complaints / Grievances
  getComplaints: async () => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getComplaints() };
    }
    const res = await api.get('/complaints');
    return res.data;
  },

  submitComplaint: async (complaintData) => {
    if (isMockMode()) {
      const created = mockStore.submitComplaint(complaintData);
      return { success: true, data: created, message: 'Grievance submitted successfully!' };
    }
    const res = await api.post('/complaints', complaintData);
    return res.data;
  },

  // 12. Policy Documents & RAG Knowledge Base
  getDocuments: async () => {
    if (isMockMode()) {
      return { success: true, data: mockStore.getDocuments() };
    }
    const res = await api.get('/rag/documents');
    return res.data;
  },

  ingestDocument: async (docData) => {
    if (isMockMode()) {
      const created = mockStore.ingestDocument(docData);
      return { success: true, data: created, message: 'Document ingested and indexed for RAG vector retrieval!' };
    }
    const res = await api.post('/rag/documents', docData);
    return res.data;
  },

  // 13. AI Audit Agent
  runAiAudit: async (shopId) => {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, data: mockStore.runAiAudit(shopId) };
    }
    const res = await api.post(`/ai/audit/shop/${shopId}`);
    return res.data;
  },

  // 14. Simulated AI Assistant / Policy RAG
  askAiAssistant: async (question) => {
    if (isMockMode()) {
      // Simulate 500ms network delay for realistic experience
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { success: true, data: getMockAiResponse(question) };
    }
    const res = await api.post('/ai/chat', { prompt: question });
    return res.data;
  },
};
