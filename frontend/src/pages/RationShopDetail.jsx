import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import {
  ArrowLeft,
  Store,
  Boxes,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  TrendingUp,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  X
} from 'lucide-react';

const RationShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Audit State
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditReport, setAuditReport] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Demand Recommendation State
  const [demandRunning, setDemandRunning] = useState(false);
  const [demandResult, setDemandResult] = useState(null);
  const [showDemandModal, setShowDemandModal] = useState(false);

  useEffect(() => {
    fetchShopData();
  }, [id]);

  const fetchShopData = async () => {
    try {
      const [shopRes, invRes, distRes, alertRes] = await Promise.all([
        api.get(`/ration-shops/${id}`),
        api.get(`/inventory/RATION_SHOP/${id}`),
        api.get(`/distributions/shop/${id}`),
        api.get(`/alerts`),
      ]);

      setShop(shopRes.data.data);
      setInventories(invRes.data.data);
      setDistributions(distRes.data.data);

      const shopAlerts = alertRes.data.data.filter(
        (a) => a.entityType === 'RationShop' && String(a.entityId) === String(id)
      );
      setAlerts(shopAlerts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAiAudit = async () => {
    setAuditRunning(true);
    try {
      const res = await api.post(`/ai/audit/shop/${id}`);
      setAuditReport(res.data.data);
      setShowAuditModal(true);
      fetchShopData(); // Refresh alerts
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing AI Audit Agent');
    } finally {
      setAuditRunning(false);
    }
  };

  const handleRunDemandPlanning = async () => {
    setDemandRunning(true);
    try {
      const res = await api.post('/ai/demand/recommendation', { shopId: Number(id) });
      setDemandResult(res.data.data);
      setShowDemandModal(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing Demand Planning Agent');
    } finally {
      setDemandRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-semibold text-slate-500 animate-pulse">Loading Fair Price Shop dossier...</div>
      </div>
    );
  }

  if (!shop) {
    return <div className="p-4 text-center text-sm text-red-600">Ration Shop not found.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/ration-shops" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Back to Shops</span>
        </Link>
        <span className="text-xs text-slate-400">/</span>
        <span className="text-xs font-bold text-slate-600">{shop.shopCode}</span>
      </div>

      {/* Header Banner */}
      <div className="card bg-white p-6 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl shadow-md">
              <Store size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">{shop.shopName}</h1>
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  {shop.shopCode}
                </span>
                <span className={`badge ${shop.currentStatus === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                  {shop.currentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" />
                <span>{shop.address}, {shop.district}, {shop.state}</span>
                <span>• Dealer: <strong>{shop.ownerName}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunDemandPlanning}
              disabled={demandRunning}
              className="btn btn-secondary text-xs"
            >
              <TrendingUp size={14} />
              <span>{demandRunning ? 'Calculating...' : 'Demand Plan'}</span>
            </button>
            <button
              onClick={handleRunAiAudit}
              disabled={auditRunning}
              className="btn btn-primary text-xs shadow-md flex items-center gap-2"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span>{auditRunning ? 'Running AI Agent...' : 'RUN AI AUDIT'}</span>
            </button>
          </div>
        </div>

        {/* Risk & Inventory Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Enrolled Beneficiaries</p>
            <p className="text-xl font-black text-slate-900">{shop.beneficiaryCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Licensed Capacity</p>
            <p className="text-xl font-black text-slate-900">{Number(shop.capacity).toLocaleString()} KG</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Inspecting Officer</p>
            <p className="text-sm font-extrabold text-emerald-800">{shop.assignedOfficer || 'Unassigned'}</p>
          </div>
          <div className={`p-3 rounded-xl border ${shop.riskScore > 50 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200'}`}>
            <p className="text-slate-500 font-bold uppercase tracking-wider mb-1">AI Risk Indicator</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-slate-900">{shop.riskScore} / 100</span>
              {shop.riskScore > 50 && <ShieldAlert size={20} className="text-red-600 animate-pulse" />}
            </div>
          </div>
        </div>
      </div>

      {/* Current Grain Stock */}
      <div className="card">
        <h2 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <Boxes size={16} className="text-emerald-700" />
          <span>Shop Inventory & Threshold Status</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inventories.map((inv) => (
            <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <span className="badge badge-info mb-1.5">{inv.grainTypeName}</span>
                <div className="text-2xl font-black text-slate-900">
                  {Number(inv.quantity).toLocaleString()} <span className="text-xs text-slate-500 font-normal">KG</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Min Threshold: {inv.minimumThreshold} KG</p>
              </div>
              <div>
                {inv.lowStock ? (
                  <span className="badge badge-danger">LOW STOCK</span>
                ) : (
                  <span className="badge badge-success">SUFFICIENT</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts for this shop */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <span>Active Anomaly Alerts ({alerts.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Signals evaluated by Anomaly Engine</span>
        </div>

        {alerts.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No open alerts for this shop.</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{a.title}</span>
                    <span className={`badge ${a.severity === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                      {a.severity}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{a.alertCode}</span>
                  </div>
                  <p className="text-slate-600 mt-1">{a.description}</p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5 bg-white p-1 rounded border border-amber-100">
                    Evidence: {a.evidence}
                  </p>
                </div>
                <Link to={`/alerts/${a.id}`} className="btn btn-secondary btn-sm shrink-0">
                  <span>Review Evidence</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Distributions */}
      <div className="card">
        <h2 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-700" />
          <span>Recent Beneficiary Distributions</span>
        </h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction Code</th>
                <th>Beneficiary</th>
                <th>Ration Card #</th>
                <th>Grain</th>
                <th>Quantity</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {distributions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-slate-400 text-xs">No distributions recorded yet.</td>
                </tr>
              ) : (
                distributions.slice(0, 5).map((d) => (
                  <tr key={d.id}>
                    <td className="font-mono text-xs font-bold text-slate-800">{d.transactionCode}</td>
                    <td className="font-bold text-slate-900">{d.beneficiaryName}</td>
                    <td className="font-mono text-xs">{d.rationCardNumber}</td>
                    <td><span className="badge badge-info">{d.grainTypeName}</span></td>
                    <td className="font-extrabold text-slate-900">{d.quantity} KG</td>
                    <td className="text-xs text-slate-500">{new Date(d.distributionDate).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI AUDIT REPORT MODAL (Section 28) */}
      {showAuditModal && auditReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-fade-in border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">GrainGuard AI Audit Report</h3>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 mb-4 flex items-center justify-between">
              <div>
                <strong>Audited Target:</strong> {auditReport.shopName} ({auditReport.shopCode})
              </div>
              <span className="badge badge-danger">RISK SCORE: {auditReport.riskScore}</span>
            </div>

            <div className="prose prose-sm max-w-none text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans">
              {auditReport.reportText}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
              <p className="text-slate-500 italic">
                * Findings are grounded in retrieved PDS policy circulars and require human officer confirmation.
              </p>
              <button onClick={() => setShowAuditModal(false)} className="btn btn-primary btn-sm">
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEMAND PLANNING MODAL (Section 29) */}
      {showDemandModal && demandResult && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">AI Demand Planning Recommendation</h3>
              </div>
              <button onClick={() => setShowDemandModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Calculated for <strong>{demandResult.shopName}</strong> with <strong>{demandResult.beneficiaryCount}</strong> enrolled families.
            </p>

            <div className="space-y-3">
              {demandResult.recommendations?.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge badge-info">{rec.grainType}</span>
                    <span className="font-extrabold text-emerald-800 text-sm">
                      + {rec.recommendedAdditionalAllocationKg} KG
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mb-2">
                    <div>Current Stock: <strong>{rec.currentStockKg} KG</strong></div>
                    <div>Monthly Demand: <strong>{rec.expectedMonthlyDemandKg} KG</strong></div>
                  </div>
                  <p className="text-[11px] text-slate-700 italic border-t border-slate-200 pt-2">{rec.reasoning}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowDemandModal(false)} className="btn btn-primary btn-sm">
                Close Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RationShopDetail;
