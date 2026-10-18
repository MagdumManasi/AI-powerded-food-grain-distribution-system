import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { PackageCheck, Plus, X, Search, Filter } from 'lucide-react';

const Distributions = () => {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [shops, setShops] = useState([]);

  const [formData, setFormData] = useState({
    transactionCode: '',
    beneficiaryId: 1,
    rationShopId: 2,
    grainTypeId: 1,
    quantity: 35.0,
    remarks: 'Monthly Antyodaya Anna Yojana allocation distribution',
  });

  useEffect(() => {
    fetchDistributions();
    fetchOptions();
  }, []);

  const fetchDistributions = async () => {
    try {
      const res = await api.get('/distributions');
      setDistributions(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        api.get('/beneficiaries'),
        api.get('/ration-shops'),
      ]);
      setBeneficiaries(bRes.data.data);
      setShops(sRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post('/distributions', {
        ...formData,
        transactionCode: formData.transactionCode || 'TX-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      });
      setShowModal(false);
      fetchDistributions();
      alert('Distribution recorded and deducted from shop stock!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording distribution');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Beneficiary Distribution Ledger</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time point-of-sale transactions validated against statutory entitlement rules
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs shadow">
          <Plus size={16} />
          <span>Record Distribution</span>
        </button>
      </div>

      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Receipt / Tx Code</th>
              <th>Beneficiary Name</th>
              <th>Ration Card #</th>
              <th>Fair Price Shop</th>
              <th>Grain Type</th>
              <th>Disbursed Quantity</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">Loading distribution ledger...</td>
              </tr>
            ) : distributions.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">No distribution transactions recorded yet.</td>
              </tr>
            ) : (
              distributions.map((d) => (
                <tr key={d.id}>
                  <td className="font-mono text-xs font-bold text-slate-900">{d.transactionCode}</td>
                  <td className="font-extrabold text-slate-900">{d.beneficiaryName}</td>
                  <td className="font-mono text-xs text-slate-600">{d.rationCardNumber}</td>
                  <td className="font-semibold text-emerald-800">{d.shopName}</td>
                  <td><span className="badge badge-info">{d.grainTypeName}</span></td>
                  <td className="font-black text-slate-900 text-sm">{d.quantity} KG</td>
                  <td className="text-xs text-slate-500">{new Date(d.distributionDate).toLocaleString()}</td>
                  <td><span className="badge badge-success">{d.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-black text-slate-900 text-base">Record Beneficiary Grain Issue</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecord} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Beneficiary</label>
                <select
                  value={formData.beneficiaryId}
                  onChange={(e) => setFormData({ ...formData, beneficiaryId: parseInt(e.target.value) })}
                  className="form-input"
                >
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.beneficiaryCode} - {b.rationCardType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Distributing Fair Price Shop</label>
                <select
                  value={formData.rationShopId}
                  onChange={(e) => setFormData({ ...formData, rationShopId: parseInt(e.target.value) })}
                  className="form-input"
                >
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>{s.shopCode} - {s.shopName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grain Type</label>
                  <select
                    value={formData.grainTypeId}
                    onChange={(e) => setFormData({ ...formData, grainTypeId: parseInt(e.target.value) })}
                    className="form-input"
                  >
                    <option value={1}>Rice (Raw/Parboiled)</option>
                    <option value={2}>Wheat (Sharbati)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity (KG)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="POS biometric auth verified"
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Distribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Distributions;
