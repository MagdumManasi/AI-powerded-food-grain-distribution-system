import React, { useState } from 'react';
import {
  CreditCard,
  User,
  Users,
  Store,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  ShieldCheck,
  Wheat,
  Clock,
  MapPin,
  MessageSquareWarning,
  Sparkles,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BeneficiaryPortal = () => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  const [complaintForm, setComplaintForm] = useState({
    category: 'WEIGHMENT_SHORTAGE',
    description: '',
  });

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    setGrievanceSubmitted(true);
    setTimeout(() => {
      setShowGrievanceModal(false);
      setGrievanceSubmitted(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Citizen Digital Ration Passbook</h1>
            <span className="badge badge-success text-[10px]">NFSA CITIZEN PORTAL</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Transparent quota entitlement, biometric distribution receipts & grievance redressal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrievanceModal(true)}
            className="btn btn-secondary text-xs"
          >
            <MessageSquareWarning size={14} className="text-amber-600" />
            <span>Report Issue / Grievance</span>
          </button>
          <button
            onClick={() => setShowReceipt(true)}
            className="btn btn-primary text-xs shadow"
          >
            <Printer size={14} />
            <span>Print Latest Receipt</span>
          </button>
        </div>
      </div>

      {/* Ration Card Visual Passbook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Digital Card Widget */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-900 via-emerald-800 to-green-950 text-white shadow-xl relative overflow-hidden border border-emerald-700">
            {/* Indian Flag Watermark style badge */}
            <div className="flex items-center justify-between mb-4 border-b border-emerald-700/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={22} className="text-amber-400" />
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200">
                    Government of Maharashtra
                  </div>
                  <div className="text-xs font-black tracking-tight text-white">NATIONAL FOOD SECURITY CARD</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-amber-950 uppercase">
                AAY SCHEME
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold">Ration Card Number</div>
                <div className="text-xl font-mono font-black tracking-wider text-white">RC-AAY-889901</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Head of Household</div>
                  <div className="font-bold text-white text-sm">Ramesh Kumar</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Family Members</div>
                  <div className="font-bold text-white text-sm">4 Beneficiaries</div>
                </div>
              </div>

              <div className="text-xs pt-2 border-t border-emerald-700/60 flex items-center justify-between text-emerald-200">
                <div>Village: <strong className="text-white">Hadapsar</strong></div>
                <div>Taluka: <strong className="text-white">Haveli, Pune</strong></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-700/60 flex items-center justify-between text-[10px] text-emerald-300 font-mono">
              <span>Biometric Aadhaar: LINKED ✅</span>
              <span>Valid Thru: 2030</span>
            </div>
          </div>

          {/* Assigned Fair Price Shop (FPS) */}
          <div className="card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-emerald-700" />
                <h3 className="text-sm font-extrabold text-slate-900">Assigned Fair Price Shop</h3>
              </div>
              <span className="badge badge-success text-[9px]">450m AWAY</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-black text-slate-900 text-sm">Saraswati Fair Price Store (FPS102)</div>
              <div className="text-slate-600 flex items-center gap-1.5">
                <User size={13} className="text-slate-400 shrink-0" />
                <span>Authorized Dealer: <strong>Suresh Patil</strong></span>
              </div>
              <div className="text-slate-600 flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400 shrink-0" />
                <span>45 Market Yard, Hadapsar, Haveli, Pune</span>
              </div>
              <div className="text-slate-600 flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400 shrink-0" />
                <span>Open: 08:00 - 13:00 & 15:00 - 19:00 (Tue - Sun)</span>
              </div>
              <div className="text-slate-600 flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400 shrink-0" />
                <span>Dealer Contact: +91 98765 43212</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Current Month Quota & Entitlement Status */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Current Month Quota Status (October 2026)</h2>
                <p className="text-xs text-slate-500">Statutory Antyodaya Anna Yojana (AAY) monthly allocation</p>
              </div>
              <span className="badge badge-success text-xs font-bold">100% DISBURSED</span>
            </div>

            {/* Grain Quota Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rice Card */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wheat size={18} className="text-emerald-700" />
                    <span className="font-extrabold text-sm text-emerald-950">Fortified Rice</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">₹3.00 / KG</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-2xl font-black text-slate-900">20.0 KG</span>
                  <span className="text-xs text-slate-500 font-bold">Quota: 20 KG</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full w-full"></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 pt-1 font-semibold">
                  <span>Collected: 20.0 KG</span>
                  <span className="text-emerald-800 font-bold">Remaining: 0.0 KG</span>
                </div>
              </div>

              {/* Wheat Card */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wheat size={18} className="text-amber-700" />
                    <span className="font-extrabold text-sm text-amber-950">Quality Wheat</span>
                  </div>
                  <span className="text-xs font-bold text-amber-800">₹2.00 / KG</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-2xl font-black text-slate-900">15.0 KG</span>
                  <span className="text-xs text-slate-500 font-bold">Quota: 15 KG</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full w-full"></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 pt-1 font-semibold">
                  <span>Collected: 15.0 KG</span>
                  <span className="text-amber-800 font-bold">Remaining: 0.0 KG</span>
                </div>
              </div>
            </div>

            {/* Total Payment Note */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Total Statutory Monthly Subsidized Fee:</span>
              <span className="text-base font-black text-emerald-900 font-mono">₹90.00 (PAID)</span>
            </div>
          </div>

          {/* Enrolled Family Members Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-emerald-700" />
                <h3 className="text-sm font-extrabold text-slate-900">Registered Family Members (4)</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">AADHAAR SEEDED 100%</span>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Relationship</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Aadhaar Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold text-slate-900">Ramesh Kumar</td>
                    <td>Head (Self)</td>
                    <td>Male</td>
                    <td>42 Yrs</td>
                    <td><span className="badge badge-success text-[9px]">LINKED & ACTIVE</span></td>
                  </tr>
                  <tr>
                    <td className="font-bold text-slate-900">Sunita Kumar</td>
                    <td>Wife</td>
                    <td>Female</td>
                    <td>39 Yrs</td>
                    <td><span className="badge badge-success text-[9px]">LINKED & ACTIVE</span></td>
                  </tr>
                  <tr>
                    <td className="font-bold text-slate-900">Rohan Kumar</td>
                    <td>Son</td>
                    <td>Male</td>
                    <td>14 Yrs</td>
                    <td><span className="badge badge-success text-[9px]">LINKED & ACTIVE</span></td>
                  </tr>
                  <tr>
                    <td className="font-bold text-slate-900">Priya Kumar</td>
                    <td>Daughter</td>
                    <td>Female</td>
                    <td>10 Yrs</td>
                    <td><span className="badge badge-success text-[9px]">LINKED & ACTIVE</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Digital Cash Memo / Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="text-center pb-3 border-b border-slate-200">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                DEPARTMENT OF FOOD & CIVIL SUPPLIES
              </div>
              <h3 className="text-base font-black text-slate-900">Electronic e-PoS Cash Memo</h3>
              <p className="text-[10px] text-slate-500">Transaction ID: TX-DIST-101 • 17-Oct-2026 11:32 AM</p>
            </div>

            <div className="text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span>Beneficiary Name:</span>
                <strong>Ramesh Kumar</strong>
              </div>
              <div className="flex justify-between">
                <span>Ration Card:</span>
                <strong className="font-mono">RC-AAY-889901</strong>
              </div>
              <div className="flex justify-between">
                <span>Shop Code:</span>
                <strong>FPS102 (Saraswati Store)</strong>
              </div>
              <div className="flex justify-between">
                <span>e-PoS Operator:</span>
                <span>fps102@grainguard.gov.in</span>
              </div>
              <div className="flex justify-between">
                <span>Biometric Auth:</span>
                <strong className="text-emerald-700">Aadhaar Fingerprint Verified (98%)</strong>
              </div>
            </div>

            <div className="table-container my-2">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Rice (Fortified)</td>
                    <td>20.0 KG</td>
                    <td>₹3.00</td>
                    <td className="text-right">₹60.00</td>
                  </tr>
                  <tr>
                    <td>Wheat (Grain)</td>
                    <td>15.0 KG</td>
                    <td>₹2.00</td>
                    <td className="text-right">₹30.00</td>
                  </tr>
                  <tr className="font-black bg-slate-50">
                    <td colSpan="3">Total Subsidized Amount:</td>
                    <td className="text-right text-emerald-900">₹90.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[10px] text-slate-400 text-center font-mono">
              Digitally Signed & Synced to State Food Security Database
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="btn btn-primary btn-sm flex-1"
              >
                <Printer size={14} />
                <span>Print Memo</span>
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Grievance Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div>
              <h3 className="text-base font-black text-slate-900">File Citizen Grievance / Complaint</h3>
              <p className="text-xs text-slate-500">
                Directly submitted to District Supply Officer (DSO) Rajesh Verma for statutory investigation
              </p>
            </div>

            {grievanceSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs text-center space-y-1">
                <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Grievance Registered Successfully!</div>
                <div>Complaint Tracking Token: <strong>GRV-2026-081</strong></div>
                <p className="text-[11px] text-slate-500">An officer will inspect shop FPS102 within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nature of Complaint
                  </label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    className="form-input text-xs"
                  >
                    <option value="WEIGHMENT_SHORTAGE">Weighment Discrepancy (Shop scale gave less grain)</option>
                    <option value="OVERCHARGING">Overcharging (Charged more than ₹3/kg rice or ₹2/kg wheat)</option>
                    <option value="SHOP_CLOSED">Shop was closed during official operational hours</option>
                    <option value="SUBSTANDARD_QUALITY">Substandard Grain Quality / Adulteration</option>
                    <option value="BIOMETRIC_REFUSAL">Dealer refused grain stating biometric failure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Describe Incident & Date
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    placeholder="Enter details of what occurred at Saraswati Fair Price Store (FPS102)..."
                    className="form-input text-xs"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button type="submit" className="btn btn-primary btn-sm flex-1">
                    Submit Grievance to DSO
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGrievanceModal(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryPortal;
