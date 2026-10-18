import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
  Scale,
  Truck,
  Building2,
  FileCheck2,
  Clock,
  ShieldAlert
} from 'lucide-react';

const Receipts = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    dispatchId: '',
    quantityReceived: '',
    remarks: 'Weighbridge confirmation at shop delivery gate',
    receivedBy: user?.name ? `${user.name} (${user.role})` : 'Suresh Patil (FPS Dealer)',
  });

  const loadData = async () => {
    try {
      const [rRes, dRes] = await Promise.all([
        dataService.getReceipts(),
        dataService.getDispatches(),
      ]);
      setReceipts(rRes.data || []);
      setDispatches(dRes.data || []);
      if (dRes.data && dRes.data.length > 0 && !formData.dispatchId) {
        // Prefer in-transit or pending dispatches
        const pending = dRes.data.find((d) => d.status === 'IN_TRANSIT' || d.status === 'RECEIPT_PENDING') || dRes.data[0];
        setFormData((prev) => ({
          ...prev,
          dispatchId: pending.id,
          quantityReceived: pending.quantityDispatched,
        }));
      }
    } catch (err) {
      console.error('Error loading receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = dataService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const handleDispatchSelect = (dispatchId) => {
    const d = dispatches.find((item) => item.id === Number(dispatchId));
    setFormData((prev) => ({
      ...prev,
      dispatchId: Number(dispatchId),
      quantityReceived: d ? d.quantityDispatched : '',
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.dispatchId || formData.quantityReceived === '') return;

    setSubmitting(true);
    try {
      const selected = dispatches.find((d) => d.id === Number(formData.dispatchId));
      const res = await dataService.confirmReceipt({
        dispatchId: Number(formData.dispatchId),
        dispatchCode: selected?.dispatchCode,
        quantityReceived: parseFloat(formData.quantityReceived),
        remarks: formData.remarks,
        receivedBy: formData.receivedBy,
      });

      const shortage = (selected?.quantityDispatched || 0) - parseFloat(formData.quantityReceived);
      setShowModal(false);
      setFeedback({
        type: shortage > 0 ? 'warning' : 'success',
        message: shortage > 0
          ? `Receipt confirmed with a transit shortage of ${shortage.toFixed(1)} KG! Anomaly alert triggered for district vigilance.`
          : 'Receipt confirmed successfully! Shop stock balance has been updated.',
      });
      loadData();
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      alert(err.message || 'Error recording delivery receipt');
    } finally {
      setSubmitting(false);
    }
  };

  const totalReceipts = receipts.length;
  const discrepanciesCount = receipts.filter((r) => (r.shortageQuantity || 0) > 0).length;
  const totalShortageKg = receipts.reduce((sum, r) => sum + (r.shortageQuantity || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Grain Receipts & Reconciliation</h1>
            <span className="badge badge-info text-[10px] uppercase font-bold tracking-wider">Sangli PDS</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Verification of delivered stock versus dispatched manifest with automated electronic weighbridge shortage calculation
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-xs shadow-md flex items-center gap-2"
        >
          <CheckCircle2 size={16} />
          <span>Confirm Delivery Receipt</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${
            feedback.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {feedback.type === 'warning' ? (
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs font-semibold">{feedback.message}</div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Total Deliveries</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <FileCheck2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalReceipts}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Waybill acknowledgments in Miraj Taluka</p>
        </div>

        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Flagged Discrepancies</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-red-600 mt-2">{discrepanciesCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Exceeded NFSA tare / moisture tolerance</p>
        </div>

        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Total Shortage</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Scale size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{totalShortageKg.toLocaleString()} KG</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Unaccounted in-transit loss across shipments</p>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Receipt ID</th>
              <th>Waybill Reference</th>
              <th>Destination FPS</th>
              <th>Grain Type</th>
              <th>Dispatched (KG)</th>
              <th>Received (KG)</th>
              <th>Transit Shortage</th>
              <th>Receipt Timestamp</th>
              <th>Received By</th>
              <th>Audit Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-8 text-slate-400 text-xs">
                  Loading receipt records...
                </td>
              </tr>
            ) : receipts.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-8 text-slate-400 text-xs">
                  No receipts recorded yet. Use the button above to confirm incoming grain delivery.
                </td>
              </tr>
            ) : (
              receipts.map((r) => {
                const hasShortage = (r.shortageQuantity || 0) > 0;
                return (
                  <tr key={r.id || r.dispatchId} className={hasShortage ? 'bg-amber-50/50' : ''}>
                    <td className="font-mono text-xs font-bold text-slate-900">
                      RCPT-SAN-{r.id || r.dispatchId}
                    </td>
                    <td className="font-mono text-xs font-extrabold text-emerald-900">
                      {r.dispatchCode}
                    </td>
                    <td>
                      <div className="font-bold text-slate-900 text-xs">{r.shopName || r.shopCode}</div>
                      <div className="text-[11px] text-slate-500">{r.shopCode}</div>
                    </td>
                    <td>
                      <span className="badge badge-info text-[10px]">{r.grainTypeName || 'Fortified Rice'}</span>
                    </td>
                    <td className="text-xs text-slate-700 font-medium">
                      {Number(r.quantityDispatched || 0).toLocaleString()} KG
                    </td>
                    <td className="font-extrabold text-slate-900 text-xs">
                      {Number(r.quantityReceived || 0).toLocaleString()} KG
                    </td>
                    <td>
                      {hasShortage ? (
                        <span className="badge badge-danger flex items-center gap-1 w-max">
                          <AlertTriangle size={12} />
                          <span>- {r.shortageQuantity} KG</span>
                        </span>
                      ) : (
                        <span className="badge badge-success flex items-center gap-1 w-max">
                          <CheckCircle2 size={12} />
                          <span>0.0 KG</span>
                        </span>
                      )}
                    </td>
                    <td className="text-xs text-slate-500">
                      {r.receiptDate ? new Date(r.receiptDate).toLocaleString() : 'Recent'}
                    </td>
                    <td className="text-xs text-slate-700 font-medium">{r.receivedBy}</td>
                    <td>
                      <span className={`badge ${hasShortage ? 'badge-danger' : 'badge-success'}`}>
                        {r.status || (hasShortage ? 'DISCREPANCY_FLAGGED' : 'CONFIRMED')}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Scale size={20} className="text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">Record Delivery Weighment Receipt</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Consignment / Waybill</label>
                <select
                  value={formData.dispatchId}
                  onChange={(e) => handleDispatchSelect(e.target.value)}
                  className="form-input"
                  required
                >
                  {dispatches.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.dispatchCode} • {d.grainTypeName} ({d.quantityDispatched} KG) ➔ {d.destinationShopName || d.destinationShopCode} [{d.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Waybill info box */}
              {formData.dispatchId && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-semibold">Origin Godown</span>
                    <span className="font-bold text-slate-800">
                      {dispatches.find((d) => d.id === Number(formData.dispatchId))?.sourceWarehouseName || 'Sangli Central Godown #1'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Carrier Vehicle</span>
                    <span className="font-bold text-emerald-800 font-mono">
                      {dispatches.find((d) => d.id === Number(formData.dispatchId))?.vehicleNumber || 'MH-10-AZ-5542'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Dispatched Quantity</span>
                    <span className="font-extrabold text-slate-900">
                      {dispatches.find((d) => d.id === Number(formData.dispatchId))?.quantityDispatched} KG
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Electronic Transit Seal</span>
                    <span className="font-mono font-bold text-slate-700">
                      {dispatches.find((d) => d.id === Number(formData.dispatchId))?.sealNumber || 'SEAL-SAN-1049-K1'}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Actual Gross-Tare Net Received Quantity (KG)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={formData.quantityReceived}
                  onChange={(e) => setFormData({ ...formData, quantityReceived: e.target.value })}
                  className="form-input"
                  placeholder="e.g. 4850.0"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  * System automatically computes transit shortage: <span className="font-semibold text-slate-700">Dispatched - Received</span>. Variances &gt; 1.0% or 50 KG trigger an automated Anomaly Alert.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Weighbridge / Receipt Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="e.g. Bedag weighbridge receipt #9981 attached. Seal verified."
                  className="form-input"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Received & Acknowledged By</label>
                <input
                  type="text"
                  value={formData.receivedBy}
                  onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>{submitting ? 'Reconciling...' : 'Confirm & Reconcile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;
