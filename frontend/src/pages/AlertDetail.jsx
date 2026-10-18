import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  UserCheck,
  FileText,
  CheckCircle2,
  Building2,
  Scale
} from 'lucide-react';

const AlertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchAlert = async () => {
    try {
      const res = await dataService.getAlertById(id);
      setAlert(res.data);
      if (res.data?.investigationNotes) {
        setResolutionNotes(res.data.investigationNotes);
      }
    } catch (err) {
      console.error('Error fetching alert details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlert();
  }, [id]);

  const handleReview = async (newStatus) => {
    if (!resolutionNotes.trim()) {
      alert('Please enter officer decision notes before updating status.');
      return;
    }
    setSubmitting(true);
    try {
      await dataService.updateAlert(id, {
        status: newStatus,
        notes: resolutionNotes,
        escalationStatus: newStatus === 'RESOLVED' ? 'CLOSED_RESOLVED' : 'OFFICER_REVIEWED',
      });
      await fetchAlert();
      setFeedback({
        type: 'success',
        message: `Alert record successfully updated to "${newStatus}". Decision permanently logged in compliance trail.`,
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      alert(err.message || 'Error updating alert status');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-semibold text-slate-500 animate-pulse flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading alert dossier...</span>
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto bg-white border-slate-200">
        <AlertTriangle size={32} className="mx-auto text-amber-500 mb-2" />
        <h3 className="font-bold text-slate-900">Alert Record Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">No alert matching identifier #{id} was found.</p>
        <Link to="/alerts" className="btn btn-secondary btn-sm">
          Return to Alerts
        </Link>
      </div>
    );
  }

  const isHigh = alert.severity === 'HIGH' || alert.severity === 'CRITICAL';

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/alerts" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} />
            <span>Back to Alerts</span>
          </Link>
          <span className="text-xs text-slate-400">/</span>
          <span className="text-xs font-bold text-slate-600 font-mono">{alert.alertCode}</span>
        </div>

        <span className="badge badge-info text-[10px] uppercase font-bold tracking-wider">
          Sangli Civil Vigilance
        </span>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-start gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold">{feedback.message}</div>
        </div>
      )}

      {/* Main Alert Card */}
      <div className="card bg-white p-6 border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`badge ${isHigh ? 'badge-danger' : 'badge-warning'} font-bold`}>
                {alert.severity} SEVERITY
              </span>
              <span className="badge badge-info text-[10px]">
                {(alert.alertType || alert.type || 'ANOMALY').replace(/_/g, ' ')}
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">{alert.alertCode}</span>
            </div>
            <h1 className="text-xl font-black text-slate-900">{alert.title}</h1>
          </div>

          <div>
            <span
              className={`badge text-xs px-3 py-1 font-bold ${
                alert.status === 'RESOLVED'
                  ? 'badge-success'
                  : alert.status === 'UNDER_REVIEW'
                  ? 'badge-warning'
                  : alert.status === 'OPEN'
                  ? 'badge-danger'
                  : 'badge-info'
              }`}
            >
              STATUS: {alert.status}
            </span>
          </div>
        </div>

        {/* Target Entity and Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-4 border-b border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Target Entity</p>
            <p className="font-extrabold text-emerald-900 text-sm">
              {alert.relatedShopName || alert.relatedShopCode || alert.relatedWarehouseCode || 'Consignment'}
            </p>
            <p className="text-[11px] text-slate-500">
              {alert.village ? `${alert.village}, Miraj Taluka` : 'Sangli District'}
            </p>
          </div>

          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Detection Engine</p>
            <p className="font-semibold text-slate-800">{alert.detectedBy || 'AI Reconciliation Engine'}</p>
            <p className="text-[11px] text-slate-500">
              {alert.detectionDate ? new Date(alert.detectionDate).toLocaleString() : 'Recent'}
            </p>
          </div>

          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Assigned Officer</p>
            <p className="font-semibold text-slate-800">{alert.assignedReviewer || 'Anand Kulkarni (DSO)'}</p>
            <p className="text-[11px] text-emerald-700 font-medium">District Supply Office</p>
          </div>

          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Risk Impact Score</p>
            <p className="font-black text-slate-900 text-sm">
              {alert.riskImpactScore ? `${alert.riskImpactScore} / 100` : '75 / 100'}
            </p>
            <p className="text-[11px] text-slate-500">
              {alert.escalationStatus || 'UNDER_DISTRICT_REVIEW'}
            </p>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="py-4 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Forensic Anomaly Narrative
          </h3>
          <div className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {alert.description}
          </div>
        </div>

        {/* Statutory Citation Grounding */}
        <div className="py-4 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Statutory SOP Grounding
          </h3>
          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-amber-700" />
              <span>National Food Security Act (NFSA) Section 1.2 — In-Transit Tare & Weighbridge Tolerance</span>
            </div>
            <p className="text-[11px] text-amber-900">
              Statutory standard permits max 1.0% (or 50 KG) transit moisture variance. Variances exceeding this norm require mandatory weighbridge inspection and electronic seal audit before subsequent quota sanctions.
            </p>
          </div>
        </div>

        {/* Human-in-the-Loop Action Panel */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck size={18} className="text-emerald-700" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Authorized Civil Officer Decision (Human-in-the-Loop)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            In compliance with statutory PDS vigilance mandates, automated AI alerts serve as diagnostic evidence. Authorized civil supplies officers must record formal findings before resolving or dismissing an incident.
          </p>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Officer Inspection Findings & Resolution Notes
            </label>
            <textarea
              rows="3"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Weighbridge calibration verified at Bedag shop. Transporter trip sheet inspected. Shortage accounted for under Section 30 report."
              className="form-input text-xs"
            ></textarea>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleReview('UNDER_REVIEW')}
              disabled={submitting}
              className="btn btn-secondary text-xs flex items-center gap-1.5"
            >
              <Clock size={14} className="text-amber-600" />
              <span>MARK UNDER REVIEW</span>
            </button>
            <button
              onClick={() => handleReview('RESOLVED')}
              disabled={submitting}
              className="btn btn-primary text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>APPROVE & RESOLVE</span>
            </button>
            <button
              onClick={() => handleReview('FALSE_POSITIVE')}
              disabled={submitting}
              className="btn btn-secondary text-xs text-slate-600"
            >
              <span>MARK FALSE POSITIVE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetail;
