import React, { useState, useEffect } from 'react';
import api from '../api/client';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
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
  ShieldCheck,
  Eye
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
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role || 'OFFICER';

  const [data, setData] = useState(null);
  const [dispatches, setDispatches] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sumRes, dispRes, rcptRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dispatch'),
        api.get('/receipts'),
      ]);
      setData(sumRes.data.data);
      setDispatches(dispRes.data.data || []);
      setReceipts(rcptRes.data.data || []);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-semibold text-slate-500 animate-pulse">Loading PDS Intelligence Dashboard...</div>
      </div>
    );
  }

  const grainPieData = [
    { name: 'Rice Stock (KG)', value: data?.totalRiceStockKg || 0, color: '#16a34a' },
    { name: 'Wheat Stock (KG)', value: data?.totalWheatStockKg || 0, color: '#f59e0b' },
  ];

  // Map receipts by dispatchId for instant shortage calculation
  const receiptsMap = {};
  receipts.forEach((r) => {
    receiptsMap[r.dispatchId] = r;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Role-Specific Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {role === 'OFFICER' && 'District Supply Officer (DSO) Monitoring Console'}
              {role === 'FPS_OWNER' && 'Fair Price Shop Point-of-Sale Console (FPS102)'}
              {role === 'TRANSPORTER' && 'Logistics & Fleet Transit Operations'}
              {role === 'AUDITOR' && 'State Compliance & Forensic Audit Console'}
              {role === 'ADMIN' && 'Statewide Public Distribution Executive Overview'}
            </h1>
            <span className="badge badge-success text-[10px]">{role} ACCESS</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {role === 'OFFICER' && 'Tracking bulk allocations from central godowns down to lowest tier ration shops (FPS) with leakage detection.'}
            {role === 'FPS_OWNER' && 'Manage grain balances, confirm incoming weighbridge shipments, and disburse statutory quotas.'}
            {role === 'TRANSPORTER' && 'Real-time vehicle manifests, waybill routes, and delivery receipt reconciliation.'}
            {role === 'AUDITOR' && 'Independent oversight of transit shortages, volume anomalies, and PDS circular compliance.'}
            {role === 'ADMIN' && 'Master control over statewide grain buffers, allocations, dealers, and AI anomaly thresholds.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(role === 'OFFICER' || role === 'ADMIN' || role === 'AUDITOR') && (
            <Link to="/audit" className="btn btn-primary text-xs shadow">
              <Sparkles size={14} className="text-amber-300" />
              <span>Launch AI Audit</span>
            </Link>
          )}
          {role === 'FPS_OWNER' && (
            <Link to="/distributions" className="btn btn-primary text-xs shadow">
              <PackageCheck size={14} />
              <span>Issue Grain</span>
            </Link>
          )}
          <Link to="/alerts" className="btn btn-secondary text-xs">
            <AlertTriangle size={14} className="text-amber-600" />
            <span>Alerts ({data?.openAlerts || 0})</span>
          </Link>
        </div>
      </div>

      {/* Flagged Shop Spotlight Banner (FPS102 Anomaly Scenario) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border border-amber-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">Target Investigation: FPS102 (Saraswati Fair Price Store)</span>
              <span className="badge badge-danger text-[10px]">RISK INDICATOR: 75.0</span>
            </div>
            <p className="text-xs text-amber-950 mt-1 max-w-2xl leading-relaxed">
              Anomaly Engine detected a <strong>150.0 KG (3.0%) shortage</strong> on dispatch DISP-1002 and a <strong>+73.3% distribution volume deviation</strong> above historical baseline.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/ration-shops/2" className="btn btn-sm btn-primary">
            <span>Investigate Shop</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Beneficiaries"
          value={data?.totalBeneficiaries || 0}
          subtitle="Enrolled NFSA ration holders"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Ration Shops (FPS)"
          value={data?.totalRationShops || 0}
          subtitle="Outlets under monitoring"
          icon={Store}
          color="emerald"
        />
        <StatCard
          title="Central Godowns"
          value={data?.totalGodowns || 0}
          subtitle="Regional buffer facilities"
          icon={Warehouse}
          color="sky"
        />
        <StatCard
          title="Open Anomaly Alerts"
          value={data?.openAlerts || 0}
          subtitle={`${data?.highPriorityAlerts || 0} high priority requiring officer review`}
          icon={AlertTriangle}
          color="amber"
          alert={data?.openAlerts > 0}
        />
      </div>

      {/* DISPATCHES TO LOWEST TIER (OFFICER FOCUS: Section Requested by User) */}
      {(role === 'OFFICER' || role === 'ADMIN' || role === 'AUDITOR') && (
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
                Monitoring exact quantities released from Godowns to each Ration Shop with transit weighbridge reconciliation
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
                  <th>Source Godown</th>
                  <th>Waybill #</th>
                  <th>Grain Commodity</th>
                  <th>Dispatched (KG)</th>
                  <th>Received (KG)</th>
                  <th>Transit Shortage</th>
                  <th>Vehicle Registration</th>
                  <th>Delivery Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {dispatches.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-slate-400 text-xs">No active dispatch movements.</td>
                  </tr>
                ) : (
                  dispatches.map((d) => {
                    const rcpt = receiptsMap[d.id];
                    const receivedQty = rcpt ? rcpt.quantityReceived : (d.status === 'DELIVERED' ? d.quantityDispatched : 'In Transit');
                    const shortage = rcpt ? rcpt.shortageQuantity : 0.0;
                    const hasShortage = shortage > 0;

                    return (
                      <tr key={d.id} className={hasShortage ? 'bg-amber-50/50' : ''}>
                        <td className="font-extrabold text-emerald-900">
                          {d.shopName}
                          <div className="text-[10px] text-slate-400 font-mono">Shop ID: #{d.rationShopId}</div>
                        </td>
                        <td className="text-xs font-semibold text-slate-700">{d.godownName}</td>
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
                          <Link to={`/ration-shops/${d.rationShopId}`} className="btn btn-secondary btn-sm">
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
      )}

      {/* Secondary Stock Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Rice Stock"
          value={Number(data?.totalRiceStockKg || 0).toLocaleString()}
          unit="KG"
          subtitle="Across godowns and shops"
          icon={Wheat}
          color="emerald"
        />
        <StatCard
          title="Current Wheat Stock"
          value={Number(data?.totalWheatStockKg || 0).toLocaleString()}
          unit="KG"
          subtitle="Across godowns and shops"
          icon={Wheat}
          color="amber"
        />
        <StatCard
          title="Discrepancy Flags"
          value={data?.stockDiscrepancies || 0}
          subtitle="Transit shortages recorded"
          icon={PackageX}
          color="rose"
        />
        <StatCard
          title="Distributions Logged"
          value={data?.distributionTransactionsCount || 0}
          subtitle="Validated against entitlement quotas"
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
              <p className="text-xs text-slate-500">Total grain disbursed across lower distribution outlets</p>
            </div>
            <span className="badge badge-info">Monthly Analytics</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.shopDistributionStats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="shopCode" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val} KG`, 'Distributed']}
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
