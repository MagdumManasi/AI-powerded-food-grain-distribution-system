// Centralized Geographic Hierarchy for GrainGuard AI Demo
// Hierarchy: STATE (Maharashtra) -> DISTRICT (Sangli) -> TALUKA (Miraj) -> VILLAGES (Bedag, Belanki)

export const GEOGRAPHY = {
  state: {
    code: 'MH',
    name: 'Maharashtra',
    capital: 'Mumbai',
    totalDistricts: 36,
    districts: [
      {
        code: 'SAN',
        name: 'Sangli',
        headquarters: 'Sangli',
        divisionalCommissionerate: 'Pune Division',
        pdsOffice: 'District Supply Office, Sangli Collectorate, Sangli',
        dsoName: 'Shri Anand Kulkarni, Dy. Collector (Supply)',
        totalTalukas: 10,
        totalFpsCount: 1480,
        activeWarehouses: 6,
        totalEnrolledBeneficiaries: '21.4 Lakh',
        talukas: [
          {
            code: 'TAL-MIR',
            name: 'Miraj',
            headquarters: 'Miraj',
            tsoOfficer: 'Smt. Vandana Patil, Tehsildar (Food & Supplies)',
            totalVillages: 64,
            fpsCount: 142,
            monthlyQuotaMT: '3,200 MT',
            status: 'VERIFIED_TALUKA',
            villages: [
              {
                code: 'VIL-BED',
                name: 'Bedag',
                taluka: 'Miraj',
                district: 'Sangli',
                pincode: '416410',
                fpsCount: 2,
                enrolledBeneficiaries: 1450,
                activeCardholders: 420,
                monthlyRequirementKg: 28500,
                status: 'ACTIVE_DEMO_LOCALITY',
              },
              {
                code: 'VIL-BEL',
                name: 'Belanki',
                taluka: 'Miraj',
                district: 'Sangli',
                pincode: '416418',
                fpsCount: 2,
                enrolledBeneficiaries: 1280,
                activeCardholders: 375,
                monthlyRequirementKg: 24800,
                status: 'ACTIVE_DEMO_LOCALITY',
              },
            ],
          },
          {
            code: 'TAL-WAL',
            name: 'Walwa (Islampur)',
            headquarters: 'Islampur',
            totalVillages: 98,
            fpsCount: 180,
            monthlyQuotaMT: '4,100 MT',
            status: 'REFERENCE_TALUKA',
            villages: [],
          },
          {
            code: 'TAL-TAS',
            name: 'Tasgaon',
            headquarters: 'Tasgaon',
            totalVillages: 72,
            fpsCount: 135,
            monthlyQuotaMT: '2,900 MT',
            status: 'REFERENCE_TALUKA',
            villages: [],
          },
          {
            code: 'TAL-JAT',
            name: 'Jat',
            headquarters: 'Jat',
            totalVillages: 115,
            fpsCount: 210,
            monthlyQuotaMT: '4,600 MT',
            status: 'REFERENCE_TALUKA',
            villages: [],
          },
        ],
      },
    ],
  },
};

export const GRAIN_TYPES = [
  { id: 1, code: 'RICE', name: 'Fortified Rice (Raw & Parboiled)', shortName: 'Rice', unit: 'KG', centralIssuePricePerKg: 3.0 },
  { id: 2, code: 'WHEAT', name: 'Sharbati Quality Wheat Grain', shortName: 'Wheat', unit: 'KG', centralIssuePricePerKg: 2.0 },
];
