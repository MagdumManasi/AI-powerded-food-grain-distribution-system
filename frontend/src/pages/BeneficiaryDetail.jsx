import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { ArrowLeft, User, CreditCard, Users, Store, History, ShieldCheck } from 'lucide-react';

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
      const [benRes, histRes] = await Promise.all([
        api.get(`/beneficiaries/${id}`),
        api.get(`/distributions/beneficiary/${id}`),
      ]);
      setBeneficiary(benRes.data.data);
      setHistory(histRes.data.data);
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

  // Calculate entitlement
  const monthlyQuotaKg = beneficiary.rationCardType === 'AAY' ? 35.0 : beneficiary.familySize * 5.0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/beneficiaries" className="btn btn-secondary btn-sm">
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
                <span className={`badge ${beneficiary.rationCardType === 'AAY' ? 'badge-warning' : 'badge-info'}`}>
                  {beneficiary.rationCardType}
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
            <p className="text-slate-500">{beneficiary.district}, {beneficiary.state}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Assigned Fair Price Shop</p>
            <p className="font-bold text-emerald-800">{beneficiary.shopName || 'Shop #' + beneficiary.assignedShopId}</p>
            <p className="text-slate-500">Shop ID: {beneficiary.assignedShopId}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Enrollment Date</p>
            <p className="font-semibold text-slate-800">{new Date(beneficiary.createdAt).toLocaleDateString()}</p>
            <p className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck size={14} />
              <span>Biometrically Seeded</span>
            </p>
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div className="card">
        <h2 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <Users size={16} className="text-emerald-700" />
          <span>Enrolled Family Members</span>
        </h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Relationship</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {beneficiary.familyMembers?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-slate-400 text-xs">No additional family members registered.</td>
                </tr>
              ) : (
                beneficiary.familyMembers?.map((fm) => (
                  <tr key={fm.id}>
                    <td className="font-bold text-slate-800">{fm.name}</td>
                    <td>{fm.relationship}</td>
                    <td>{fm.gender}</td>
                    <td>{fm.dateOfBirth || 'N/A'}</td>
                    <td><span className="badge badge-success">{fm.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution History */}
      <div className="card">
        <h2 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <History size={16} className="text-emerald-700" />
          <span>Grain Distribution Ledger History</span>
        </h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction Code</th>
                <th>Grain Category</th>
                <th>Quantity (KG)</th>
                <th>Distribution Date</th>
                <th>Operator</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-400 text-xs">No distribution records found for this beneficiary.</td>
                </tr>
              ) : (
                history.map((tx) => (
                  <tr key={tx.id}>
                    <td className="font-mono text-xs font-bold text-slate-800">{tx.transactionCode}</td>
                    <td><span className="badge badge-info">{tx.grainTypeName}</span></td>
                    <td className="font-extrabold text-slate-900">{tx.quantity} KG</td>
                    <td className="text-xs text-slate-600">{new Date(tx.distributionDate).toLocaleString()}</td>
                    <td className="text-xs text-slate-500">{tx.operatorId}</td>
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
