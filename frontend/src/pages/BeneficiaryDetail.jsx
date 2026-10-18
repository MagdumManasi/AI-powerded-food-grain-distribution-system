import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, CreditCard, Users, Store, History, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { dataService } from '../services/dataService';

const BeneficiaryDetail = () => {
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [benRes, distRes] = await Promise.all([
        dataService.getBeneficiaryById(id),
        dataService.getDistributions({ beneficiaryId: id }),
      ]);
      setBeneficiary(benRes.data);
      setHistory(distRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-semibold text-slate-500 animate-pulse">Loading beneficiary profile...</div>
      </div>
    );
  }

  if (!beneficiary) {
    return <div className="p-4 text-center text-sm text-red-600">Beneficiary record not found.</div>;
  }

  const monthlyQuotaKg =
    beneficiary.cardType === 'AAY' ? 35.0 : beneficiary.familySize * 5.0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/beneficiaries" className="btn btn-secondary btn-sm cursor-pointer">
          <ArrowLeft size={14} />
          <span>Back to Beneficiaries</span>
        </Link>
        <span className="text-xs text-slate-400">/</span>
        <span className="text-xs font-bold text-slate-600">{beneficiary.beneficiaryCode}</span>
      </div>

      {/* Profile Overview Card */}
      <div className="card bg-white p-6 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl">
              {beneficiary.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">{beneficiary.name}</h1>
                <span className={`badge ${beneficiary.cardType === 'AAY' ? 'badge-warning' : 'badge-info'}`}>
                  {beneficiary.cardType} SCHEME
                </span>
                <span className="badge badge-success">{beneficiary.status}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ration Card: <span className="font-mono font-bold text-slate-700">{beneficiary.rationCardNumber}</span> | Family Members: {beneficiary.familySize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 px-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Monthly Entitlement Quota</p>
              <div className="text-2xl font-black text-emerald-950">
                {monthlyQuotaKg} <span className="text-xs font-semibold text-emerald-700">KG / Month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Residential Address</p>
            <p className="font-semibold text-slate-800">{beneficiary.address || 'Address on record'}</p>
            <p className="text-slate-500">{beneficiary.village} Village, Miraj Taluka, Sangli</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Assigned Fair Price Shop</p>
            <p className="font-bold text-emerald-800">{beneficiary.assignedShopName}</p>
            <p className="text-slate-500">Shop Code: {beneficiary.assignedShopCode}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Aadhaar Seeding Status</p>
            <p className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>100% Aadhaar Verified (UIDAI Seeded)</span>
            </p>
            <p className="text-slate-500">Biometric POS Disbursal Enabled</p>
          </div>
        </div>
      </div>

      {/* Quota Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card border-emerald-200 bg-emerald-50/40">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-emerald-900">Fortified Rice Quota</span>
            <span className="text-xs font-bold text-emerald-800">₹3.00 / KG</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">{beneficiary.monthlyQuotaRiceKg || 20} KG</div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{
                width: `${Math.min(100, ((beneficiary.collectedRiceKg || 0) / (beneficiary.monthlyQuotaRiceKg || 1)) * 100)}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Collected: {beneficiary.collectedRiceKg || 0} KG</span>
            <span className="font-bold text-emerald-800">Remaining: {beneficiary.remainingRiceKg || 0} KG</span>
          </div>
        </div>

        <div className="card border-amber-200 bg-amber-50/40">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-amber-900">Quality Wheat Quota</span>
            <span className="text-xs font-bold text-amber-800">₹2.00 / KG</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">{beneficiary.monthlyQuotaWheatKg || 15} KG</div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-amber-600 h-full rounded-full"
              style={{
                width: `${Math.min(100, ((beneficiary.collectedWheatKg || 0) / (beneficiary.monthlyQuotaWheatKg || 1)) * 100)}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Collected: {beneficiary.collectedWheatKg || 0} KG</span>
            <span className="font-bold text-amber-800">Remaining: {beneficiary.remainingWheatKg || 0} KG</span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900">Ration Distribution History</h2>
          <span className="text-xs text-slate-400 font-semibold">{history.length} Transactions</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Grain Commodity</th>
                <th>Quantity</th>
                <th>Subsidized Fee</th>
                <th>Date</th>
                <th>Biometric Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-400 text-xs">
                    No grain distributions recorded for this cardholder in the current period.
                  </td>
                </tr>
              ) : (
                history.map((tx) => (
                  <tr key={tx.id}>
                    <td className="font-mono text-xs font-bold">{tx.transactionCode}</td>
                    <td><span className="badge badge-info">{tx.grainTypeName}</span></td>
                    <td className="font-bold text-slate-900 text-xs">{tx.quantityKg} KG</td>
                    <td className="font-mono text-emerald-900 font-bold text-xs">₹{tx.totalAmountPaid}.00</td>
                    <td className="text-slate-500 text-xs font-mono">
                      {new Date(tx.distributionDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="badge badge-success text-[9px]">{tx.biometricVerificationMode}</span>
                    </td>
                    <td><span className="badge badge-success">{tx.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetail;
