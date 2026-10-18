export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DISTRICT_OFFICER: 'DISTRICT_OFFICER',
  WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
  TRANSPORTER: 'TRANSPORTER',
  FPS_OWNER: 'FPS_OWNER',
  BENEFICIARY: 'BENEFICIARY',
  AUDITOR: 'AUDITOR',
};

export const ROLE_PROFILES = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    name: 'Dr. Sunita Deshmukh, IAS',
    title: 'State Food & Civil Supplies Commissioner',
    email: 'admin.demo@example.com',
    phone: '9876543210',
    clearanceLevel: 'Apex State Command (Maharashtra)',
    jurisdiction: {
      level: 'STATE',
      state: 'Maharashtra',
      district: 'All 36 Districts',
      activeLocalities: 'Sangli District (Miraj Taluka - Bedag & Belanki)',
      districtsCount: 36,
      talukasCount: 358,
      fpsCount: 52400,
      activeGodowns: 420,
    },
    badgeColor: 'emerald',
    icon: '👑',
  },
  DISTRICT_OFFICER: {
    role: 'DISTRICT_OFFICER',
    name: 'Anand Kulkarni',
    title: 'District Supply Officer (DSO, Sangli)',
    email: 'officer.demo@example.com',
    phone: '9876543211',
    clearanceLevel: 'District Administration Clearance',
    jurisdiction: {
      level: 'DISTRICT',
      state: 'Maharashtra',
      district: 'Sangli',
      talukasCount: 10,
      monitoredTaluka: 'Miraj',
      monitoredVillages: 'Bedag & Belanki',
      fpsCount: 1480,
      activeGodowns: 6,
    },
    badgeColor: 'emerald',
    icon: '👮',
  },
  WAREHOUSE_MANAGER: {
    role: 'WAREHOUSE_MANAGER',
    name: 'Santosh Gaikwad',
    title: 'Central Godown Superintendent',
    email: 'warehouse.demo@example.com',
    phone: '9822011244',
    clearanceLevel: 'Warehouse & Grain Depot Clearance',
    jurisdiction: {
      level: 'WAREHOUSE',
      state: 'Maharashtra',
      district: 'Sangli',
      taluka: 'Miraj',
      warehouseCode: 'WH-SAN-001',
      warehouseName: 'Sangli Central Grain Godown #1',
      storageCapacityKg: 100000,
      currentStockKg: 78500,
      linkedShopsCount: 28,
    },
    badgeColor: 'sky',
    icon: '🏭',
  },
  TRANSPORTER: {
    role: 'TRANSPORTER',
    name: 'Arjun Patil',
    title: 'PDS Fleet Logistics Operator',
    email: 'transporter.demo@example.com',
    phone: '9822011223',
    clearanceLevel: 'Transit Logistics & Fleet Telematics',
    jurisdiction: {
      level: 'TRANSIT',
      company: 'Krishna Valley Agro Logistics',
      vehicleNumber: 'MH-10-AZ-5542',
      vehicleType: '16-Wheeler Commercial Carrier',
      assignedRoute: 'Sangli Central Godown (WH-SAN-001) -> Bedag & Belanki FPS Cluster',
      activeWaybill: 'DISP-SAN-1002',
    },
    badgeColor: 'amber',
    icon: '🚚',
  },
  FPS_OWNER: {
    role: 'FPS_OWNER',
    name: 'Suresh Patil',
    title: 'Fair Price Shop Licensee (Dealer)',
    email: 'fps.demo@example.com',
    phone: '9876543212',
    clearanceLevel: 'Village e-PoS Point-of-Sale Terminal',
    jurisdiction: {
      level: 'FPS',
      state: 'Maharashtra',
      district: 'Sangli',
      taluka: 'Miraj',
      village: 'Bedag',
      shopCode: 'FPS-BED-001',
      shopName: 'Bedag Seva Fair Price Store #1',
      address: 'Main Bazaar Road, Near Gram Panchayat, Bedag (416410)',
      enrolledRationCards: 420,
      status: 'UNDER_REVIEW', // Discrepancy scenario
      riskScore: 75.0,
    },
    badgeColor: 'purple',
    icon: '🏪',
  },
  BENEFICIARY: {
    role: 'BENEFICIARY',
    name: 'Tukaram Shinde',
    title: 'NFSA Antyodaya Ration Cardholder',
    email: 'beneficiary.demo@example.com',
    phone: '9876543299',
    clearanceLevel: 'Citizen Beneficiary Passbook',
    jurisdiction: {
      level: 'CITIZEN',
      state: 'Maharashtra',
      district: 'Sangli',
      taluka: 'Miraj',
      village: 'Bedag',
      rationCardNumber: 'RC-SAN-AAY-1001',
      scheme: 'Antyodaya Anna Yojana (AAY)',
      familyMembersCount: 4,
      assignedShopCode: 'FPS-BED-001',
      assignedShopName: 'Bedag Seva Fair Price Store #1',
      monthlyEntitlement: '35 KG Grain (20 KG Rice + 15 KG Wheat)',
    },
    badgeColor: 'green',
    icon: '🌾',
  },
  AUDITOR: {
    role: 'AUDITOR',
    name: 'Priya Nair',
    title: 'Senior Statutory & Vigilance Auditor',
    email: 'auditor.demo@example.com',
    phone: '9876543214',
    clearanceLevel: 'Independent Forensic Inspection Audit',
    jurisdiction: {
      level: 'AUDIT',
      state: 'Maharashtra',
      commission: 'State Food Commission Vigilance Directorate',
      inspectionRadius: 'Sangli District Grain Corridor',
      flaggedCasesCount: 3,
    },
    badgeColor: 'rose',
    icon: '⚖️',
  },
};

// Map backend or mock email/role strings to standardized 7 roles
export const normalizeRole = (roleStr, email = '') => {
  if (!roleStr && !email) return ROLES.DISTRICT_OFFICER;
  const upperRole = (roleStr || '').toUpperCase();
  const lowerEmail = (email || '').toLowerCase();

  if (upperRole === 'SUPER_ADMIN' || upperRole === 'ADMIN' || lowerEmail.includes('admin')) {
    return ROLES.SUPER_ADMIN;
  }
  if (upperRole === 'DISTRICT_OFFICER' || upperRole === 'OFFICER' || lowerEmail.includes('officer')) {
    return ROLES.DISTRICT_OFFICER;
  }
  if (upperRole === 'WAREHOUSE_MANAGER' || upperRole === 'GODOWN_MANAGER' || lowerEmail.includes('warehouse')) {
    return ROLES.WAREHOUSE_MANAGER;
  }
  if (upperRole === 'TRANSPORTER' || lowerEmail.includes('transporter')) {
    return ROLES.TRANSPORTER;
  }
  if (upperRole === 'FPS_OWNER' || lowerEmail.includes('fps')) {
    return ROLES.FPS_OWNER;
  }
  if (upperRole === 'BENEFICIARY' || upperRole === 'CITIZEN' || lowerEmail.includes('beneficiary')) {
    return ROLES.BENEFICIARY;
  }
  if (upperRole === 'AUDITOR' || lowerEmail.includes('auditor')) {
    return ROLES.AUDITOR;
  }

  return ROLES.DISTRICT_OFFICER;
};
