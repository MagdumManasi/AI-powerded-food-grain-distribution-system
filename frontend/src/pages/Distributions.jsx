import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import {
  PackageCheck,
  Plus,
  X,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  UserCheck,
  Scale
} from 'lucide-react';

const Distributions = () => {
  const { user } = useAuth();
  const [distributions, setDistributions] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [search, setSearch] = useState('');
  const [villageFilter, setVillageFilter] = useState('ALL');
  const [cardFilter, setCardFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    beneficiaryId: '',
    rationShopId: '',
    grainTypeId: 1,
    quantity: 20.0,
    remarks: 'Monthly allocation issued via e-PoS fingerprint authentication',
  });

  const loadData = async () => {
    try {
      const [dRes, bRes, sRes] = await Promise.all([
        dataService.getDistributions(),
        dataService.getBeneficiaries(),
        dataService.getFpsShops(),
      ]);
      setDistributions(dRes.data || []);
      setBeneficiaries(bRes.data || []);
      setShops(sRes.data || []);

      if (bRes.data && bRes.data.length > 0 && !formData.beneficiaryId) {
        const first = bRes.data[0];
        setFormData((prev) => ({
          ...prev,
          beneficiaryId: first.id,
          rationShopId: first.assignedShopId || 1,
        }));
      }
    } catch (err) {
      console.error('Error loading distributions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = dataService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const handleBeneficiarySelect = (bId) => {
    const b = beneficiaries.find((item) => item.id === Number(bId));
    if (b) {
      setFormData((prev) => ({
        ...prev,
        beneficiaryId: b.id,
        rationShopId: b.assignedShopId || prev.rationShopId,
        quantity: prev.grainTypeId === 1 ? Math.min(20, b.remainingRiceKg || 20) : Math.min(15, b.remainingWheatKg || 15),
      }));
    }
  };

  const handleGrainTypeChange = (gId) => {
    const grainId = Number(gId);
    const b = beneficiaries.find((item) => item.id === Number(formData.beneficiaryId));
    let suggestedQty = 20;
    if (b) {
      suggestedQty = grainId === 1 ? Math.min(20, b.remainingRiceKg || 20) : Math.min(15, b.remainingWheatKg || 15);
    }
    setFormData((prev) => ({
      ...prev,
      grainTypeId: grainId,
      quantity: suggestedQty > 0 ? suggestedQty : 5,
    }));
  };

  const handleRecord = async (e) => {
    e.preventDefault();
    if (!formData.beneficiaryId) return;

    setSubmitting(true);
    try {
      const selectedB = beneficiaries.find((b) => b.id === Number(formData.beneficiaryId));
      const res = await dataService.recordDistribution({
        beneficiaryId: Number(formData.beneficiaryId),
        rationShopId: Number(formData.rationShopId),
        grainTypeId: Number(formData.grainTypeId),
        quantity: parseFloat(formData.quantity),
        remarks: formData.remarks,
        operatorId: user?.email || 'fps.demo@example.com',
      });

      setShowModal(false);
      setFeedback({
        type: 'success',
        message: `Issued ${formData.quantity} KG grain to ${selectedB?.name} (${selectedB?.rationCardNumber}). Quota updated & stock deducted.`,
      });
      loadData();
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      alert(err.message || 'Error recording distribution');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBeneficiary = beneficiaries.find((b) => b.id === Number(formData.beneficiaryId));
  const ratePerKg = Number(formData.grainTypeId) === 1 ? 3.0 : 2.0;
  const calculatedTotal = (parseFloat(formData.quantity || 0) * ratePerKg).toFixed(2);

  // Filter distributions
  const filteredDistributions = distributions.filter((d) => {
    if (villageFilter !== 'ALL' && d.village?.toLowerCase() !== villageFilter.toLowerCase()) return false;
    if (cardFilter !== 'ALL' && d.cardType !== cardFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = d.beneficiaryName?.toLowerCase().includes(q);
      const matchCard = d.rationCardNumber?.toLowerCase().includes(q);
      const matchCode = d.transactionCode?.toLowerCase().includes(q);
      const matchShop = d.shopName?.toLowerCase().includes(q);
      if (!matchName && !matchCard && !matchCode && !matchShop) return false;
    }
    return true;
  });

  const totalDisbursedKg = distributions.reduce((sum, d) => sum + (d.quantityKg || d.quantity || 0), 0);
  const totalValuePaid = distributions.reduce((sum, d) => sum + (d.totalAmountPaid || (d.quantity || 0) * 3), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Beneficiary Distribution Ledger</h1>
            <span className="badge badge-info text-[10px] uppercase font-bold tracking-wider">Sangli PDS</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time electronic Point-of-Sale (e-PoS) transactions validated against statutory NFSA entitlement rules
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-xs shadow-md flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Record Grain Disbursal</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-start gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold">{feedback.message}</div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Total e-PoS Disbursals</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{distributions.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Biometric transactions logged</p>
        </div>

        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Total Grain Issued</span>
          <p className="text-2xl font-black text-emerald-800 mt-2">{totalDisbursedKg.toLocaleString()} KG</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Fortified Rice & Sharbati Wheat</p>
        </div>

        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Subsidized Citizen Value</span>
          <p className="text-2xl font-black text-slate-900 mt-2">₹{totalValuePaid.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Collected at statutory issue price</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 bg-white border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 w-full">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by citizen name, ration card #, transaction ID..."
            className="form-input text-xs flex-1"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={15} className="text-slate-400" />
          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="form-input text-xs w-36"
          >
            <option value="ALL">All Villages</option>
            <option value="Bedag">Bedag (416410)</option>
            <option value="Belanki">Belanki (416418)</option>
          </select>

          <select
            value={cardFilter}
            onChange={(e) => setCardFilter(e.target.value)}
            className="form-input text-xs w-36"
          >
            <option value="ALL">All Card Types</option>
            <option value="AAY">AAY (Antyodaya)</option>
            <option value="PHH">PHH (Priority)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Receipt / Tx Code</th>
              <th>Beneficiary Name</th>
              <th>Ration Card #</th>
              <th>Village</th>
              <th>Fair Price Shop</th>
              <th>Grain Type</th>
              <th>Disbursed Quantity</th>
              <th>Amount Paid</th>
              <th>Biometric Auth</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-8 text-slate-400 text-xs">
                  Loading distribution ledger...
                </td>
              </tr>
            ) : filteredDistributions.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-8 text-slate-400 text-xs">
                  No distribution transactions matching criteria.
                </td>
              </tr>
            ) : (
              filteredDistributions.map((d) => (
                <tr key={d.id}>
                  <td className="font-mono text-xs font-bold text-slate-900">{d.transactionCode}</td>
                  <td>
                    <div className="font-extrabold text-slate-900 text-xs">{d.beneficiaryName}</div>
                    <span className="badge badge-warning text-[10px] mt-0.5">{d.cardType || 'AAY'}</span>
                  </td>
                  <td className="font-mono text-xs text-slate-600">{d.rationCardNumber}</td>
                  <td className="text-xs text-slate-700 font-medium">{d.village || 'Bedag'}</td>
                  <td className="font-semibold text-emerald-900 text-xs">{d.shopName || d.shopCode}</td>
                  <td>
                    <span className="badge badge-info text-[10px]">{d.grainTypeName || 'Rice'}</span>
                  </td>
                  <td className="font-black text-slate-900 text-sm">
                    {d.quantityKg || d.quantity} KG
                  </td>
                  <td className="font-bold text-slate-800 text-xs">
                    ₹{d.totalAmountPaid ? d.totalAmountPaid.toFixed(2) : ((d.quantity || 0) * 3).toFixed(2)}
                  </td>
                  <td className="text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-800 font-medium">
                      <UserCheck size={12} className="text-emerald-600" />
                      <span>Fingerprint Verified</span>
                    </span>
                  </td>
                  <td className="text-xs text-slate-500">
                    {d.distributionDate ? new Date(d.distributionDate).toLocaleString() : 'Recent'}
                  </td>
                  <td>
                    <span className="badge badge-success text-[10px]">{d.status || 'COMPLETED'}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Disbursal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">Record Beneficiary Grain Issue (e-PoS)</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecord} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Beneficiary Citizen</label>
                <select
                  value={formData.beneficiaryId}
                  onChange={(e) => handleBeneficiarySelect(e.target.value)}
                  className="form-input"
                  required
                >
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.rationCardNumber} - {b.cardType}) — {b.village}
                    </option>
                  ))}
                </select>
              </div>

              {/* Beneficiary Quota Info Pill */}
              {selectedBeneficiary && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-semibold">Ration Card Type</span>
                    <span className="font-bold text-slate-800">
                      {selectedBeneficiary.cardType} ({selectedBeneficiary.cardType === 'AAY' ? '35 KG / Month' : '5 KG / Member'})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Assigned FPS Shop</span>
                    <span className="font-bold text-emerald-800">
                      {selectedBeneficiary.assignedShopName || selectedBeneficiary.assignedShopCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Remaining Rice Quota</span>
                    <span className="font-black text-emerald-700">
                      {selectedBeneficiary.remainingRiceKg ?? 20} KG
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Remaining Wheat Quota</span>
                    <span className="font-black text-amber-700">
                      {selectedBeneficiary.remainingWheatKg ?? 15} KG
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Distributing Fair Price Shop</label>
                <select
                  value={formData.rationShopId}
                  onChange={(e) => setFormData({ ...formData, rationShopId: parseInt(e.target.value) })}
                  className="form-input"
                  required
                >
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shopCode} — {s.shopName} ({s.village})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grain Type</label>
                  <select
                    value={formData.grainTypeId}
                    onChange={(e) => handleGrainTypeChange(e.target.value)}
                    className="form-input"
                  >
                    <option value={1}>Fortified Rice @ ₹3.00/kg</option>
                    <option value={2}>Sharbati Wheat @ ₹2.00/kg</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity to Disburse (KG)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Price Calculation Pill */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-emerald-900 font-semibold">
                  Subsidized Central Issue Rate ({formData.quantity || 0} KG × ₹{ratePerKg.toFixed(2)})
                </span>
                <span className="text-emerald-950 font-black text-base">
                  ₹{calculatedTotal}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Biometric Verification Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="POS fingerprint match 98%"
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
                  <span>{submitting ? 'Authenticating...' : 'Authorize Disbursal'}</span>
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
