import React, { useState } from 'react';
import {
  MessageSquareWarning,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Store,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../context/roles';

const MOCK_COMPLAINTS = [
  {
    id: 'GRV-2026-081',
    beneficiaryName: 'Ramesh Kumar',
    rationCard: 'RC-AAY-889901',
    shopCode: 'FPS102',
    shopName: 'Saraswati Fair Price Store',
    category: 'WEIGHMENT_SHORTAGE',
    categoryLabel: 'Weighment Shortage',
    description: 'Electronic weigh scale at shop showed 35 kg on display, but actual weight measured at home was only 33.5 kg (1.5 kg shortage).',
    date: '16 Oct 2026',
    status: 'UNDER_INVESTIGATION',
    priority: 'HIGH',
    assignedOfficer: 'Officer Rajesh Verma (DSO Pune)',
    officerNotes: 'Assigned weights & measures inspector to calibrate FPS102 scale within 48 hours.',
  },
  {
    id: 'GRV-2026-079',
    beneficiaryName: 'Sunita Kamble',
    rationCard: 'RC-PHH-665510',
    shopCode: 'FPS102',
    shopName: 'Saraswati Fair Price Store',
    category: 'OVERCHARGING',
    categoryLabel: 'Statutory Rate Overcharge',
    description: 'Dealer demanded ₹4.00 per KG for rice instead of the central government statutory rate of ₹3.00 per KG.',
    date: '15 Oct 2026',
    status: 'SHOW_CAUSE_NOTICE_ISSUED',
    priority: 'HIGH',
    assignedOfficer: 'Officer Rajesh Verma (DSO Pune)',
    officerNotes: 'Show-cause notice served to dealer Suresh Patil. Hearing scheduled on 20-Oct-2026.',
  },
  {
    id: 'GRV-2026-065',
    beneficiaryName: 'Deepak More',
    rationCard: 'RC-PHH-991203',
    shopCode: 'FPS101',
    shopName: 'Anand Fair Price Store',
    category: 'SHOP_CLOSED',
    categoryLabel: 'Irregular Shop Hours',
    description: 'Shop was found closed during official morning distribution hours (09:00 AM - 11:30 AM).',
    date: '10 Oct 2026',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    assignedOfficer: 'Officer Rajesh Verma (DSO Pune)',
    officerNotes: 'Dealer submitted medical emergency certificate. Written warning recorded on compliance file.',
  },
];

const Complaints = () => {
  const { user } = useAuth();
  const role = user?.role || ROLES.DISTRICT_OFFICER;

  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    beneficiaryName: 'Ramesh Kumar',
    rationCard: 'RC-AAY-889901',
    shopCode: 'FPS102',
    category: 'WEIGHMENT_SHORTAGE',
    description: '',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const created = {
      id: 'GRV-2026-08' + (complaints.length + 2),
      beneficiaryName: newComplaint.beneficiaryName,
      rationCard: newComplaint.rationCard,
      shopCode: newComplaint.shopCode,
      shopName: newComplaint.shopCode === 'FPS102' ? 'Saraswati Fair Price Store' : 'Anand Fair Price Store',
      category: newComplaint.category,
      categoryLabel: newComplaint.category.replace('_', ' '),
      description: newComplaint.description,
      date: 'Just now',
      status: 'UNDER_INVESTIGATION',
      priority: 'HIGH',
      assignedOfficer: 'Officer Rajesh Verma (DSO)',
      officerNotes: 'Automated intake ticket dispatched to Taluka Supply Officer for physical inspection.',
    };
    setComplaints([created, ...complaints]);
    setShowModal(false);
    alert('Citizen grievance lodged successfully! Token: ' + created.id);
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
            <span className="badge badge-warning text-[10px]">NFSA SECTION 14 OVERSIGHT</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Transparent beneficiary complaint tracking, dealer show-cause notices & statutory investigation
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-xs shadow"
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
            className={`btn btn-sm ${
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
                <span className="text-xs text-slate-400 font-semibold">{c.date}</span>
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
                <div className="text-slate-500 font-mono text-[11px]">{c.rationCard}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Accused Fair Price Shop</div>
                <div className="font-bold text-emerald-900 mt-0.5">{c.shopName}</div>
                <div className="text-slate-500 font-mono text-[11px]">Shop Code: {c.shopCode}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Investigating Authority</div>
                <div className="font-bold text-slate-800 mt-0.5">{c.assignedOfficer}</div>
                <div className="text-slate-500 text-[11px]">District Supply Office (DSO)</div>
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
                    <option value="FPS102">FPS102 - Saraswati Fair Price Store</option>
                    <option value="FPS101">FPS101 - Anand Fair Price Store</option>
                    <option value="FPS103">FPS103 - Janta Ration Agency</option>
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
                <button type="submit" className="btn btn-primary btn-sm flex-1">
                  Register Grievance
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary btn-sm"
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
