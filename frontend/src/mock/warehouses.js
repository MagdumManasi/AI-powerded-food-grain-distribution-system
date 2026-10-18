// Warehouses / Godowns located in Sangli District (Demo Dataset)

export const MOCK_WAREHOUSES = [
  {
    id: 1,
    warehouseCode: 'WH-SAN-001',
    name: 'Sangli Central Grain Godown #1',
    district: 'Sangli',
    taluka: 'Miraj',
    address: 'Plot 42, Kupwad Industrial Area, Sangli (416436)',
    managerName: 'Santosh Gaikwad',
    managerEmail: 'warehouse.demo@example.com',
    contactNumber: '0233-2644120',
    capacityKg: 100000.0, // 100 MT
    currentStockKg: 78500.0,
    riceStockKg: 46500.0,
    wheatStockKg: 32000.0,
    status: 'ACTIVE',
    linkedFpsCount: 28,
    weighbridgeStatus: 'CALIBRATED_VERIFIED',
    lastCalibrationDate: '2026-10-01',
  },
  {
    id: 2,
    warehouseCode: 'WH-SAN-002',
    name: 'Miraj Buffer Grain Depot',
    district: 'Sangli',
    taluka: 'Miraj',
    address: 'Survey 118, MIDC Complex, Miraj (416410)',
    managerName: 'Dhananjay Mane',
    managerEmail: 'dhananjay.mane@grainguard.demo',
    contactNumber: '0233-2221450',
    capacityKg: 80000.0, // 80 MT
    currentStockKg: 54000.0,
    riceStockKg: 31000.0,
    wheatStockKg: 23000.0,
    status: 'ACTIVE',
    linkedFpsCount: 22,
    weighbridgeStatus: 'CALIBRATED_VERIFIED',
    lastCalibrationDate: '2026-09-25',
  },
];
