import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Search, Plus, Filter, Users, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [shops, setShops] = useState([]);

  const [formData, setFormData] = useState({
    beneficiaryCode: '',
    name: '',
    gender: 'MALE',
    dateOfBirth: '1985-01-01',
    address: '',
    district: 'Pune',
    state: 'Maharashtra',
    rationCardNumber: '',
    rationCardType: 'AAY',
    familySize: 4,
    assignedShopId: 2,
  });

  useEffect(() => {
    fetchBeneficiaries();
    fetchShops();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const res = await api.get('/beneficiaries');
      setBeneficiaries(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await api.get('/ration-shops');
      setShops(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/beneficiaries', formData);
      setShowModal(false);
      fetchBeneficiaries();
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering beneficiary');
    }
  };

  const filtered = beneficiaries.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.beneficiaryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.rationCardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || b.rationCardType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Beneficiary Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Registered NFSA Antyodaya (AAY) and Priority Household (PHH) cardholders
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs shadow">
          <Plus size={16} />
          <span>Register Beneficiary</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute inset-y-0 left-3 my-auto text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, code, or ration card..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input text-xs w-full sm:w-44"
          >
            <option value="ALL">All Card Categories</option>
            <option value="AAY">AAY (Antyodaya Anna)</option>
            <option value="PHH">PHH (Priority Household)</option>
            <option value="NPHH">NPHH (Non-Priority)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Beneficiary Code</th>
              <th>Beneficiary Name</th>
              <th>Ration Card #</th>
              <th>Category</th>
              <th>Family Members</th>
              <th>Assigned FPS</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">Loading beneficiaries...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">No beneficiaries found matching criteria.</td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id}>
                  <td className="font-bold text-slate-800">{b.beneficiaryCode}</td>
                  <td>
                    <div className="font-bold text-slate-900">{b.name}</div>
                    <div className="text-[11px] text-slate-400">{b.district}, {b.state}</div>
                  </td>
                  <td className="font-mono text-xs">{b.rationCardNumber}</td>
                  <td>
                    <span className={`badge ${b.rationCardType === 'AAY' ? 'badge-warning' : 'badge-info'}`}>
                      {b.rationCardType}
                    </span>
                  </td>
                  <td>{b.familySize} Members</td>
                  <td className="font-semibold text-emerald-800">{b.shopName || 'Shop #' + b.assignedShopId}</td>
                  <td>
                    <span className="badge badge-success">{b.status}</span>
                  </td>
                  <td className="text-right">
                    <Link to={`/beneficiaries/${b.id}`} className="btn btn-secondary btn-sm">
                      <Eye size={14} />
                      <span>Profile</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-black text-slate-900 text-base">Register New PDS Beneficiary</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Beneficiary Code</label>
                  <input
                    type="text"
                    required
                    value={formData.beneficiaryCode}
                    onChange={(e) => setFormData({ ...formData, beneficiaryCode: e.target.value })}
                    placeholder="e.g. BEN-1005"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Head of Family Name"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ration Card Number</label>
                  <input
                    type="text"
                    required
                    value={formData.rationCardNumber}
                    onChange={(e) => setFormData({ ...formData, rationCardNumber: e.target.value })}
                    placeholder="RC-AAY-123456"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category Scheme</label>
                  <select
                    value={formData.rationCardType}
                    onChange={(e) => setFormData({ ...formData, rationCardType: e.target.value })}
                    className="form-input"
                  >
                    <option value="AAY">AAY (Antyodaya Anna Yojana)</option>
                    <option value="PHH">PHH (Priority Household)</option>
                    <option value="NPHH">NPHH (Non-Priority)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Family Size</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={formData.familySize}
                    onChange={(e) => setFormData({ ...formData, familySize: parseInt(e.target.value) })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Ration Shop</label>
                  <select
                    value={formData.assignedShopId}
                    onChange={(e) => setFormData({ ...formData, assignedShopId: parseInt(e.target.value) })}
                    className="form-input"
                  >
                    {shops.map((s) => (
                      <option key={s.id} value={s.id}>{s.shopCode} - {s.shopName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street / Village / Ward"
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;
