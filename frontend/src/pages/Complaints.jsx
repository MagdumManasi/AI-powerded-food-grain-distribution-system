import React, { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { dataService } from '../services/dataService';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    beneficiaryName: 'Tukaram Shinde',
    rationCard: 'RC-SAN-AAY-1001',
    village: 'Bedag',
    shopCode: 'FPS-BED-001',
    category: 'WEIGHMENT_SHORTAGE',
    description: '',
  });

  const fetchComplaints = async () => {
    try {
      const res = await dataService.getComplaints();
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    const unsub = dataService.subscribe(() => fetchComplaints());
    return () => unsub();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await dataService.submitComplaint(newComplaint);
      setShowModal(false);
      alert(`Citizen grievance lodged successfully in Sangli District PDS Portal! Token: ${res.data?.id}`);
    } catch (err) {
      alert(err.message || 'Error submitting grievance');
    }
  };

  const filtered = complaints.filter((c) => {
    if (filterCategory === 'ALL') return true;
    return c.category === filterCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Citizen Grievance Redressal Portal</h1>
            <span className="badge badge-warning text-[10px]">SANGLI DISTRICT OVERSIGHT</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Transparent beneficiary complaint tracking in Bedag & Belanki villages under NFSA Section 14
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-xs shadow cursor-pointer"
        >
          <Plus size={16} />
          <span>Lodge Grievance</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase mr-1">Filter By:</span>
        {['ALL', 'WEIGHMENT_SHORTAGE', 'OVERCHARGING', 'SHOP_CLOSED'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`btn btn-sm cursor-pointer ${
              filterCategory === cat ? 'btn-primary' : 'btn-secondary text-slate-600'
            }`}
          >
            {cat === 'ALL' ? 'All Grievances' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grievances List */}
      <div className="space-y-4">
        {filtered.map((c) => (
          <div key={c.id} className="card border-slate-200 hover:border-slate-300 transition space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                  {c.id}
                </span>
                <span className="badge badge-danger text-[9px]">{c.categoryLabel}</span>
                <span className="text-xs text-slate-400 font-semibold">
                  {new Date(c.date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`badge ${
                  c.status === 'RESOLVED'
                    ? 'badge-success'
                    : c.status === 'SHOW_CAUSE_NOTICE_ISSUED'
                    ? 'badge-danger'
                    : 'badge-warning'
                }`}>
                  {c.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Complainant (Beneficiary)</div>
                <div className="font-bold text-slate-900 mt-0.5">{c.beneficiaryName}</div>
                <div className="text-slate-500 font-mono text-[11px]">{c.rationCard} ({c.village} Village)</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Accused Fair Price Shop</div>
                <div className="font-bold text-emerald-900 mt-0.5">{c.shopName}</div>
                <div className="text-slate-500 font-mono text-[11px]">Shop Code: {c.shopCode}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Investigating Authority</div>
                <div className="font-bold text-slate-800 mt-0.5">{c.assignedOfficer}</div>
                <div className="text-slate-500 text-[11px]">District Supply Office (Sangli)</div>
              </div>
            </div>

            {/* Description Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <strong>Grievance Allegation:</strong> {c.description}
            </div>

            {/* Officer Action / Notes */}
            {c.officerNotes && (
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Official Action Recorded:</strong> {c.officerNotes}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Lodge Grievance */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-fade-in">
            <div className="pb-2 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">Lodge Statutory PDS Grievance</h3>
              <p className="text-xs text-slate-500">
                Registered under National Food Security Act (NFSA) Section 14 Grievance Redressal
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Beneficiary Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newComplaint.beneficiaryName}
                    onChange={(e) => setNewComplaint({ ...newComplaint, beneficiaryName: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ration Card #
                  </label>
                  <input
                    type="text"
                    required
                    value={newComplaint.rationCard}
                    onChange={(e) => setNewComplaint({ ...newComplaint, rationCard: e.target.value })}
                    className="form-input text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Fair Price Shop
                  </label>
                  <select
                    value={newComplaint.shopCode}
                    onChange={(e) => setNewComplaint({ ...newComplaint, shopCode: e.target.value })}
                    className="form-input text-xs"
                  >
                    <option value="FPS-BED-001">FPS-BED-001 - Bedag Seva Store #1</option>
                    <option value="FPS-BED-002">FPS-BED-002 - Jai Kisan Kendra (Bedag)</option>
                    <option value="FPS-BEL-001">FPS-BEL-001 - Belanki Sahakari FPS</option>
                    <option value="FPS-BEL-002">FPS-BEL-002 - Belanki Gramin Kendra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Grievance Category
                  </label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                    className="form-input text-xs"
                  >
                    <option value="WEIGHMENT_SHORTAGE">Weighment Shortage</option>
                    <option value="OVERCHARGING">Overcharging Above Statutory Rate</option>
                    <option value="SHOP_CLOSED">Shop Closed During Regular Hours</option>
                    <option value="SUBSTANDARD_QUALITY">Substandard Grain Quality</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Incident Description
                </label>
                <textarea
                  required
                  rows="3"
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  placeholder="Detail the exact incident, date, and shortage amount..."
                  className="form-input text-xs"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" className="btn btn-primary btn-sm flex-1 cursor-pointer">
                  Register Grievance
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

export default Complaints;
