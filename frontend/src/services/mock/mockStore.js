// Stateful Mock Store with LocalStorage Persistence for GrainGuard AI Demo
// All mutations (dispatches, receipts, distributions, alerts, complaints) simulate real business logic

import { MOCK_WAREHOUSES } from '../../mock/warehouses';
import { MOCK_FPS_SHOPS } from '../../mock/fpsShops';
import { MOCK_BENEFICIARIES } from '../../mock/beneficiaries';
import { MOCK_INVENTORY } from '../../mock/inventory';
import { MOCK_DISPATCHES } from '../../mock/dispatches';
import { MOCK_DISTRIBUTIONS } from '../../mock/distributions';
import { MOCK_ALERTS } from '../../mock/alerts';
import { MOCK_AUDIT_LOGS } from '../../mock/auditLogs';
import { MOCK_COMPLAINTS } from '../../mock/complaints';
import { MOCK_DOCUMENTS } from '../../mock/documents';
import { computeDashboardStats } from '../../mock/dashboardStats';

const STORAGE_KEY = 'grainguard_sangli_demo_state_v3';

class MockStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.warehouses && parsed.fpsShops && parsed.beneficiaries) {
          if (!parsed.documents) {
            parsed.documents = JSON.parse(JSON.stringify(MOCK_DOCUMENTS));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved demo state, falling back to default seed:', e);
    }

    return this.getInitialSeedState();
  }

  getInitialSeedState() {
    return {
      warehouses: JSON.parse(JSON.stringify(MOCK_WAREHOUSES)),
      fpsShops: JSON.parse(JSON.stringify(MOCK_FPS_SHOPS)),
      beneficiaries: JSON.parse(JSON.stringify(MOCK_BENEFICIARIES)),
      inventory: JSON.parse(JSON.stringify(MOCK_INVENTORY)),
      dispatches: JSON.parse(JSON.stringify(MOCK_DISPATCHES)),
      distributions: JSON.parse(JSON.stringify(MOCK_DISTRIBUTIONS)),
      alerts: JSON.parse(JSON.stringify(MOCK_ALERTS)),
      auditLogs: JSON.parse(JSON.stringify(MOCK_AUDIT_LOGS)),
      complaints: JSON.parse(JSON.stringify(MOCK_COMPLAINTS)),
      documents: JSON.parse(JSON.stringify(MOCK_DOCUMENTS)),
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist demo state:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Error notifying subscriber:', err);
      }
    });
  }

  reset() {
    this.state = this.getInitialSeedState();
    this.saveState();
  }

  // --- QUERY METHODS ---
  getDashboardSummary() {
    return computeDashboardStats(this.state);
  }

  getWarehouses() {
    return [...this.state.warehouses];
  }

  getWarehouseById(id) {
    return this.state.warehouses.find((w) => w.id === Number(id) || w.warehouseCode === id);
  }

  getFpsShops(filters = {}) {
    let list = [...this.state.fpsShops];
    if (filters.village) {
      list = list.filter((s) => s.village.toLowerCase() === filters.village.toLowerCase());
    }
    if (filters.status) {
      list = list.filter((s) => s.currentStatus === filters.status);
    }
    return list;
  }

  getFpsShopById(id) {
    return this.state.fpsShops.find((s) => s.id === Number(id) || s.shopCode === id);
  }

  getBeneficiaries(filters = {}) {
    let list = [...this.state.beneficiaries];
    if (filters.village) {
      list = list.filter((b) => b.village.toLowerCase() === filters.village.toLowerCase());
    }
    if (filters.shopCode) {
      list = list.filter((b) => b.assignedShopCode === filters.shopCode);
    }
    if (filters.cardType) {
      list = list.filter((b) => b.cardType === filters.cardType);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.rationCardNumber.toLowerCase().includes(q) ||
          b.beneficiaryCode.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getBeneficiaryById(id) {
    return this.state.beneficiaries.find((b) => b.id === Number(id) || b.rationCardNumber === id);
  }

  getInventory(filters = {}) {
    let list = [...this.state.inventory];
    if (filters.locationType) {
      list = list.filter((i) => i.locationType === filters.locationType);
    }
    if (filters.locationId) {
      list = list.filter((i) => i.locationId === Number(filters.locationId));
    }
    return list;
  }

  getDispatches(filters = {}) {
    let list = [...this.state.dispatches];
    if (filters.status) {
      list = list.filter((d) => d.status === filters.status);
    }
    if (filters.shopCode) {
      list = list.filter((d) => d.destinationShopCode === filters.shopCode);
    }
    return list;
  }

  getReceipts() {
    // Generate receipt views from dispatches that have arrived or been received
    return this.state.dispatches
      .filter((d) => d.actualQuantityReceived !== null || d.status === 'PARTIALLY_RECEIVED' || d.status === 'DELIVERED')
      .map((d) => ({
        id: d.id,
        dispatchId: d.id,
        dispatchCode: d.dispatchCode,
        shopId: d.destinationShopId,
        shopCode: d.destinationShopCode,
        shopName: d.destinationShopName,
        godownName: d.sourceWarehouseName,
        grainTypeName: d.grainTypeName,
        quantityDispatched: d.quantityDispatched,
        quantityReceived: d.actualQuantityReceived,
        shortageQuantity: d.shortageQuantity || 0.0,
        receiptDate: d.deliveredDate || d.dispatchDate,
        receivedBy: d.receiptConfirmedBy || 'Authorized Dealer',
        remarks: d.remarks,
        status: d.shortageQuantity > 0 ? 'DISCREPANCY_FLAGGED' : 'CONFIRMED',
      }));
  }

  getDistributions(filters = {}) {
    let list = [...this.state.distributions];
    if (filters.shopCode) {
      list = list.filter((d) => d.shopCode === filters.shopCode);
    }
    if (filters.beneficiaryId) {
      list = list.filter((d) => d.beneficiaryId === Number(filters.beneficiaryId));
    }
    return list;
  }

  getAlerts(filters = {}) {
    let list = [...this.state.alerts];
    if (filters.status) {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters.severity) {
      list = list.filter((a) => a.severity === filters.severity);
    }
    return list;
  }

  getAlertById(id) {
    return this.state.alerts.find((a) => a.id === Number(id) || a.alertCode === id);
  }

  getDocuments() {
    return [...(this.state.documents || [])];
  }

  getAuditLogs() {
    return [...this.state.auditLogs];
  }

  getComplaints() {
    return [...this.state.complaints];
  }

  // --- MUTATION METHODS (SIMULATED BUSINESS LOGIC) ---

  // 1. Create Dispatch from Warehouse
  createDispatch(dispatchData) {
    const newId = this.state.dispatches.length + 1;
    const dispatchCode = dispatchData.dispatchCode || `DISP-SAN-${1000 + newId}`;
    const qty = Number(dispatchData.quantityDispatched || 3000);

    // Validate warehouse stock
    const whInv = this.state.inventory.find(
      (i) =>
        i.locationType === 'GODOWN' &&
        i.locationId === Number(dispatchData.godownId || 1) &&
        i.grainTypeId === Number(dispatchData.grainTypeId || 1)
    );

    if (whInv && whInv.availableStockKg < qty) {
      throw new Error(`Insufficient warehouse stock! Available: ${whInv.availableStockKg} KG, Requested: ${qty} KG.`);
    }

    // Deduct stock from warehouse
    if (whInv) {
      whInv.availableStockKg -= qty;
      whInv.dispatchedStockKg = (whInv.dispatchedStockKg || 0) + qty;
      whInv.lastUpdated = new Date().toISOString();
    }

    const shop = this.state.fpsShops.find((s) => s.id === Number(dispatchData.rationShopId || 1));
    const wh = this.state.warehouses.find((w) => w.id === Number(dispatchData.godownId || 1));

    const newDispatch = {
      id: newId,
      dispatchCode,
      sourceWarehouseId: wh?.id || 1,
      sourceWarehouseCode: wh?.warehouseCode || 'WH-SAN-001',
      sourceWarehouseName: wh?.name || 'Sangli Central Grain Godown #1',
      destinationShopId: shop?.id || 1,
      destinationShopCode: shop?.shopCode || 'FPS-BED-001',
      destinationShopName: shop?.shopName || 'Bedag Seva Fair Price Store #1',
      destinationVillage: shop?.village || 'Bedag',
      transporterId: 4,
      transporterName: 'Arjun Patil (Krishna Valley Logistics)',
      vehicleNumber: dispatchData.vehicleNumber || 'MH-10-AZ-5542',
      grainTypeId: Number(dispatchData.grainTypeId || 1),
      grainTypeName: Number(dispatchData.grainTypeId || 1) === 1 ? 'Fortified Rice (Raw & Parboiled)' : 'Sharbati Quality Wheat Grain',
      quantityDispatched: qty,
      actualQuantityReceived: null,
      shortageQuantity: null,
      shortagePercentage: null,
      weighbridgeGrossKg: Number(dispatchData.weighbridgeGrossKg || 12250),
      weighbridgeTareKg: Number(dispatchData.weighbridgeTareKg || 9250),
      status: 'IN_TRANSIT',
      discrepancyStatus: 'PENDING_DELIVERY',
      dispatchDate: new Date().toISOString(),
      deliveredDate: null,
      receiptConfirmedBy: null,
      remarks: dispatchData.remarks || 'Outbound grain consignment issued with electronic seal.',
      sealNumber: `SEAL-SAN-${Math.floor(1000 + Math.random() * 9000)}-K1`,
      sealIntactAtArrival: null,
    };

    this.state.dispatches.unshift(newDispatch);

    // Add Audit Log
    this.addAuditLog({
      operator: 'Santosh Gaikwad (warehouse.demo@example.com)',
      role: 'WAREHOUSE_MANAGER',
      action: 'DISPATCH_CREATED',
      entityType: 'GRAIN_DISPATCH',
      entityId: dispatchCode,
      details: `Generated waybill for ${qty.toLocaleString()} KG grain to ${shop?.shopName}.`,
    });

    this.saveState();
    return newDispatch;
  }

  // 2. Update Dispatch Status (Transporter Workflow)
  updateDispatchStatus(dispatchId, newStatus, notes = '') {
    const dispatch = this.state.dispatches.find((d) => d.id === Number(dispatchId) || d.dispatchCode === dispatchId);
    if (!dispatch) throw new Error('Dispatch record not found');

    dispatch.status = newStatus;
    if (newStatus === 'ARRIVED') {
      dispatch.status = 'RECEIPT_PENDING';
      dispatch.deliveredDate = new Date().toISOString();
      dispatch.sealIntactAtArrival = true;
    }
    if (notes) {
      dispatch.remarks = `${dispatch.remarks} | Note: ${notes}`;
    }

    this.addAuditLog({
      operator: 'Arjun Patil (transporter.demo@example.com)',
      role: 'TRANSPORTER',
      action: `TRANSIT_STATUS_${newStatus}`,
      entityType: 'GRAIN_DISPATCH',
      entityId: dispatch.dispatchCode,
      details: `Transit milestone updated to ${newStatus}. ${notes}`,
    });

    this.saveState();
    return dispatch;
  }

  // 3. Confirm FPS Receipt (Dealer Weighment & Discrepancy Calculation)
  confirmReceipt(receiptData) {
    const dispatch = this.state.dispatches.find(
      (d) => d.id === Number(receiptData.dispatchId) || d.dispatchCode === receiptData.dispatchCode
    );
    if (!dispatch) throw new Error('Dispatch consignment not found');

    const received = Number(receiptData.quantityReceived);
    if (received < 0) throw new Error('Received quantity cannot be negative');

    const dispatched = Number(dispatch.quantityDispatched);
    const shortage = Math.max(0, dispatched - received);
    const shortagePct = dispatched > 0 ? ((shortage / dispatched) * 100).toFixed(1) : 0;

    dispatch.actualQuantityReceived = received;
    dispatch.shortageQuantity = shortage;
    dispatch.shortagePercentage = Number(shortagePct);
    dispatch.deliveredDate = new Date().toISOString();
    dispatch.receiptConfirmedBy = receiptData.receivedBy || 'Suresh Patil (fps.demo@example.com)';
    dispatch.remarks = receiptData.remarks || (shortage > 0 ? `Transit shortage of ${shortage} KG recorded upon unloading.` : 'Full delivery received.');
    dispatch.status = shortage > 0 ? 'PARTIALLY_RECEIVED' : 'DELIVERED';
    dispatch.discrepancyStatus = shortage > 0 ? 'DISCREPANCY_FLAGGED' : 'NORMAL';

    // Credit inventory to FPS shop
    const shopInv = this.state.inventory.find(
      (i) =>
        i.locationType === 'RATION_SHOP' &&
        i.locationId === dispatch.destinationShopId &&
        i.grainTypeId === dispatch.grainTypeId
    );

    if (shopInv) {
      shopInv.availableStockKg += received;
      shopInv.incomingStockKg = (shopInv.incomingStockKg || 0) + received;
      shopInv.lastUpdated = new Date().toISOString();
    }

    // Trigger Anomaly Alert if shortage exceeds 1.0% or 50 KG
    if (shortage >= 50.0 || Number(shortagePct) > 1.0) {
      const newAlert = {
        id: this.state.alerts.length + 1,
        alertCode: `ALT-SAN-2026-${String(this.state.alerts.length + 1).padStart(3, '0')}`,
        alertType: 'STOCK_DISCREPANCY',
        title: `Transit Shortage on Delivery ${dispatch.dispatchCode}`,
        severity: 'HIGH',
        status: 'OPEN',
        relatedEntity: 'DISPATCH',
        relatedWarehouseCode: dispatch.sourceWarehouseCode,
        relatedShopCode: dispatch.destinationShopCode,
        relatedShopName: dispatch.destinationShopName,
        village: dispatch.destinationVillage,
        district: 'Sangli',
        description: `Shipment ${dispatch.dispatchCode} arrived with a shortage of ${shortage} KG (${shortagePct}%). Dispatched: ${dispatched} KG, Received: ${received} KG. Exceeds NFSA statutory tolerance limit.`,
        detectionDate: new Date().toISOString(),
        detectedBy: 'AI Weighbridge Reconciliation Engine',
        assignedReviewer: 'Anand Kulkarni (DSO Sangli)',
        investigationNotes: 'Automated alert generated upon dealer receipt confirmation.',
        riskImpactScore: 80.0,
        escalationStatus: 'UNDER_DISTRICT_REVIEW',
      };
      this.state.alerts.unshift(newAlert);
    }

    // Add Audit Log
    this.addAuditLog({
      operator: dispatch.receiptConfirmedBy,
      role: 'FPS_OWNER',
      action: shortage > 0 ? 'RECEIPT_DISCREPANCY_RECORDED' : 'RECEIPT_CONFIRMED',
      entityType: 'GRAIN_RECEIPT',
      entityId: dispatch.dispatchCode,
      details: `Weighbridge receipt logged: Received ${received} KG vs Dispatched ${dispatched} KG. Shortage: ${shortage} KG.`,
    });

    this.saveState();
    return dispatch;
  }

  // 4. Record Distribution at FPS (e-PoS Point-of-Sale to Beneficiary)
  recordDistribution(distData) {
    const beneficiary = this.state.beneficiaries.find(
      (b) => b.id === Number(distData.beneficiaryId) || b.rationCardNumber === distData.rationCardNumber
    );
    if (!beneficiary) throw new Error('Beneficiary record not found in registered database');

    const qty = Number(distData.quantityKg || distData.quantity || 10);
    const grainTypeId = Number(distData.grainTypeId || 1);
    const shopId = Number(distData.rationShopId || distData.shopId || beneficiary.assignedShopId);

    // Validate shop stock
    const shopInv = this.state.inventory.find(
      (i) => i.locationType === 'RATION_SHOP' && i.locationId === shopId && i.grainTypeId === grainTypeId
    );

    if (shopInv && shopInv.availableStockKg < qty) {
      throw new Error(`Insufficient shop stock! Available: ${shopInv.availableStockKg} KG, Requested: ${qty} KG.`);
    }

    // Validate beneficiary quota
    if (grainTypeId === 1 && beneficiary.remainingRiceKg < qty) {
      throw new Error(`Exceeds beneficiary quota! Remaining Rice entitlement: ${beneficiary.remainingRiceKg} KG.`);
    }
    if (grainTypeId === 2 && beneficiary.remainingWheatKg < qty) {
      throw new Error(`Exceeds beneficiary quota! Remaining Wheat entitlement: ${beneficiary.remainingWheatKg} KG.`);
    }

    // Deduct stock from shop
    if (shopInv) {
      shopInv.availableStockKg -= qty;
      shopInv.dispatchedStockKg = (shopInv.dispatchedStockKg || 0) + qty;
      shopInv.lastUpdated = new Date().toISOString();
    }

    // Update beneficiary quota
    if (grainTypeId === 1) {
      beneficiary.collectedRiceKg += qty;
      beneficiary.remainingRiceKg = Math.max(0, beneficiary.remainingRiceKg - qty);
    } else {
      beneficiary.collectedWheatKg += qty;
      beneficiary.remainingWheatKg = Math.max(0, beneficiary.remainingWheatKg - qty);
    }
    beneficiary.lastDistributionDate = new Date().toISOString().split('T')[0];

    const shop = this.state.fpsShops.find((s) => s.id === shopId);
    const rate = grainTypeId === 1 ? 3.0 : 2.0;
    const txCode = distData.transactionCode || `TX-SAN-DIST-${Math.floor(100 + Math.random() * 900)}`;

    const newTx = {
      id: this.state.distributions.length + 1,
      transactionCode: txCode,
      beneficiaryId: beneficiary.id,
      beneficiaryName: beneficiary.name,
      rationCardNumber: beneficiary.rationCardNumber,
      cardType: beneficiary.cardType,
      shopId,
      shopCode: shop?.shopCode || beneficiary.assignedShopCode,
      shopName: shop?.shopName || beneficiary.assignedShopName,
      village: beneficiary.village,
      grainTypeId,
      grainTypeName: grainTypeId === 1 ? 'Fortified Rice (Raw & Parboiled)' : 'Sharbati Quality Wheat Grain',
      quantityKg: qty,
      subsidizedRatePerKg: rate,
      totalAmountPaid: qty * rate,
      distributionDate: new Date().toISOString(),
      operatorId: distData.operatorId || 'fps.demo@example.com',
      biometricVerificationMode: distData.biometricMode || 'Aadhaar Biometric Fingerprint (Match 98%)',
      posTerminalCode: 'POS-SAN-BED-01',
      status: 'COMPLETED',
    };

    this.state.distributions.unshift(newTx);

    // Add Audit Log
    this.addAuditLog({
      operator: newTx.operatorId,
      role: 'FPS_OWNER',
      action: 'DISTRIBUTION_COMPLETED',
      entityType: 'DISTRIBUTION',
      entityId: txCode,
      details: `Issued ${qty} KG ${newTx.grainTypeName} to ${beneficiary.name} (${beneficiary.rationCardNumber}). Paid: ₹${newTx.totalAmountPaid}.`,
    });

    this.saveState();
    return newTx;
  }

  // 5. Update Alert Review & Investigation
  updateAlert(alertId, updateData) {
    const alert = this.state.alerts.find((a) => a.id === Number(alertId) || a.alertCode === alertId);
    if (!alert) throw new Error('Alert not found');

    if (updateData.status) alert.status = updateData.status;
    if (updateData.notes) {
      alert.investigationNotes = `${alert.investigationNotes || ''} | [Update ${new Date().toLocaleDateString()}]: ${updateData.notes}`;
    }
    if (updateData.escalationStatus) alert.escalationStatus = updateData.escalationStatus;

    this.addAuditLog({
      operator: 'Anand Kulkarni (officer.demo@example.com)',
      role: 'DISTRICT_OFFICER',
      action: 'ALERT_INVESTIGATION_UPDATED',
      entityType: 'ALERT',
      entityId: alert.alertCode,
      details: `Investigation status changed to ${alert.status}. Note: ${updateData.notes || 'Status updated'}`,
    });

    this.saveState();
    return alert;
  }

  // 6. Submit Citizen Grievance
  submitComplaint(complaintData) {
    const newId = `GRV-SAN-2026-${String(this.state.complaints.length + 82).padStart(3, '0')}`;
    const newComplaint = {
      id: newId,
      beneficiaryId: complaintData.beneficiaryId || 1,
      beneficiaryName: complaintData.beneficiaryName || 'Tukaram Shinde',
      rationCard: complaintData.rationCard || 'RC-SAN-AAY-1001',
      village: complaintData.village || 'Bedag',
      shopCode: complaintData.shopCode || 'FPS-BED-001',
      shopName: complaintData.shopCode === 'FPS-BED-001' ? 'Bedag Seva Fair Price Store #1' : 'Jai Kisan Ration Kendra Bedag',
      category: complaintData.category || 'WEIGHMENT_SHORTAGE',
      categoryLabel: (complaintData.category || 'WEIGHMENT_SHORTAGE').replace(/_/g, ' '),
      description: complaintData.description || 'Grievance submitted by citizen beneficiary.',
      date: new Date().toISOString(),
      status: 'UNDER_INVESTIGATION',
      priority: 'HIGH',
      assignedOfficer: 'Anand Kulkarni (DSO Sangli)',
      officerNotes: 'Automated complaint ticket registered. Dispatched to Taluka Supply Officer.',
    };

    this.state.complaints.unshift(newComplaint);

    this.addAuditLog({
      operator: newComplaint.beneficiaryName,
      role: 'BENEFICIARY',
      action: 'GRIEVANCE_REGISTERED',
      entityType: 'COMPLAINT',
      entityId: newId,
      details: `Registered complaint against ${newComplaint.shopCode} for ${newComplaint.categoryLabel}.`,
    });

    this.saveState();
    return newComplaint;
  }

  // 7. Ingest Policy Document
  ingestDocument(docData) {
    const newDoc = {
      id: (this.state.documents?.length || 0) + 1,
      title: docData.title,
      documentType: docData.documentType || 'PDS_CIRCULAR',
      source: docData.source || 'District Supply Office Sangli',
      version: docData.version || '2026.1',
      effectiveDate: new Date().toISOString().split('T')[0],
      totalChunks: Math.max(4, Math.ceil((docData.content?.length || 500) / 180)),
      content: docData.content || '',
    };
    if (!this.state.documents) this.state.documents = [];
    this.state.documents.unshift(newDoc);
    this.addAuditLog({
      operator: 'Anand Kulkarni (officer.demo@example.com)',
      role: 'DISTRICT_OFFICER',
      action: 'POLICY_DOCUMENT_INGESTED',
      entityType: 'POLICY_DOCUMENT',
      entityId: `DOC-${newDoc.id}`,
      details: `Indexed "${newDoc.title}" (${newDoc.totalChunks} chunks) for RAG AI grounding.`,
    });
    this.saveState();
    return newDoc;
  }

  // 8. Execute AI Audit on Shop
  runAiAudit(shopId) {
    const shop = this.state.fpsShops.find((s) => s.id === Number(shopId) || s.shopCode === shopId) || this.state.fpsShops[0];
    const shopDispatches = this.state.dispatches.filter((d) => d.destinationShopId === shop.id || d.destinationShopCode === shop.shopCode);
    const shopDistributions = this.state.distributions.filter((d) => d.shopId === shop.id || d.shopCode === shop.shopCode);
    const shopAlerts = this.state.alerts.filter((a) => a.relatedShopCode === shop.shopCode || a.relatedShopName === shop.shopName);

    const hasShortageDispatch = shopDispatches.find((d) => (d.shortageQuantity || 0) > 0);
    const shortageNote = hasShortageDispatch
      ? `• Discrepancy Flag: Shipment ${hasShortageDispatch.dispatchCode} manifested a transit shortage of ${hasShortageDispatch.shortageQuantity} KG (${hasShortageDispatch.shortagePercentage}%). Permissible NFSA tolerance is 1.0% or 50 KG.`
      : `• Transit Dispatches: All ${shopDispatches.length} recent waybills delivered within statutory tare limits.`;

    const surgeNote = shop.riskScore >= 70
      ? `• Distribution Velocity: Observed +73.3% distribution surge within 48 hours of delivery at ${shop.shopName}, with rapid quota liquidation outside normal business hours.`
      : `• Distribution Velocity: Steady disbursals across active ration cards in ${shop.village}.`;

    const reportText = `GRAINGUARD AI AUDIT INSPECTION REPORT — MIRAJ SUB-DIVISION, SANGLI
Target Entity: ${shop.shopName} (${shop.shopCode})
Village: ${shop.village} (Pincode: ${shop.pincode}) | Dealer: ${shop.ownerName}
License: ${shop.licenseNumber} | Assigned Cardholders: ${shop.assignedCardholders}

1. EXECUTIVE SUMMARY & RISK CLASSIFICATION:
Composite AI Anomaly Risk Score: ${shop.riskScore} / 100 (${shop.riskScore >= 70 ? 'HIGH RISK — VIGILANCE SCRUTINY REQUIRED' : 'NORMAL COMPLIANCE'}).
Target shop ${shop.riskScore >= 70 ? 'exhibits concurrent anomalies across physical weighbridge receipt and distribution disbursal velocity' : 'is currently operating within acceptable operational bounds'}.

2. FORENSIC TRANSACTION EVIDENCE:
${shortageNote}
${surgeNote}
• Biometric Compliance: 94.2% e-PoS fingerprint authentication rate. 3 manual override transactions logged.
• Active System Alerts: ${shopAlerts.length} anomaly incident(s) registered on central vigilance ledger.

3. STATUTORY GROUNDING (POLICY CITATIONS):
- National Food Security Act (NFSA) 2013, Schedule I: Statutory allocation entitlements (AAY: 35 kg/family, PHH: 5 kg/member).
- Maharashtra GR No. PDS-2024/CR-88/CS-21: Regulates authorized central issue prices (Rice ₹3/kg, Wheat ₹2/kg).
- Maharashtra PDS Inspection Manual, Section 1.2: Mandatory weighbridge discrepancy logging protocol.

4. ADVISORY RECOMMENDATIONS FOR DISTRICT SUPPLY OFFICER:
${shop.riskScore >= 70
  ? `1. Issue Section 30 Show-Cause Notice to dealer ${shop.ownerName}.
2. Taluka Supply Officer Vandana Patil must conduct unannounced physical verification of physical grain sacks against digital balance.
3. Request electronic seal inspection logs from carrier vehicle MH-10-AZ-5542.`
  : `1. Continue routine periodic monitoring.
2. Confirm monthly weighbridge digital calibration certificate.`}

Notice: This report is an AI-assisted diagnostic finding intended for authorized civil supplies officers. Formal regulatory sanctions require human officer inspection pursuant to Section 30 of the PDS Control Order.`;

    this.addAuditLog({
      operator: 'GrainGuard AI Audit Engine v2.4',
      role: 'SYSTEM_AUDITOR',
      action: 'AI_AUDIT_EXECUTED',
      entityType: 'RATION_SHOP',
      entityId: shop.shopCode,
      details: `Generated AI audit inspection report for ${shop.shopName}. Risk Score: ${shop.riskScore}/100.`,
    });

    this.saveState();

    return {
      shopId: shop.id,
      shopCode: shop.shopCode,
      shopName: shop.shopName,
      riskScore: shop.riskScore,
      auditTimestamp: new Date().toISOString(),
      reportText,
      activeAlertsCount: shopAlerts.length,
    };
  }

  // Helper to add tamper-evident audit logs
  addAuditLog({ operator, role, action, entityType, entityId, details }) {
    const newLog = {
      id: this.state.auditLogs.length + 1,
      timestamp: new Date().toISOString(),
      operator,
      role,
      action,
      entityType,
      entityId,
      details,
      hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      verificationStatus: 'TAMPER_VERIFIED',
    };
    this.state.auditLogs.unshift(newLog);
  }
}

export const mockStore = new MockStore();
