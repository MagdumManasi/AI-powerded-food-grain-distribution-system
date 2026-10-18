import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { FileCheck2, Sparkles, Store, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

const AiAudit = () => {
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [loadingShops, setLoadingShops] = useState(true);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await api.get('/ration-shops');
      setShops(res.data.data);
      if (res.data.data.length > 0) {
        // Default to FPS102 if available
        const fps102 = res.data.data.find((s) => s.shopCode === 'FPS102');
        setSelectedShopId(fps102 ? fps102.id : res.data.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingShops(false);
    }
  };

  const handleRunAudit = async () => {
    if (!selectedShopId) return;
    setRunning(true);
    setReport(null);
    try {
      const res = await api.post(`/ai/audit/shop/${selectedShopId}`);
      setReport(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing AI Audit Agent');
    } finally {
      setRunning(false);
    }
  };

  const selectedShop = shops.find((s) => String(s.id) === String(selectedShopId));

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI-Assisted Shop Audit Agent</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Autonomous inspection agent cross-referencing ledger transactions, weighbridge receipts, and statutory PDS circulars
        </p>
      </div>

      {/* Target Selector Card */}
      <div className="card p-6 bg-white border-slate-200">
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
                  {s.shopCode} — {s.shopName} ({s.district}) {s.riskScore > 50 ? '⚠️ High Risk (' + s.riskScore + ')' : ''}
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
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store size={16} className="text-emerald-700" />
              <span className="font-bold text-slate-800">{selectedShop.shopName}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">Dealer: {selectedShop.ownerName}</span>
            </div>
            <div>
              <span className={`badge ${selectedShop.riskScore > 50 ? 'badge-danger' : 'badge-success'}`}>
                Risk Score: {selectedShop.riskScore} / 100
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Audit Report Container */}
      {running && (
        <div className="card p-8 text-center bg-white border-slate-200">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-700">Audit Agent in progress...</p>
            <p className="text-[11px] text-slate-400 max-w-sm">
              Retrieving inventory balances, computing deviation against moving average, querying RAG policy vector knowledge base, and synthesizing grounded audit findings.
            </p>
          </div>
        </div>
      )}

      {report && (
        <div className="card p-6 bg-white border-slate-200 animate-fade-in space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <FileCheck2 size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">AI AUDIT INSPECTION REPORT</h2>
                <p className="text-xs text-slate-500">
                  Target: <strong>{report.shopName} ({report.shopCode})</strong> • Audit Date: {new Date(report.auditTimestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <span className="badge badge-danger text-xs px-3 py-1">
              RISK SCORE: {report.riskScore}
            </span>
          </div>

          {/* Generated AI Analysis Markdown Rendering */}
          <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
            {report.reportText}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2">
            <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Statutory Compliance Notice:</strong> In compliance with GrainGuard AI Safety Rules, this AI audit report generates explainable advisory indicators and does not constitute a legal charge of fraud. The findings have been logged to the permanent audit trail for human officer inspection.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAudit;
