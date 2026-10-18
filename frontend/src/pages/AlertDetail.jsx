import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  UserCheck,
  FileText,
  CheckCircle2
} from 'lucide-react';

const AlertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAlert();
  }, [id]);

  const fetchAlert = async () => {
    try {
      const res = await api.get(`/alerts/${id}`);
      setAlert(res.data.data);
      if (res.data.data.resolutionNotes) {
        setResolutionNotes(res.data.data.resolutionNotes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (newStatus) => {
    if (!resolutionNotes.trim()) {
      alert('Please enter officer decision notes before updating status.');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/alerts/${id}/review`, {
        status: newStatus,
        resolutionNotes,
      });
      fetchAlert();
      alert(`Alert status marked as ${newStatus}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating alert status');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-semibold text-slate-500 animate-pulse">Loading alert dossier...</div>
      </div>
    );
  }

  if (!alert) {
    return <div className="p-4 text-center text-sm text-red-600">Alert record not found.</div>;
  }

  const isHigh = alert.severity === 'HIGH' || alert.severity === 'CRITICAL';

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to="/alerts" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Back to Alerts</span>
        </Link>
        <span className="text-xs text-slate-400">/</span>
        <span className="text-xs font-bold text-slate-600">{alert.alertCode}</span>
      </div>

      {/* Main Alert Card */}
      <div className="card bg-white p-6 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge ${isHigh ? 'badge-danger' : 'badge-warning'}`}>
                {alert.severity} SEVERITY
              </span>
              <span className="badge badge-info">{alert.type}</span>
              <span className="font-mono text-xs font-bold text-slate-400">{alert.alertCode}</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">{alert.title}</h1>
          </div>

          <div>
            <span className={`badge text-xs px-3 py-1 ${
              alert.status === 'RESOLVED'
                ? 'badge-success'
                : alert.status === 'UNDER_REVIEW'
                ? 'badge-warning'
                : alert.status === 'OPEN'
                ? 'badge-danger'
                : 'badge-info'
            }`}>
              STATUS: {alert.status}
            </span>
          </div>
        </div>

        {/* Target Entity and Timestamp */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Target Entity</p>
            <p className="font-extrabold text-emerald-800 text-sm">{alert.entityName || `${alert.entityType} #${alert.entityId}`}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Detected Timestamp</p>
            <p className="font-semibold text-slate-800">{new Date(alert.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Last Reviewer</p>
            <p className="font-semibold text-slate-800">{alert.reviewedBy || 'Pending Human Review'}</p>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="py-4 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Detailed Narrative</h3>
          <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {alert.description}
          </p>
        </div>

        {/* Forensic Evidence Breakdown */}
        <div className="py-4 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Supporting Evidence</h3>
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs font-mono text-amber-950">
            {alert.evidence}
          </div>
        </div>

        {/* Human-in-the-Loop Action Panel (Section 30) */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck size={18} className="text-emerald-700" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Authorized Officer Decision (Human-in-the-Loop)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            In accordance with PDS inspection guidelines, automated AI alerts represent signals for investigation. Authorized officers must record formal findings before closing.
          </p>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Officer Inspection / Resolution Notes
            </label>
            <textarea
              rows="3"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Physical weighbridge calibration inspected. Shortage reconciled with transporter transit log."
              className="form-input text-xs"
            ></textarea>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleReview('UNDER_REVIEW')}
              disabled={submitting}
              className="btn btn-secondary text-xs"
            >
              <Clock size={14} className="text-amber-600" />
              <span>MARK UNDER REVIEW</span>
            </button>
            <button
              onClick={() => handleReview('RESOLVED')}
              disabled={submitting}
              className="btn btn-primary text-xs"
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
