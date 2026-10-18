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
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

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
        id: 'pune',
        name: 'Pune District',
        code: 'DIST-PUN-01',
        dso: 'Officer Rajesh Verma',
        talukasCount: 14,
        villagesCount: 1860,
        fpsCount: 420,
        population: '94.2 Lakh',
        riskLevel: 'ELEVATED', // Due to FPS102
        allocatedQuotaMT: '38,500 MT',
        activeGodowns: ['Central Grain Storage Godown #1 (GOD-101)', 'Hadapsar Sub-Depot (GOD-104)'],
        talukas: [
          {
            id: 'haveli',
            name: 'Haveli Taluka',
            code: 'TAL-HAV-02',
            talukaOfficer: 'Mr. Arvind Joshi',
            villagesCount: 112,
            fpsCount: 54,
            quotaMT: '4,200 MT',
            status: 'FLAGGED_ANOMALY',
            villages: [
              {
                id: 'hadapsar',
                name: 'Hadapsar Village / Sector',
                code: 'VIL-HAD-10',
                fpsCount: 4,
                beneficiaries: 1850,
                shops: [
                  {
                    id: 2,
                    shopCode: 'FPS102',
                    shopName: 'Saraswati Fair Price Store',
                    dealer: 'Suresh Patil',
                    cardholders: 480,
                    status: 'UNDER_REVIEW',
                    riskScore: 75.0,
                    alert: '150 KG Transit Shortage & +73.3% Volume Spike',
                    beneficiariesList: [
                      { id: 1, name: 'Ramesh Kumar', cardNo: 'RC-AAY-889901', type: 'AAY', quota: '35 KG', status: 'VERIFIED' },
                      { id: 2, name: 'Vijay Patil', cardNo: 'RC-PHH-774412', type: 'PHH', quota: '25 KG', status: 'VERIFIED' },
                      { id: 3, name: 'Sunita Kamble', cardNo: 'RC-PHH-665510', type: 'PHH', quota: '15 KG', status: 'VERIFIED' },
                    ]
                  },
                  {
                    id: 1,
                    shopCode: 'FPS101',
                    shopName: 'Anand Fair Price Store',
                    dealer: 'Anand Shinde',
                    cardholders: 520,
                    status: 'ACTIVE',
                    riskScore: 12.0,
                    alert: null,
                    beneficiariesList: [
                      { id: 4, name: 'Deepak More', cardNo: 'RC-PHH-991203', type: 'PHH', quota: '20 KG', status: 'VERIFIED' },
                      { id: 5, name: 'Pooja Jadhav', cardNo: 'RC-NPHH-554412', type: 'NPHH', quota: '10 KG', status: 'VERIFIED' },
                    ]
                  }
                ]
              },
              {
                id: 'wagholi',
                name: 'Wagholi Village',
                code: 'VIL-WAG-11',
                fpsCount: 3,
                beneficiaries: 1420,
                shops: [
                  {
                    id: 3,
                    shopCode: 'FPS103',
                    shopName: 'Janta Ration Agency',
                    dealer: 'Mahesh Kale',
                    cardholders: 410,
                    status: 'ACTIVE',
                    riskScore: 8.5,
                    alert: null,
                    beneficiariesList: []
                  }
                ]
              }
            ]
          },
          {
            id: 'baramati',
            name: 'Baramati Taluka',
            code: 'TAL-BAR-03',
            talukaOfficer: 'Mrs. Rekha Thorat',
            villagesCount: 98,
            fpsCount: 46,
            quotaMT: '3,800 MT',
            status: 'NORMAL',
            villages: []
          },
          {
            id: 'junnar',
            name: 'Junnar Taluka',
            code: 'TAL-JUN-04',
            talukaOfficer: 'Mr. Prakash Sonawane',
            villagesCount: 142,
            fpsCount: 62,
            quotaMT: '4,100 MT',
            status: 'NORMAL',
            villages: []
          }
        ]
      },
      {
        id: 'nashik',
        name: 'Nashik District',
        code: 'DIST-NSK-02',
        dso: 'Officer M. K. Kulkarni',
        talukasCount: 15,
        villagesCount: 1920,
        fpsCount: 485,
        population: '61.1 Lakh',
        riskLevel: 'NORMAL',
        allocatedQuotaMT: '29,400 MT',
        activeGodowns: ['Regional Storage Facility #2 (GOD-102)'],
        talukas: []
      },
      {
        id: 'thane',
        name: 'Thane District',
        code: 'DIST-THN-03',
        dso: 'Officer Sneha Rao',
        talukasCount: 7,
        villagesCount: 840,
        fpsCount: 390,
        population: '80.5 Lakh',
        riskLevel: 'NORMAL',
        allocatedQuotaMT: '32,100 MT',
        activeGodowns: ['Thane Coastal Godown (GOD-105)'],
        talukas: []
      }
    ]
  }
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
            <span className="badge badge-success text-[10px]">6-TIER NFSA GOVERNANCE</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Strict jurisdiction boundaries: State ➔ District ➔ Taluka ➔ Village ➔ Fair Price Shop (FPS) ➔ Beneficiary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/audit" className="btn btn-primary text-xs shadow">
            <Sparkles size={14} className="text-amber-300" />
            <span>AI Risk Audit</span>
          </Link>
          <Link to="/dispatch" className="btn btn-secondary text-xs">
            <Truck size={14} className="text-emerald-700" />
            <span>Trace Grain Flow</span>
          </Link>
        </div>
      </div>

      {/* Visual Pipeline Banner: Physical Food Grain Flow */}
      <div className="card bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-950 text-white p-5 border-emerald-800 shadow-md">
        <div className="flex items-center justify-between mb-3 border-b border-emerald-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-emerald-400" />
            <h2 className="text-sm font-black tracking-wide uppercase text-emerald-100">
              End-to-End Physical Grain Movement Pipeline
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
            <p className="text-[11px] text-emerald-200 mt-1">FCI Central Silos to State Buffer Quotas</p>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/60">
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Tier 2 • Taluka</div>
            <div className="font-extrabold text-white text-sm">Central Godown</div>
            <p className="text-[11px] text-emerald-200 mt-1">Bulk Storage & Weighbridge Calibration</p>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/60">
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Tier 3 • Transit</div>
            <div className="font-extrabold text-white text-sm">Transporter Fleet</div>
            <p className="text-[11px] text-emerald-200 mt-1">GPS E-Waybill & Toll Checkpoint Transit</p>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-xl bg-amber-900/60 border border-amber-600/80 relative overflow-hidden">
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Tier 4 • Village</span>
              <span className="badge badge-danger text-[8px] px-1 py-0">ALERT</span>
            </div>
            <div className="font-extrabold text-white text-sm">Village FPS Delivery</div>
            <p className="text-[11px] text-amber-200 mt-1">Discrepancy: Dispatched 5000kg vs 4850kg</p>
          </div>

          {/* Step 5 */}
          <div className="p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/60">
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Tier 5 • Citizen</div>
            <div className="font-extrabold text-white text-sm">Beneficiary e-PoS</div>
            <p className="text-[11px] text-emerald-200 mt-1">Biometric/OTP Statutory Quota Disbursal</p>
          </div>
        </div>
      </div>

      {/* 6-Tier Interactive Hierarchy Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tier 1 & 2: State & Districts */}
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
              <div>Districts: <strong className="text-slate-900">{HIERARCHY_TREE.state.districtsCount}</strong></div>
              <div>Godowns: <strong className="text-slate-900">{HIERARCHY_TREE.state.activeGodowns}</strong></div>
              <div>Fair Price Shops: <strong className="text-slate-900">{HIERARCHY_TREE.state.totalShops}</strong></div>
              <div>Beneficiaries: <strong className="text-slate-900">{HIERARCHY_TREE.state.activeBeneficiaries}</strong></div>
            </div>
          </div>

          {/* Districts List */}
          <div className="card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Level 2: Districts</span>
              <span className="text-[10px] text-slate-400 font-bold">{HIERARCHY_TREE.state.districts.length} Listed</span>
            </div>

            <div className="space-y-2">
              {HIERARCHY_TREE.state.districts.map((dist) => {
                const isSelected = selectedDistrict?.id === dist.id;
                return (
                  <div
                    key={dist.id}
                    onClick={() => {
                      setSelectedDistrict(dist);
                      if (dist.talukas.length > 0) {
                        setSelectedTaluka(dist.talukas[0]);
                        setSelectedVillage(dist.talukas[0]?.villages[0]);
                        setSelectedShop(dist.talukas[0]?.villages[0]?.shops[0]);
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
                        <MapPin size={14} className={isSelected ? 'text-emerald-700' : 'text-slate-400'} />
                        <span>{dist.name}</span>
                      </div>
                      {dist.riskLevel === 'ELEVATED' ? (
                        <span className="badge badge-danger text-[9px]">ANOMALY FLAG</span>
                      ) : (
                        <span className="badge badge-success text-[9px]">NORMAL</span>
                      )}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>DSO: {dist.dso}</span>
                      <span className="font-mono font-bold text-slate-700">{dist.talukasCount} Talukas</span>
                    </div>
                  </div>
                );
              })}
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
              <span className="text-[10px] text-slate-400 font-bold">{selectedDistrict.talukas.length} Talukas</span>
            </div>

            {selectedDistrict.talukas.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Taluka records synchronized from district supply server.</p>
            ) : (
              <div className="space-y-2">
                {selectedDistrict.talukas.map((tal) => {
                  const isSelected = selectedTaluka?.id === tal.id;
                  return (
                    <div
                      key={tal.id}
                      onClick={() => {
                        setSelectedTaluka(tal);
                        setSelectedVillage(tal.villages[0]);
                        setSelectedShop(tal.villages[0]?.shops[0]);
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
                        {tal.status === 'FLAGGED_ANOMALY' && (
                          <span className="badge badge-warning text-[9px]">INVESTIGATING</span>
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
            )}
          </div>

          {/* Village Selector */}
          {selectedTaluka && (
            <div className="card">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div>
                  <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Level 4: Village / Sector</span>
                  <p className="text-[10px] text-slate-400">Within {selectedTaluka.name}</p>
                </div>
              </div>

              {selectedTaluka.villages.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Villages registered under taluka block.</p>
              ) : (
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
                            {vil.fpsCount} FPS
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] text-slate-500">
                          Enrolled Beneficiaries: <strong>{vil.beneficiaries}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                    Shop Code: {selectedShop.shopCode} • Licensee: {selectedShop.dealer}
                  </div>
                </div>

                {selectedShop.alert && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
                    <div className="font-bold flex items-center gap-1 mb-0.5">
                      <ShieldAlert size={14} className="text-red-600" />
                      <span>Active Leakage Alert</span>
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
              <span className="badge badge-info text-[9px]">AAY / PHH QUOTA</span>
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
              <p className="text-xs text-slate-400 py-4 text-center">No individual cardholders loaded in demo view.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchyExplorer;
