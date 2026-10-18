import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_PROFILES } from '../context/roles';
import { dataService } from '../services/dataService';
import {
  Users,
  Store,
  Warehouse,
  Wheat,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  PackageX,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Truck,
  CheckCircle2,
  PackageCheck,
  Eye,
  Scale,
  CreditCard,
  MessageSquareWarning,
  Plus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role || ROLES.DISTRICT_OFFICER;
  const profile = ROLE_PROFILES[role] || ROLE_PROFILES.DISTRICT_OFFICER;

  const [data, setData] = useState(null);
  const [dispatches, setDispatches] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [sumRes, dispRes, rcptRes] = await Promise.all([
        dataService.getDashboardSummary(),
        dataService.getDispatches(),
        dataService.getReceipts(),
      ]);
      setData(sumRes.data);
      setDispatches(dispRes.data || []);
      setReceipts(rcptRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Subscribe to state updates in mockStore for real-time reactivity
    const unsubscribe = dataService.subscribe(() => {
      fetchDashboardData();
    });

    return () => unsubscribe();
  }, []);

  const receiptsMap = {};
  receipts.forEach((r) => {
    receiptsMap[r.dispatchId] = r;
  });

  const grainPieData = [
    { name: 'Rice Stock (KG)', value: data?.totalRiceStockKg || 52500, color: '#16a34a' },
    { name: 'Wheat Stock (KG)', value: data?.totalWheatStockKg || 37750, color: '#f59e0b' },
  ];

  /* =========================================================================
     1. CITIZEN / BENEFICIARY DASHBOARD VIEW (Tukaram Shinde - Bedag)
     ========================================================================= */
  if (role === ROLES.BENEFICIARY) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Namaste, {profile.name}!
              </h1>
              <span className="badge badge-success text-[10px]">AAY CARDHOLDER • BEDAG</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Ration Card #<strong>{profile.jurisdiction.rationCardNumber}</strong> • Bedag Village, Miraj Taluka, Sangli
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/citizen-portal" className="btn btn-primary text-xs shadow">
              <CreditCard size={14} />
              <span>Digital Passbook</span>
            </Link>
            <Link to="/complaints" className="btn btn-secondary text-xs">
              <MessageSquareWarning size={14} className="text-amber-600" />
              <span>File Complaint</span>
            </Link>
          </div>
        </div>

        {/* Quota Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card border-emerald-200 bg-emerald-50/50">
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Monthly Rice Quota
            </div>
            <div className="text-2xl font-black text-slate-900">20.0 KG</div>
            <div className="text-xs text-emerald-700 font-bold mt-1">Status: Disbursed & Received (₹3/kg)</div>
          </div>

          <div className="card border-amber-200 bg-amber-50/50">
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
              Monthly Wheat Quota
            </div>
            <div className="text-2xl font-black text-slate-900">15.0 KG</div>
            <div className="text-xs text-amber-700 font-bold mt-1">Status: Disbursed & Received (₹2/kg)</div>
          </div>

          <div className="card">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Assigned Fair Price Shop
            </div>
            <div className="text-base font-black text-emerald-950">FPS-BED-001 (Bedag Seva Store #1)</div>
            <div className="text-xs text-slate-500 mt-1">Dealer Suresh Patil • Main Bazaar Road, Bedag</div>
          </div>
        </div>

        {/* Recent Transactions & Digital Receipts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900">Recent Grain Disbursal History (October 2026)</h2>
            <Link to="/citizen-portal" className="btn btn-secondary btn-sm">
              <span>View Full Passbook</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Grain Commodity</th>
                  <th>Quantity Received</th>
                  <th>Subsidized Amount</th>
                  <th>Distribution Date</th>
                  <th>Biometric Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono font-bold text-xs">TX-SAN-DIST-101</td>
                  <td><span className="badge badge-info">Fortified Rice</span></td>
                  <td className="font-bold text-slate-900">20.0 KG</td>
                  <td className="font-mono text-emerald-900 font-bold">₹60.00</td>
                  <td className="text-slate-500 text-xs">16-Oct-2026</td>
                  <td><span className="badge badge-success text-[9px]">Aadhaar Fingerprint (98%)</span></td>
                  <td><span className="badge badge-success">COMPLETED</span></td>
                </tr>
                <tr>
                  <td className="font-mono font-bold text-xs">TX-SAN-DIST-102</td>
                  <td><span className="badge badge-warning">Quality Wheat</span></td>
                  <td className="font-bold text-slate-900">15.0 KG</td>
                  <td className="font-mono text-emerald-900 font-bold">₹30.00</td>
                  <td className="text-slate-500 text-xs">16-Oct-2026</td>
                  <td><span className="badge badge-success text-[9px]">Aadhaar Fingerprint (98%)</span></td>
                  <td><span className="badge badge-success">COMPLETED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. WAREHOUSE MANAGER DASHBOARD VIEW (WH-SAN-001 Sangli Central Godown)
     ========================================================================= */
  if (role === ROLES.WAREHOUSE_MANAGER) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Sangli Central Grain Godown #1 (WH-SAN-001)
              </h1>
              <span className="badge badge-info text-[10px]">SANGLI DEPOT</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Plot 42, Kupwad Industrial Area, Sangli • 100 MT Storage Silos & Certified Weighbridge Operations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/warehouse-ops" className="btn btn-primary text-xs shadow">
              <Plus size={14} />
              <span>Generate Dispatch Waybill</span>
            </Link>
            <Link to="/inventory" className="btn btn-secondary text-xs">
              <Warehouse size={14} className="text-emerald-700" />
              <span>Depot Inventory</span>
            </Link>
          </div>
        </div>

        {/* Warehouse Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Storage Capacity"
            value="100.0 MT"
            subtitle="100,000 KG Rated Silo Volume"
            icon={Warehouse}
            color="emerald"
          />
          <StatCard
            title="Current Grain Stock"
            value="78.5 MT"
            subtitle="78.5% Capacity Utilized (Buffer Safe)"
            icon={Wheat}
            color="emerald"
          />
          <StatCard
            title="Linked Fair Price Shops"
            value="28 FPS"
            subtitle="Bedag, Belanki & Miraj Outlets"
            icon={Store}
            color="sky"
          />
          <StatCard
            title="Weighbridge Status"
            value="CALIBRATED"
            subtitle="Certified valid till Nov 2026"
            icon={Scale}
            color="amber"
          />
        </div>

        {/* Recent Dispatches from Godown */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Recent Outbound Dispatches to Shops</h2>
              <p className="text-xs text-slate-500">Waybills issued from WH-SAN-001 certified weighbridge</p>
            </div>
            <Link to="/warehouse-ops" className="btn btn-primary btn-sm">
              <span>View All Dispatches</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Waybill Code</th>
                  <th>Destination FPS</th>
                  <th>Village</th>
                  <th>Commodity</th>
                  <th>Dispatched (KG)</th>
                  <th>Vehicle Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dispatches.slice(0, 5).map((d) => (
                  <tr key={d.id}>
                    <td className="font-mono text-xs font-bold">{d.dispatchCode}</td>
                    <td className="font-bold text-emerald-900">{d.destinationShopName}</td>
                    <td className="text-xs text-slate-600">{d.destinationVillage}</td>
                    <td><span className="badge badge-info">{d.grainTypeName}</span></td>
                    <td className="font-black text-slate-900 text-xs">{d.quantityDispatched} KG</td>
                    <td className="font-mono text-xs">{d.vehicleNumber}</td>
                    <td>
                      <span className={`badge ${
                        d.status === 'DELIVERED'
                          ? 'badge-success'
                          : d.status === 'PARTIALLY_RECEIVED'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     3. TRANSPORTER DASHBOARD VIEW (Arjun Patil - MH-10-AZ-5542)
     ========================================================================= */
  if (role === ROLES.TRANSPORTER) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                PDS Logistics & Fleet Transit Console
              </h1>
              <span className="badge badge-warning text-[10px]">VEHICLE: MH-10-AZ-5542</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Operator: Krishna Valley Agro Logistics • Driver: Arjun Patil (+91 98220 11223)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/transporter-ops" className="btn btn-primary text-xs shadow">
              <Truck size={14} />
              <span>Active Trip Milestones</span>
            </Link>
            <Link to="/receipts" className="btn btn-secondary text-xs">
              <CheckCircle2 size={14} />
              <span>Weighbridge Slips</span>
            </Link>
          </div>
        </div>

        {/* Transporter Active Trip Card */}
        <div className="card border-amber-300 bg-amber-50/50 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200 mb-3">
            <div className="flex items-center gap-2">
              <Truck size={20} className="text-amber-800" />
              <h2 className="text-base font-extrabold text-amber-950">
                Active Waybill Dossier: DISP-SAN-1002
              </h2>
            </div>
            <span className="badge badge-danger text-[10px]">SHORTAGE RECORDED (-150 KG)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500">Source Godown:</span>
              <div className="font-bold text-slate-900 mt-0.5">Sangli Central Godown #1 (WH-SAN-001)</div>
            </div>
            <div>
              <span className="text-slate-500">Destination Shop:</span>
              <div className="font-bold text-emerald-900 mt-0.5">FPS-BED-001 (Bedag Seva Store #1)</div>
            </div>
            <div>
              <span className="text-slate-500">Dispatched Quantity:</span>
              <div className="font-black text-slate-900 text-sm mt-0.5">5,000.0 KG (Rice)</div>
            </div>
            <div>
              <span className="text-slate-500">Shop Received Quantity:</span>
              <div className="font-black text-red-600 text-sm mt-0.5">4,850.0 KG (-3.0%)</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
            <span className="text-xs text-amber-900 font-semibold">
              ⚠️ Anomaly Alert generated: Shortage exceeded 1.0% statutory tolerance limit.
            </span>
            <Link to="/transporter-ops" className="btn btn-primary btn-sm">
              Inspect GPS Checkpoints ➔
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     4. FPS OWNER DASHBOARD VIEW (Suresh Patil - FPS-BED-001 Bedag)
     ========================================================================= */
  if (role === ROLES.FPS_OWNER) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Bedag Seva Fair Price Store #1 (FPS-BED-001)
              </h1>
              <span className="badge badge-danger text-[10px]">UNDER REVIEW (RISK: 75.0)</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Dealer: Suresh Patil • Main Bazaar Road, Near Gram Panchayat, Bedag Village (416410)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/distributions" className="btn btn-primary text-xs shadow">
              <PackageCheck size={14} />
              <span>Issue Grain to Cardholder</span>
            </Link>
            <Link to="/receipts" className="btn btn-secondary text-xs">
              <CheckCircle2 size={14} className="text-emerald-700" />
              <span>Confirm Delivery</span>
            </Link>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-3">
          <ShieldAlert size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-extrabold text-sm">Regulatory Notice: High Risk Score (75.0) Flagged by AI Engine</div>
            <p className="mt-1 leading-relaxed">
              Discrepancy of 150 KG recorded on inbound shipment DISP-SAN-1002, accompanied by +73.3% abnormal distribution volume spike. DSO Anand Kulkarni has initiated a physical inspection.
            </p>
          </div>
        </div>

        {/* FPS Inventory Balances */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Rice in Store"
            value="1,000 KG"
            subtitle="Threshold: 800 KG (Low Buffer)"
            icon={Wheat}
            color="emerald"
          />
          <StatCard
            title="Wheat in Store"
            value="600 KG"
            subtitle="Threshold: 400 KG"
            icon={Wheat}
            color="amber"
          />
          <StatCard
            title="Enrolled Beneficiaries"
            value="420 Cards"
            subtitle="Bedag Village AAY & PHH Cards"
            icon={Users}
            color="sky"
          />
          <StatCard
            title="Monthly Disbursements"
            value="7,800 KG"
            subtitle="Historical Baseline: 4,500 KG (+73.3%)"
            icon={TrendingUp}
            color="rose"
            alert={true}
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     5, 6, 7. DISTRICT OFFICER, SUPER ADMIN, & AUDITOR DASHBOARDS
     ========================================================================= */
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Role-Specific Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {role === ROLES.SUPER_ADMIN && 'State Food & Civil Supplies Apex Console'}
              {role === ROLES.DISTRICT_OFFICER && 'District Supply Officer (DSO, Sangli) Monitoring Console'}
              {role === ROLES.AUDITOR && 'State Statutory & Forensic Vigilance Audit Console'}
            </h1>
            <span className="badge badge-success text-[10px]">{profile.clearanceLevel}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {role === ROLES.SUPER_ADMIN && 'Statewide macro grain reserves, inter-district flow, leakage prevention & policy enforcement.'}
            {role === ROLES.DISTRICT_OFFICER && 'Monitoring bulk allocations from Sangli godowns down to lowest tier shops in Bedag & Belanki villages with leakage detection.'}
            {role === ROLES.AUDITOR && 'Independent oversight of transit weighbridge shortages, volume anomalies, and PDS circular compliance.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/hierarchy" className="btn btn-secondary text-xs">
            <Store size={14} className="text-emerald-700" />
            <span>Hierarchy Map</span>
          </Link>
          <Link to="/audit" className="btn btn-primary text-xs shadow">
            <Sparkles size={14} className="text-amber-300" />
            <span>Launch AI Audit</span>
          </Link>
          <Link to="/alerts" className="btn btn-secondary text-xs">
            <AlertTriangle size={14} className="text-amber-600" />
            <span>Alerts ({data?.openAlerts || 3})</span>
          </Link>
        </div>
      </div>

      {/* Flagged Shop Spotlight Banner (FPS-BED-001 Anomaly Scenario) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border border-amber-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">
                Target Investigation: FPS-BED-001 (Bedag Seva Fair Price Store #1)
              </span>
              <span className="badge badge-danger text-[10px]">RISK INDICATOR: 75.0</span>
            </div>
            <p className="text-xs text-amber-950 mt-1 max-w-2xl leading-relaxed">
              Anomaly Engine detected a <strong>150.0 KG (3.0%) shortage</strong> on dispatch DISP-SAN-1002 from WH-SAN-001 and a <strong>+73.3% distribution volume deviation</strong> above historical baseline in Bedag village.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/ration-shops/1" className="btn btn-sm btn-primary">
            <span>Investigate Bedag Shop</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Beneficiaries"
          value={data?.totalBeneficiaries || 20}
          subtitle="Enrolled in Bedag & Belanki"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Fair Price Shops (FPS)"
          value={data?.totalRationShops || 4}
          subtitle="Outlets in Bedag & Belanki"
          icon={Store}
          color="emerald"
        />
        <StatCard
          title="Storage Godowns"
          value={data?.totalGodowns || 2}
          subtitle="Sangli & Miraj Depots"
          icon={Warehouse}
          color="sky"
        />
        <StatCard
          title="Open Anomaly Alerts"
          value={data?.openAlerts || 3}
          subtitle={`${data?.highPriorityAlerts || 3} high priority requiring review`}
          icon={AlertTriangle}
          color="amber"
          alert={true}
        />
      </div>

      {/* DISPATCHES TO LOWEST TIER (Fair Price Shops) */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-emerald-700" />
              <h2 className="text-base font-extrabold text-slate-900">
                Grain Movement: Dispatches to Lowest Outlets (Fair Price Shops)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring exact quantities released from Sangli warehouses to each Ration Shop with weighbridge reconciliation
            </p>
          </div>
          <Link to="/dispatch" className="btn btn-secondary btn-sm">
            <span>View All Dispatches</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Destination FPS</th>
                <th>Village</th>
                <th>Source Godown</th>
                <th>Waybill #</th>
                <th>Grain Commodity</th>
                <th>Dispatched (KG)</th>
                <th>Received (KG)</th>
                <th>Transit Shortage</th>
                <th>Vehicle #</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-6 text-slate-400 text-xs">No active dispatch movements.</td>
                </tr>
              ) : (
                dispatches.map((d) => {
                  const rcpt = receiptsMap[d.id];
                  const receivedQty = d.actualQuantityReceived !== null ? d.actualQuantityReceived : (d.status === 'DELIVERED' ? d.quantityDispatched : 'In Transit');
                  const shortage = d.shortageQuantity || 0.0;
                  const hasShortage = shortage > 0;

                  return (
                    <tr key={d.id} className={hasShortage ? 'bg-amber-50/50' : ''}>
                      <td className="font-extrabold text-emerald-900">
                        {d.destinationShopName}
                        <div className="text-[10px] text-slate-400 font-mono">Code: {d.destinationShopCode}</div>
                      </td>
                      <td>
                        <span className="badge badge-info text-[9px]">{d.destinationVillage}</span>
                      </td>
                      <td className="text-xs font-semibold text-slate-700">{d.sourceWarehouseName}</td>
                      <td className="font-mono text-xs font-bold text-slate-800">{d.dispatchCode}</td>
                      <td><span className="badge badge-info">{d.grainTypeName}</span></td>
                      <td className="font-black text-slate-900 text-sm">
                        {Number(d.quantityDispatched).toLocaleString()} KG
                      </td>
                      <td className="font-bold text-slate-800 text-xs">
                        {typeof receivedQty === 'number' ? `${Number(receivedQty).toLocaleString()} KG` : receivedQty}
                      </td>
                      <td>
                        {hasShortage ? (
                          <span className="badge badge-danger flex items-center gap-1 w-max">
                            <AlertTriangle size={11} />
                            <span>- {shortage} KG</span>
                          </span>
                        ) : (
                          <span className="badge badge-success">0.0 KG</span>
                        )}
                      </td>
                      <td className="font-mono text-xs text-slate-600">{d.vehicleNumber}</td>
                      <td>
                        <span className={`badge ${
                          d.status === 'DELIVERED'
                            ? 'badge-success'
                            : d.status === 'PARTIALLY_RECEIVED'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link to={`/ration-shops/${d.destinationShopId}`} className="btn btn-secondary btn-sm">
                          <Eye size={13} />
                          <span>Inspect FPS</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Stock Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Rice Stock"
          value={Number(data?.totalRiceStockKg || 52500).toLocaleString()}
          unit="KG"
          subtitle="Across warehouses & shops"
          icon={Wheat}
          color="emerald"
        />
        <StatCard
          title="Current Wheat Stock"
          value={Number(data?.totalWheatStockKg || 37750).toLocaleString()}
          unit="KG"
          subtitle="Across warehouses & shops"
          icon={Wheat}
          color="amber"
        />
        <StatCard
          title="Discrepancy Flags"
          value={data?.stockDiscrepancies || 1}
          subtitle="Transit shortages recorded"
          icon={PackageX}
          color="rose"
        />
        <StatCard
          title="Distributions Logged"
          value={data?.distributionTransactionsCount || 18}
          subtitle="Validated against statutory quotas"
          icon={TrendingUp}
          color="sky"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shop-wise Distribution Bar Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Shop-wise Grain Distribution (KG)</h2>
              <p className="text-xs text-slate-500">Total grain disbursed across Bedag & Belanki outlets</p>
            </div>
            <span className="badge badge-info">Sangli PDS Analytics</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.shopDistributionStats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="shopCode" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${Number(val).toLocaleString()} KG`, 'Distributed']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="totalDistributedKg" fill="#15803d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grain Breakdown Pie Chart */}
        <div className="card">
          <div className="mb-4">
            <h2 className="text-base font-extrabold text-slate-900">Grain Stock Allocation</h2>
            <p className="text-xs text-slate-500">Buffer proportion across grain types</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={grainPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {grainPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${Number(val).toLocaleString()} KG`, 'Stock']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
