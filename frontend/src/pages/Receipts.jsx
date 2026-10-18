import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { CheckCircle2, AlertTriangle, Plus, X } from 'lucide-react';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    dispatchId: 1,
    quantityReceived: 4850.0,
    remarks: 'Weighbridge confirmation at shop delivery gate',
  });

  useEffect(() => {
    fetchReceipts();
    fetchDispatches();
  }, []);

  const fetchReceipts = async () => {
    try {
      const res = await api.get('/receipts');
      setReceipts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDispatches = async () => {
    try {
      const res = await api.get('/dispatch');
      setDispatches(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/receipts', formData);
      setShowModal(false);
      fetchReceipts();
      alert('Receipt recorded! Discrepancy evaluated and stock updated.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording receipt');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Grain Receipts & Reconciliation</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Verification of delivered stock versus dispatched manifest with automated shortage calculation
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs shadow">
          <CheckCircle2 size={16} />
          <span>Confirm Delivery Receipt</span>
        </button>
      </div>

      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Receipt ID</th>
              <th>Waybill Reference</th>
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
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">Loading receipt records...</td>
              </tr>
            ) : receipts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">No receipts recorded yet.</td>
              </tr>
            ) : (
              receipts.map((r) => {
                const hasShortage = r.shortageQuantity > 0;
                return (
                  <tr key={r.id} className={hasShortage ? 'bg-amber-50/40' : ''}>
                    <td className="font-mono text-xs font-bold text-slate-900">RCPT-{r.id}</td>
                    <td className="font-mono text-xs font-extrabold text-slate-800">{r.dispatchCode}</td>
                    <td className="text-xs text-slate-600">{Number(r.quantityDispatched).toLocaleString()} KG</td>
                    <td className="font-extrabold text-slate-900">{Number(r.quantityReceived).toLocaleString()} KG</td>
                    <td>
                      {hasShortage ? (
                        <span className="badge badge-danger flex items-center gap-1 w-max">
                          <AlertTriangle size={12} />
                          <span>- {r.shortageQuantity} KG</span>
                        </span>
                      ) : (
                        <span className="badge badge-success">0.0 KG</span>
                      )}
                    </td>
                    <td className="text-xs text-slate-500">{new Date(r.receiptDate).toLocaleString()}</td>
                    <td className="text-xs text-slate-600 font-medium">{r.receivedBy}</td>
                    <td>
                      <span className={`badge ${hasShortage ? 'badge-danger' : 'badge-success'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-black text-slate-900 text-base">Record Delivery Receipt</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Dispatch Shipment</label>
                <select
                  value={formData.dispatchId}
                  onChange={(e) => setFormData({ ...formData, dispatchId: parseInt(e.target.value) })}
                  className="form-input"
                >
                  {dispatches.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.dispatchCode} ({d.grainTypeName} - {d.quantityDispatched} KG) to {d.shopName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Actual Quantity Received (KG)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={formData.quantityReceived}
                  onChange={(e) => setFormData({ ...formData, quantityReceived: parseFloat(e.target.value) })}
                  className="form-input"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  * System will automatically compute shortage: Dispatched - Received
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Weighbridge / Receipt Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="e.g. Weighbridge printout #9981 attached"
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Reconcile
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
