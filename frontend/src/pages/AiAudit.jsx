import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import {
  FileCheck2,
  Sparkles,
  Store,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building2,
  Scale
} from 'lucide-react';

const AiAudit = () => {
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [loadingShops, setLoadingShops] = useState(true);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState(null);

  const fetchShops = async () => {
    try {
      const res = await dataService.getFpsShops();
      const list = res.data || [];
      setShops(list);
      if (list.length > 0) {
        // Default to Bedag high-risk shop FPS-BED-001 if available
        const bedagShop = list.find((s) => s.shopCode === 'FPS-BED-001') || list[0];
        setSelectedShopId(bedagShop.id);
      }
    } catch (err) {
      console.error('Error fetching shops for AI audit:', err);
    } finally {
      setLoadingShops(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleRunAudit = async () => {
    if (!selectedShopId) return;
    setRunning(true);
    setReport(null);
    try {
      const res = await dataService.runAiAudit(selectedShopId);
      setReport(res.data);
    } catch (err) {
      alert(err.message || 'Error executing AI Audit Agent');
    } finally {
      setRunning(false);
    }
  };

  const selectedShop = shops.find((s) => String(s.id) === String(selectedShopId));

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI-Assisted Shop Audit Agent</h1>
          <span className="badge badge-info text-[10px] uppercase font-bold tracking-wider">
            Miraj Sub-Division, Sangli
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Autonomous inspection agent cross-referencing ledger transactions, weighbridge receipts, and statutory PDS circulars
        </p>
      </div>

      {/* Target Selector Card */}
      <div className="card p-6 bg-white border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-2/3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Fair Price Shop to Audit
            </label>
            <select
              value={selectedShopId}
              onChange={(e) => setSelectedShopId(e.target.value)}
              className="form-input text-xs"
              disabled={loadingShops || running}
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shopCode} — {s.shopName} ({s.village}) {s.riskScore >= 70 ? '⚠️ High Risk (' + s.riskScore + '/100)' : '✓ Normal (' + s.riskScore + '/100)'}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/3 flex items-end">
            <button
              onClick={handleRunAudit}
              disabled={running || !selectedShopId}
              className="w-full btn btn-primary py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
              <span>{running ? 'Audit Agent Running...' : 'Execute AI Audit'}</span>
            </button>
          </div>
        </div>

        {selectedShop && (
          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Store size={16} className="text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">{selectedShop.shopName}</span>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className="text-slate-600">Dealer: {selectedShop.ownerName}</span>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className="text-slate-500">{selectedShop.village} (Pincode: {selectedShop.pincode})</span>
              </div>
            </div>
            <div>
              <span
                className={`badge text-xs font-bold ${
                  selectedShop.riskScore >= 70 ? 'badge-danger' : 'badge-success'
                }`}
              >
                Anomaly Risk: {selectedShop.riskScore} / 100
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Audit Running Loading State */}
      {running && (
        <div className="card p-8 text-center bg-white border-slate-200 shadow-sm animate-fade-in">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-800">GrainGuard AI Audit Agent in progress...</p>
            <p className="text-[11px] text-slate-500 max-w-md">
              Correlating electronic weighbridge logs, comparing distribution velocity against Miraj sub-division moving average, retrieving statutory NFSA provisions, and synthesizing forensic inspection dossier.
            </p>
          </div>
        </div>
      )}

      {/* Generated Report Container */}
      {report && (
        <div className="card p-6 bg-white border-slate-200 shadow-md animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-2xs">
                <FileCheck2 size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">AI AUDIT INSPECTION REPORT</h2>
                <p className="text-xs text-slate-500">
                  Target: <strong>{report.shopName} ({report.shopCode})</strong> • Generated:{' '}
                  {new Date(report.auditTimestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <span
                className={`badge text-xs px-3 py-1 font-bold ${
                  report.riskScore >= 70 ? 'badge-danger' : 'badge-success'
                }`}
              >
                RISK SCORE: {report.riskScore} / 100
              </span>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-5 rounded-2xl bg-[#fafaf8] border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
            {report.reportText}
          </div>

          {/* Statutory Compliance Footer Notice */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2.5">
            <ShieldAlert size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Statutory Compliance & Legal Notice:</strong> In accordance with GrainGuard AI Governance Rules and Section 30 of the Maharashtra PDS Control Order, this AI audit report generates diagnostic risk signals and does not constitute a legal charge of fraud. Any regulatory action (such as shop suspension or show-cause notice) requires independent physical verification by an authorized District/Taluka civil supplies officer.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAudit;
