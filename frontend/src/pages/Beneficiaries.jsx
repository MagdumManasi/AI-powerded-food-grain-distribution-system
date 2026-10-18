import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Users, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [villageFilter, setVillageFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [shops, setShops] = useState([]);

  const [formData, setFormData] = useState({
    beneficiaryCode: '',
    name: '',
    gender: 'MALE',
    dateOfBirth: '1985-01-01',
    address: 'Bedag Village, Miraj',
    village: 'Bedag',
    district: 'Sangli',
    state: 'Maharashtra',
    rationCardNumber: '',
    cardType: 'AAY',
    familySize: 4,
    assignedShopId: 1,
  });

  const loadData = async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        dataService.getBeneficiaries(),
        dataService.getFpsShops(),
      ]);
      setBeneficiaries(bRes.data || []);
      setShops(sRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = dataService.subscribe(() => loadData());
    return () => unsub();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const selectedShop = shops.find((s) => s.id === Number(formData.assignedShopId));
      const code = formData.beneficiaryCode || `BEN-SAN-${String(beneficiaries.length + 1).padStart(3, '0')}`;
      const rcNo = formData.rationCardNumber || `RC-SAN-${formData.cardType}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newRecord = {
        ...formData,
        id: beneficiaries.length + 1,
        beneficiaryCode: code,
        rationCardNumber: rcNo,
        assignedShopCode: selectedShop?.shopCode || 'FPS-BED-001',
        assignedShopName: selectedShop?.shopName || 'Bedag Seva Fair Price Store #1',
        village: selectedShop?.village || 'Bedag',
        taluka: 'Miraj',
        district: 'Sangli',
        monthlyQuotaRiceKg: formData.cardType === 'AAY' ? 20.0 : formData.familySize * 3,
        monthlyQuotaWheatKg: formData.cardType === 'AAY' ? 15.0 : formData.familySize * 2,
        collectedRiceKg: 0.0,
        collectedWheatKg: 0.0,
        remainingRiceKg: formData.cardType === 'AAY' ? 20.0 : formData.familySize * 3,
        remainingWheatKg: formData.cardType === 'AAY' ? 15.0 : formData.familySize * 2,
        status: 'ACTIVE',
        aadhaarLinked: true,
        lastDistributionDate: null,
        familyMembers: [],
      };

      setBeneficiaries([newRecord, ...beneficiaries]);
      setShowModal(false);
      alert(`Beneficiary registered successfully under ${newRecord.assignedShopName}!`);
    } catch (err) {
      alert(err.message || 'Error registering beneficiary');
    }
  };

  const filtered = beneficiaries.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.name.toLowerCase().includes(q) ||
      (b.beneficiaryCode && b.beneficiaryCode.toLowerCase().includes(q)) ||
      (b.rationCardNumber && b.rationCardNumber.toLowerCase().includes(q));

    const matchesType = typeFilter === 'ALL' || b.cardType === typeFilter;
    const matchesVillage = villageFilter === 'ALL' || b.village === villageFilter;

    return matchesSearch && matchesType && matchesVillage;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Beneficiary Management</h1>
            <span className="badge badge-info text-[10px]">SANGLI DISTRICT • MIRAJ TALUKA</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Registered NFSA Antyodaya (AAY) and Priority Household (PHH) cardholders in Bedag & Belanki villages
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-xs shadow cursor-pointer"
        >
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
          {/* Village Filter */}
          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="form-input text-xs w-full sm:w-40"
          >
            <option value="ALL">All Villages</option>
            <option value="Bedag">Bedag Village</option>
            <option value="Belanki">Belanki Village</option>
          </select>

          {/* Scheme Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input text-xs w-full sm:w-40"
          >
            <option value="ALL">All Schemes</option>
            <option value="AAY">Antyodaya (AAY - 35 kg)</option>
            <option value="PHH">Priority (PHH - 5 kg/person)</option>
          </select>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Beneficiary Name</th>
              <th>Ration Card #</th>
              <th>Village</th>
              <th>Scheme</th>
              <th>Family</th>
              <th>Assigned Fair Price Shop</th>
              <th>Monthly Quota</th>
              <th>Aadhaar</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-400 text-xs">
                  Loading beneficiaries in Sangli district...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-400 text-xs">
                  No beneficiaries found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="font-extrabold text-slate-900 text-xs">{b.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.beneficiaryCode}</div>
                  </td>
                  <td className="font-mono text-xs font-bold text-slate-800">{b.rationCardNumber}</td>
                  <td>
                    <span className="badge badge-info text-[9px]">{b.village}</span>
                  </td>
                  <td>
                    <span className={`badge ${b.cardType === 'AAY' ? 'badge-success' : 'badge-warning'}`}>
                      {b.cardType}
                    </span>
                  </td>
                  <td className="text-xs font-semibold text-slate-600">{b.familySize} Members</td>
                  <td>
                    <div className="text-xs font-bold text-emerald-900">{b.assignedShopName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.assignedShopCode}</div>
                  </td>
                  <td>
                    <div className="text-xs font-bold text-slate-800">
                      {(b.monthlyQuotaRiceKg || 0) + (b.monthlyQuotaWheatKg || 0)} KG
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Rice: {b.monthlyQuotaRiceKg}k • Wheat: {b.monthlyQuotaWheatKg}k
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success text-[9px]">LINKED ✅</span>
                  </td>
                  <td className="text-right">
                    <Link to={`/beneficiaries/${b.id}`} className="btn btn-secondary btn-sm">
                      <Eye size={13} />
                      <span>Passbook</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Register Beneficiary */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-fade-in">
            <div className="pb-2 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">Register Beneficiary Household</h3>
              <p className="text-xs text-slate-500">
                Enrollment into Sangli District NFSA Food Grain Allocation Registry
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Head of Household Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input text-xs"
                    placeholder="e.g. Dnyaneshwar Shinde"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="form-input text-xs"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NFSA Scheme Type
                  </label>
                  <select
                    value={formData.cardType}
                    onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                    className="form-input text-xs"
                  >
                    <option value="AAY">Antyodaya Anna Yojana (AAY - 35 KG)</option>
                    <option value="PHH">Priority Household (PHH - 5 KG/person)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Family Size (Members)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={formData.familySize}
                    onChange={(e) => setFormData({ ...formData, familySize: Number(e.target.value) })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assign Fair Price Shop (Bedag & Belanki)
                </label>
                <select
                  value={formData.assignedShopId}
                  onChange={(e) => setFormData({ ...formData, assignedShopId: Number(e.target.value) })}
                  className="form-input text-xs"
                >
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shopCode} - {s.shopName} ({s.village} Village)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-input text-xs"
                  placeholder="Village Galli / Vasti address..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" className="btn btn-primary btn-sm flex-1 cursor-pointer">
                  Enroll Cardholder
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary btn-sm cursor-pointer"
                >
                  Cancel
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
