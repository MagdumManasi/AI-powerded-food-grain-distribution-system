import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { AlertTriangle, Filter, Eye, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = alerts.filter((a) => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Anomaly Alerts & Risk Signals</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automated detection of stock shortages, distribution volume spikes, and unusual patterns
          </p>
        </div>
      </div>

      {/* Filter and Overview */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input text-xs w-48"
          >
            <option value="ALL">All Alert Statuses</option>
            <option value="OPEN">OPEN (Requires Review)</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filtered.length}</strong> anomaly findings
        </div>
      </div>

      {/* Table */}
      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Alert Code</th>
              <th>Anomaly Category</th>
              <th>Severity</th>
              <th>Target Entity</th>
              <th>Summary & Evidence</th>
              <th>Detected At</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">Loading anomaly alerts...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">No alerts found matching filter.</td>
              </tr>
            ) : (
              filtered.map((a) => {
                const isHigh = a.severity === 'HIGH' || a.severity === 'CRITICAL';
                return (
                  <tr key={a.id} className={isHigh && a.status === 'OPEN' ? 'bg-amber-50/40' : ''}>
                    <td className="font-mono text-xs font-bold text-slate-900">{a.alertCode}</td>
                    <td>
                      <span className="badge badge-info text-[10px]">{a.type}</span>
                    </td>
                    <td>
                      <span className={`badge ${isHigh ? 'badge-danger' : 'badge-warning'}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="font-extrabold text-emerald-800">
                      {a.entityName || `${a.entityType} #${a.entityId}`}
                    </td>
                    <td>
                      <div className="font-bold text-slate-900 text-xs">{a.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{a.evidence}</div>
                    </td>
                    <td className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        a.status === 'RESOLVED'
                          ? 'badge-success'
                          : a.status === 'UNDER_REVIEW'
                          ? 'badge-warning'
                          : a.status === 'OPEN'
                          ? 'badge-danger'
                          : 'badge-info'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to={`/alerts/${a.id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} />
                        <span>Investigate</span>
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

export default Alerts;
