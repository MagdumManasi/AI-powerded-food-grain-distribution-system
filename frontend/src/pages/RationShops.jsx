import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Store, Search, Filter, ShieldAlert, ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const RationShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await api.get('/ration-shops');
      setShops(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = shops.filter((s) => {
    const matchesSearch =
      s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shopCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fair Price Shops (FPS) Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Licensed distribution dealers, stock levels, and automated risk scoring
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute inset-y-0 left-3 my-auto text-slate-400" />
          <input
            type="text"
            placeholder="Search by shop code, name, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input text-xs w-full sm:w-44"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Shop Code</th>
              <th>Fair Price Store</th>
              <th>Dealer Name</th>
              <th>District</th>
              <th>Beneficiaries</th>
              <th>Storage Capacity</th>
              <th>Status</th>
              <th>AI Risk Indicator</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-400 text-xs">Loading ration shops...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-400 text-xs">No shops found matching filter.</td>
              </tr>
            ) : (
              filtered.map((s) => {
                const isHighRisk = s.riskScore > 50;
                return (
                  <tr key={s.id} className={isHighRisk ? 'bg-amber-50/40' : ''}>
                    <td className="font-bold text-slate-900 font-mono">{s.shopCode}</td>
                    <td>
                      <div className="font-extrabold text-slate-900">{s.shopName}</div>
                      <div className="text-[11px] text-slate-400">{s.address}</div>
                    </td>
                    <td className="text-xs text-slate-700">{s.ownerName}</td>
                    <td className="text-xs font-semibold text-slate-600">{s.district}</td>
                    <td>
                      <span className="font-bold text-slate-800">{s.beneficiaryCount}</span>
                    </td>
                    <td className="text-xs text-slate-500">{Number(s.capacity).toLocaleString()} KG</td>
                    <td>
                      <span className={`badge ${s.currentStatus === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                        {s.currentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          className={`badge ${
                            s.riskScore > 50
                              ? 'badge-danger'
                              : s.riskScore > 20
                              ? 'badge-warning'
                              : 'badge-success'
                          }`}
                        >
                          {s.riskScore > 0 ? `${s.riskScore} / 100` : 'NORMAL (0.0)'}
                        </span>
                        {isHighRisk && <ShieldAlert size={14} className="text-red-600 animate-bounce" />}
                      </div>
                    </td>
                    <td className="text-right">
                      <Link to={`/ration-shops/${s.id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} />
                        <span>Inspect</span>
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
  );
};

export default RationShops;
