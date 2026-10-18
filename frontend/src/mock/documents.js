// Statutory PDS Circulars, Inspection Procedures, and RAG Policy Documents

export const MOCK_DOCUMENTS = [
  {
    id: 1,
    title: 'NFSA Transit Shortage & Tare Tolerance Standard (v2024.1)',
    documentType: 'INSPECTION_GUIDELINE',
    source: 'Ministry of Consumer Affairs, Food & Public Distribution',
    version: '2024.1',
    effectiveDate: '2024-01-01',
    totalChunks: 14,
    content: `Section 1.2: Permissible Moisture, Handling, and In-Transit Tare Loss Limits.
Under statutory NFSA distribution rules, bulk grain transit between Central/State Warehouses (Godowns) and Fair Price Shops (FPS) allows a maximum in-transit variance tolerance of 1.0% or 50.0 KG (whichever is lower). Any shipment discrepancy exceeding this threshold (e.g. >= 150 KG) must be flagged automatically by the electronic weighbridge verification engine as an Anomaly Alert (STOCK_DISCREPANCY). The District Supply Officer (DSO) must inspect carrier seal integrity and calibrate weighbridges prior to approving subsequent quota sanctions.`,
  },
  {
    id: 2,
    title: 'Maharashtra Government Resolution No. PDS-2024/CR-88/CS-21 (Subsidized Central Issue Prices)',
    documentType: 'ALLOCATION_POLICY',
    source: 'Food, Civil Supplies and Consumer Protection Dept, Govt of Maharashtra',
    version: '2024.2',
    effectiveDate: '2024-04-01',
    totalChunks: 28,
    content: `Government Resolution No. PDS-2024/CR-88/CS-21 governs Central Issue Prices and monthly scale of distribution across Maharashtra State.
1. Antyodaya Anna Yojana (AAY): Scale of issue is 35 KG foodgrains per family per month (consisting of 20 KG Fortified Rice @ ₹3.00/kg and 15 KG Quality Wheat @ ₹2.00/kg).
2. Priority Households (PHH): Scale of issue is 5 KG foodgrains per person per month (3 KG Fortified Rice @ ₹3.00/kg and 2 KG Quality Wheat @ ₹2.00/kg).
All disbursements must be processed strictly through biometric authentication via e-PoS devices. Disbursals exceeding prescribed quotas or executed during non-operational hours are flagged for supervisory review.`,
  },
  {
    id: 3,
    title: 'Maharashtra PDS Fair Price Shop Weighbridge & Electronic Seal Inspection SOP',
    documentType: 'AUDIT_MANUAL',
    source: 'Department of Food & Civil Supplies, Maharashtra State',
    version: '2023.4',
    effectiveDate: '2023-11-15',
    totalChunks: 19,
    content: `Standard Operating Procedure for Delivery Unloading at Fair Price Shops.
1. Electronic Transit Seal: Upon truck arrival at the FPS premises, the dealer must inspect the electronic security seal (e.g., SEAL-SAN-XXXX) before cutting. If the seal is broken or tampered with, receipt must not be signed.
2. Gross Tare Weighment: Weighment of loaded carrier vehicle followed by tare weighment after unloading. Both weights must be registered on the digital weighbridge.
3. Discrepancy Protocol: If shortage exceeds permissible limits, dealer must record a PARTIALLY_RECEIVED receipt with actual weighbridge reading, generating an instantaneous system alert.`,
  },
  {
    id: 4,
    title: 'Sangli District Vigilance Committee Protocol for Grain Diversion Audits',
    documentType: 'PDS_CIRCULAR',
    source: 'Collectorate & District Supply Office, Sangli',
    version: '2024.1',
    effectiveDate: '2024-06-10',
    totalChunks: 12,
    content: `Sangli District Supply Office Directive for Miraj Sub-Division:
Dealers operating within Sangli District, including Miraj Taluka (Bedag and Belanki clusters), exhibiting inventory divergence, distribution velocity spikes (>50% surge within 48 hours of delivery), or citizen weighment grievances are subject to mandatory Section 30 spot inspections by the Taluka Supply Officer. Physical bag counts and electronic point-of-sale audit dumps must be cross-referenced with Central Godown dispatch manifests.`,
  },
];
