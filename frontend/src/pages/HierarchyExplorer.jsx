import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Network,
  Building2,
  MapPin,
  Store,
  Users,
  Warehouse,
  Truck,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { GEOGRAPHY } from '../mock/locations';

const HIERARCHY_TREE = {
  state: {
    id: 'MH',
    name: 'Maharashtra',
    code: 'STATE-MH',
    pdsOffices: 36,
    districtsCount: 36,
    activeGodowns: 420,
    totalShops: 52400,
    activeBeneficiaries: '7.02 Crore',
    monthlyQuotaMT: '4,50,000 MT',
    districts: [
      {
        id: 'sangli',
        name: 'Sangli District',
        code: 'DIST-SAN-01',
        dso: 'Shri Anand Kulkarni, Dy. Collector (Supply)',
        talukasCount: 10,
        villagesCount: 730,
        fpsCount: 1480,
        population: '28.2 Lakh',
        riskLevel: 'ELEVATED', // Due to FPS-BED-001 anomaly
        allocatedQuotaMT: '12,500 MT',
        activeGodowns: ['Sangli Central Grain Godown #1 (WH-SAN-001)', 'Miraj Buffer Grain Depot (WH-SAN-002)'],
        talukas: [
          {
            id: 'miraj',
            name: 'Miraj Taluka',
            code: 'TAL-MIR-01',
            talukaOfficer: 'Smt. Vandana Patil, Tehsildar (Food & Supplies)',
            villagesCount: 64,
            fpsCount: 142,
            quotaMT: '3,200 MT',
            status: 'FLAGGED_ANOMALY',
            villages: [
              {
                id: 'bedag',
                name: 'Bedag Village',
                code: 'VIL-BED-01',
                pincode: '416410',
                fpsCount: 2,
                beneficiaries: 1450,
                shops: [
                  {
                    id: 1,
                    shopCode: 'FPS-BED-001',
                    shopName: 'Bedag Seva Fair Price Store #1',
                    dealer: 'Suresh Patil',
                    cardholders: 420,
                    status: 'UNDER_REVIEW',
                    riskScore: 75.0,
                    alert: '150 KG Transit Shortage (DISP-SAN-1002) & +73.3% Volume Spike',
                    beneficiariesList: [
                      { id: 1, name: 'Tukaram Shinde', cardNo: 'RC-SAN-AAY-1001', type: 'AAY', quota: '35 KG', status: 'VERIFIED' },
                      { id: 2, name: 'Pandurang Mane', cardNo: 'RC-SAN-PHH-2002', type: 'PHH', quota: '25 KG', status: 'VERIFIED' },
                      { id: 3, name: 'Sushila Kamble', cardNo: 'RC-SAN-PHH-2003', type: 'PHH', quota: '15 KG', status: 'VERIFIED' },
                      { id: 4, name: 'Mahadev Chavan', cardNo: 'RC-SAN-AAY-1004', type: 'AAY', quota: '35 KG', status: 'VERIFIED' },
                    ],
                  },
                  {
                    id: 2,
                    shopCode: 'FPS-BED-002',
                    shopName: 'Jai Kisan Ration Kendra Bedag',
                    dealer: 'Anand Shinde',
                    cardholders: 380,
                    status: 'ACTIVE',
                    riskScore: 12.0,
                    alert: null,
                    beneficiariesList: [
                      { id: 7, name: 'Babu Sawant', cardNo: 'RC-SAN-AAY-1007', type: 'AAY', quota: '35 KG', status: 'VERIFIED' },
                      { id: 8, name: 'Sunita Bhosale', cardNo: 'RC-SAN-PHH-2008', type: 'PHH', quota: '25 KG', status: 'VERIFIED' },
                      { id: 9, name: 'Maruti Jadhav', cardNo: 'RC-SAN-PHH-2009', type: 'PHH', quota: '20 KG', status: 'VERIFIED' },
                    ],
                  },
                ],
              },
              {
                id: 'belanki',
                name: 'Belanki Village',
                code: 'VIL-BEL-02',
                pincode: '416418',
                fpsCount: 2,
                beneficiaries: 1280,
                shops: [
                  {
                    id: 3,
                    shopCode: 'FPS-BEL-001',
                    shopName: 'Belanki Sahakari FPS Store',
                    dealer: 'Mahesh Kale',
                    cardholders: 390,
                    status: 'ACTIVE',
                    riskScore: 8.5,
                    alert: null,
                    beneficiariesList: [
                      { id: 11, name: 'Appasaheb Patil', cardNo: 'RC-SAN-AAY-1011', type: 'AAY', quota: '35 KG', status: 'VERIFIED' },
                      { id: 12, name: 'Shankar Mali', cardNo: 'RC-SAN-PHH-2012', type: 'PHH', quota: '25 KG', status: 'VERIFIED' },
                      { id: 13, name: 'Kashibai Waghmare', cardNo: 'RC-SAN-AAY-1013', type: 'AAY', quota: '35 KG', status: 'VERIFIED' },
                    ],
                  },
                  {
                    id: 4,
                    shopCode: 'FPS-BEL-002',
                    shopName: 'Belanki Gramin Annapurna Kendra',
                    dealer: 'Savita Jadhav',
                    cardholders: 340,
                    status: 'ACTIVE',
                    riskScore: 14.2,
                    alert: null,
                    beneficiariesList: [
                      { id: 16, name: 'Dadasaheb Gaikwad', cardNo: 'RC-SAN-AAY-1016', type: 'AAY', quota: '35 KG', status: 'VERIFIED' },
                      { id: 17, name: 'Usha Salunkhe', cardNo: 'RC-SAN-PHH-2017', type: 'PHH', quota: '20 KG', status: 'VERIFIED' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'walwa',
            name: 'Walwa (Islampur) Taluka',
            code: 'TAL-WAL-02',
            talukaOfficer: 'Shri R. V. Deshpande, Tehsildar',
            villagesCount: 98,
            fpsCount: 180,
            quotaMT: '4,100 MT',
            status: 'NORMAL',
            villages: [],
          },
          {
            id: 'tasgaon',
            name: 'Tasgaon Taluka',
            code: 'TAL-TAS-03',
            talukaOfficer: 'Smt. S. P. Shinde, Tehsildar',
            villagesCount: 72,
            fpsCount: 135,
            quotaMT: '2,900 MT',
            status: 'NORMAL',
            villages: [],
          },
        ],
      },
    ],
  },
};

const HierarchyExplorer = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(HIERARCHY_TREE.state.districts[0]);
  const [selectedTaluka, setSelectedTaluka] = useState(HIERARCHY_TREE.state.districts[0].talukas[0]);
  const [selectedVillage, setSelectedVillage] = useState(HIERARCHY_TREE.state.districts[0].talukas[0]?.villages[0]);
  const [selectedShop, setSelectedShop] = useState(HIERARCHY_TREE.state.districts[0].talukas[0]?.villages[0]?.shops[0]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Administrative Hierarchy & Supply Chain</h1>
            <span className="badge badge-success text-[10px]">SANGLI PDS JURISDICTION</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Strict jurisdiction boundaries: State (Maharashtra) ➔ District (Sangli) ➔ Taluka (Miraj) ➔ Villages (Bedag & Belanki) ➔ Fair Price Shops ➔ Beneficiaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/audit" className="btn btn-primary text-xs shadow">
            <Sparkles size={14} className="text-amber-300" />
            <span>AI Risk Audit</span>
          </Link>
          <Link to="/dispatch" className="btn btn-secondary text-xs">
            <Truck size={14} className="text-emerald-700" />
            <span>Trace Grain Movement</span>
          </Link>
        </div>
      </div>

      {/* Visual Pipeline Banner: Physical Food Grain Flow in Sangli */}
      <div className="card bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-950 text-white p-5 border-emerald-800 shadow-md">
        <div className="flex items-center justify-between mb-3 border-b border-emerald-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-emerald-400" />
            <h2 className="text-sm font-black tracking-wide uppercase text-emerald-100">
              End-to-End Physical Grain Movement Pipeline (Sangli District)
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-800/60 text-emerald-200 font-bold border border-emerald-700">
            NFSA LEAK-PROOF AUDIT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1 text-xs">
          {/* Step 1 */}
          <div className="p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/60">
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Tier 1 • State</div>
            <div className="font-extrabold text-white text-sm">State Allocation</div>
            <p className="text-[11px] text-emerald-200 mt-1">FCI Central Pool to Maharashtra Buffer</p>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/60">
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Tier 2 • Sangli Godown</div>
            <div className="font-extrabold text-white text-sm">WH-SAN-001 Depot</div>
            <p className="text-[11px] text-emerald-200 mt-1">Kupwad Silo & Certified Weighbridge</p>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/60">
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Tier 3 • Transit</div>
            <div className="font-extrabold text-white text-sm">Carrier MH-10-AZ-5542</div>
            <p className="text-[11px] text-emerald-200 mt-1">Krishna Valley Logistics (Driver: Arjun Patil)</p>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-xl bg-amber-900/60 border border-amber-600/80 relative overflow-hidden">
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Tier 4 • Bedag Village</span>
              <span className="badge badge-danger text-[8px] px-1 py-0">ALERT</span>
            </div>
            <div className="font-extrabold text-white text-sm">FPS-BED-001 Delivery</div>
            <p className="text-[11px] text-amber-200 mt-1">Shortage: 5000kg dispatched vs 4850kg received</p>
          </div>

          {/* Step 5 */}
          <div className="p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/60">
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Tier 5 • Citizen</div>
            <div className="font-extrabold text-white text-sm">Beneficiary e-PoS</div>
            <p className="text-[11px] text-emerald-200 mt-1">Tukaram Shinde (Aadhaar Biometric Quota)</p>
          </div>
        </div>
      </div>

      {/* 6-Tier Interactive Hierarchy Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tier 1 & 2: State & District */}
        <div className="lg:col-span-4 space-y-4">
          {/* State Card */}
          <div className="card border-emerald-300 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Level 1: State Authority</span>
              <span className="badge badge-success text-[10px]">APEX TIER</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>🏛️ {HIERARCHY_TREE.state.name}</span>
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-semibold border-t border-emerald-100 pt-2">
              <div>Districts: <strong className="text-slate-900">36</strong></div>
              <div>Warehouses: <strong className="text-slate-900">420</strong></div>
              <div>Fair Price Shops: <strong className="text-slate-900">52,400</strong></div>
              <div>Beneficiaries: <strong className="text-slate-900">7.02 Cr</strong></div>
            </div>
          </div>

          {/* District Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Level 2: District Division</span>
              <span className="text-[10px] text-emerald-800 font-bold">Sangli District</span>
            </div>

            <div
              className={`p-3 rounded-xl border text-left cursor-pointer transition border-emerald-600 bg-emerald-50/80 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-700" />
                  <span>{selectedDistrict.name}</span>
                </div>
                <span className="badge badge-danger text-[9px]">ANOMALY UNDER REVIEW</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-500 flex items-center justify-between">
                <span>DSO: {selectedDistrict.dso}</span>
                <span className="font-mono font-bold text-slate-700">10 Talukas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 3 & 4: Taluka & Village */}
        <div className="lg:col-span-4 space-y-4">
          {/* Taluka Selector */}
          <div className="card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div>
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Level 3: Taluka Sub-Division</span>
                <p className="text-[10px] text-slate-400">Within {selectedDistrict.name}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{selectedDistrict.talukas.length} Talukas Listed</span>
            </div>

            <div className="space-y-2">
              {selectedDistrict.talukas.map((tal) => {
                const isSelected = selectedTaluka?.id === tal.id;
                return (
                  <div
                    key={tal.id}
                    onClick={() => {
                      setSelectedTaluka(tal);
                      if (tal.villages.length > 0) {
                        setSelectedVillage(tal.villages[0]);
                        setSelectedShop(tal.villages[0]?.shops[0]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                        <Building2 size={14} className={isSelected ? 'text-emerald-700' : 'text-slate-400'} />
                        <span>{tal.name}</span>
                      </div>
                      {tal.status === 'FLAGGED_ANOMALY' ? (
                        <span className="badge badge-warning text-[9px]">INVESTIGATING</span>
                      ) : (
                        <span className="badge badge-success text-[9px]">NORMAL</span>
                      )}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Quota: {tal.quotaMT}</span>
                      <span className="font-bold text-slate-700">{tal.fpsCount} Shops</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Village Selector: Bedag and Belanki */}
          {selectedTaluka && (
            <div className="card">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div>
                  <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Level 4: Demo Villages</span>
                  <p className="text-[10px] text-slate-400">Within {selectedTaluka.name}</p>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  VERIFIED LOCALITIES
                </span>
              </div>

              <div className="space-y-2">
                {selectedTaluka.villages.map((vil) => {
                  const isSelected = selectedVillage?.id === vil.id;
                  return (
                    <div
                      key={vil.id}
                      onClick={() => {
                        setSelectedVillage(vil);
                        setSelectedShop(vil.shops[0]);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900">{vil.name}</div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          Pin: {vil.pincode}
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Enrolled: <strong>{vil.beneficiaries}</strong></span>
                        <span className="font-bold text-emerald-800">{vil.fpsCount} Fair Price Shops</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tier 5 & 6: Fair Price Shop & Beneficiaries */}
        <div className="lg:col-span-4 space-y-4">
          {/* Shop Card */}
          <div className="card border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Level 5: Fair Price Shop (FPS)</span>
              {selectedShop?.status === 'UNDER_REVIEW' ? (
                <span className="badge badge-danger text-[9px]">RISK 75.0</span>
              ) : (
                <span className="badge badge-success text-[9px]">COMPLIANT</span>
              )}
            </div>

            {selectedShop ? (
              <div className="space-y-3">
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <Store size={18} className="text-emerald-700" />
                    <span>{selectedShop.shopName}</span>
                  </h4>
                  <div className="text-xs font-mono font-bold text-emerald-800 mt-0.5">
                    Code: {selectedShop.shopCode} • Licensee: {selectedShop.dealer}
                  </div>
                </div>

                {selectedShop.alert && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
                    <div className="font-bold flex items-center gap-1 mb-0.5">
                      <ShieldAlert size={14} className="text-red-600" />
                      <span>Active Anomaly Alert</span>
                    </div>
                    <p className="text-[11px]">{selectedShop.alert}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2 text-slate-600">
                  <div>Enrolled Cards: <strong>{selectedShop.cardholders}</strong></div>
                  <div>Village: <strong>{selectedVillage?.name}</strong></div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link to={`/ration-shops/${selectedShop.id}`} className="btn btn-primary btn-sm flex-1">
                    <span>Inspect Shop Dossier</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">Select a village to inspect local fair price shops.</p>
            )}
          </div>

          {/* Beneficiaries under Shop */}
          <div className="card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Level 6: End Beneficiaries</span>
              <span className="badge badge-info text-[9px]">AAY / PHH SCHEMES</span>
            </div>

            {selectedShop?.beneficiariesList?.length > 0 ? (
              <div className="space-y-2">
                {selectedShop.beneficiariesList.map((b) => (
                  <div key={b.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{b.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{b.cardNo} • {b.type}</div>
                    </div>
                    <div className="text-right">
                      <span className="badge badge-success text-[9px]">{b.quota}</span>
                      <div className="text-[9px] text-emerald-700 font-bold mt-0.5">{b.status}</div>
                    </div>
                  </div>
                ))}
                <Link to="/beneficiaries" className="block text-center text-xs font-bold text-emerald-800 hover:text-emerald-950 pt-2">
                  View All Enrolled Beneficiaries ➔
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No individual cardholders loaded in preview.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchyExplorer;
