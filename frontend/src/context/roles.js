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
    email: 'admin@grainguard.gov.in',
    phone: '9876543210',
    clearanceLevel: 'State Master Command (Apex)',
    jurisdiction: {
      level: 'STATE',
      state: 'Maharashtra',
      districtsCount: 36,
      talukasCount: 358,
      fpsCount: 52400,
      beneficiariesCount: '7.02 Crore',
      activeGodowns: 420,
    },
    badgeColor: 'emerald',
    icon: '👑',
  },
  DISTRICT_OFFICER: {
    role: 'DISTRICT_OFFICER',
    name: 'Officer Rajesh Verma',
    title: 'District Supply Officer (DSO)',
    email: 'officer@grainguard.gov.in',
    phone: '9876543211',
    clearanceLevel: 'District Administration Clearance',
    jurisdiction: {
      level: 'DISTRICT',
      state: 'Maharashtra',
      district: 'Pune',
      talukasCount: 14,
      villagesCount: 1860,
      fpsCount: 420,
      beneficiariesCount: '28.4 Lakh',
      activeGodowns: 4,
    },
    badgeColor: 'emerald',
    icon: '👮',
  },
  WAREHOUSE_MANAGER: {
    role: 'WAREHOUSE_MANAGER',
    name: 'Santosh Gaikwad',
    title: 'Godown Depot Manager',
    email: 'warehouse@grainguard.gov.in',
    phone: '9822011244',
    clearanceLevel: 'Taluka Grain Depot Clearance',
    jurisdiction: {
      level: 'TALUKA_GODOWN',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      godownCode: 'GOD-101',
      godownName: 'Central Grain Storage Godown #1',
      storageCapacityKg: 100000,
      currentStockKg: 75000,
      linkedShopsCount: 42,
    },
    badgeColor: 'sky',
    icon: '🏭',
  },
  TRANSPORTER: {
    role: 'TRANSPORTER',
    name: 'Vikram Singh',
    title: 'PDS Fleet Logistics Operator',
    email: 'transporter@grainguard.gov.in',
    phone: '9822011223',
    clearanceLevel: 'Logistics & Transit Clearance',
    jurisdiction: {
      level: 'TRANSIT',
      company: 'Food Logistics Corp (FLC)',
      vehicleNumber: 'MH-12-PQ-9988',
      vehicleType: '16-Wheeler Heavy Commercial Vehicle',
      assignedRoute: 'Central Godown #1 -> Haveli Taluka FPS Cluster',
      activeWaybill: 'DISP-1002',
    },
    badgeColor: 'amber',
    icon: '🚚',
  },
  FPS_OWNER: {
    role: 'FPS_OWNER',
    name: 'Suresh Patil',
    title: 'Fair Price Shop Licensee (Dealer)',
    email: 'fps102@grainguard.gov.in',
    phone: '9876543212',
    clearanceLevel: 'Village Point-of-Sale (e-PoS) Terminal',
    jurisdiction: {
      level: 'FPS',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Hadapsar',
      shopCode: 'FPS102',
      shopName: 'Saraswati Fair Price Store',
      address: '45 Market Yard, Hadapsar',
      enrolledRationCards: 480,
      status: 'UNDER_REVIEW', // flagged in scenario
      riskScore: 75.0,
    },
    badgeColor: 'purple',
    icon: '🏪',
  },
  BENEFICIARY: {
    role: 'BENEFICIARY',
    name: 'Ramesh Kumar',
    title: 'NFSA Ration Card Holder',
    email: 'ramesh.kumar@beneficiary.gov.in',
    phone: '9876543299',
    clearanceLevel: 'Citizen Beneficiary Passbook',
    jurisdiction: {
      level: 'CITIZEN',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Hadapsar',
      rationCardNumber: 'RC-AAY-889901',
      scheme: 'Antyodaya Anna Yojana (AAY)',
      familyMembersCount: 4,
      assignedShopCode: 'FPS102',
      assignedShopName: 'Saraswati Fair Price Store',
      monthlyEntitlement: '35 KG Grain (20 KG Rice + 15 KG Wheat)',
    },
    badgeColor: 'green',
    icon: '🌾',
  },
  AUDITOR: {
    role: 'AUDITOR',
    name: 'Senior Auditor Priya Nair',
    title: 'Vigilance & Statutory Compliance Auditor',
    email: 'auditor@grainguard.gov.in',
    phone: '9876543214',
    clearanceLevel: 'Independent Forensic Inspection Audit',
    jurisdiction: {
      level: 'STATE_AUDIT',
      state: 'Maharashtra',
      commission: 'State Food Commission & Vigilance Cell',
      inspectionRadius: 'All 36 Districts & Buffer Silos',
      flaggedCasesCount: 14,
    },
    badgeColor: 'rose',
    icon: '⚖️',
  },
};

// Map backend legacy role strings (e.g. ADMIN, OFFICER) to standardized 7 roles
export const normalizeRole = (backendRole, email = '') => {
  if (!backendRole) return ROLES.DISTRICT_OFFICER;
  const upper = backendRole.toUpperCase();
  if (upper === 'ADMIN' || upper === 'SUPER_ADMIN') return ROLES.SUPER_ADMIN;
  if (upper === 'OFFICER' || upper === 'DISTRICT_OFFICER') return ROLES.DISTRICT_OFFICER;
  if (upper === 'WAREHOUSE_MANAGER' || upper === 'GODOWN_MANAGER' || email.includes('warehouse')) return ROLES.WAREHOUSE_MANAGER;
  if (upper === 'TRANSPORTER') return ROLES.TRANSPORTER;
  if (upper === 'FPS_OWNER') return ROLES.FPS_OWNER;
  if (upper === 'BENEFICIARY' || upper === 'CITIZEN' || email.includes('beneficiary')) return ROLES.BENEFICIARY;
  if (upper === 'AUDITOR') return ROLES.AUDITOR;
  return ROLES.DISTRICT_OFFICER;
};
