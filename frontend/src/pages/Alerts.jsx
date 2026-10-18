import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import {
  AlertTriangle,
  Filter,
  Eye,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const loadAlerts = async () => {
    try {
      const res = await dataService.getAlerts();
      setAlerts(res.data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    const unsubscribe = dataService.subscribe(loadAlerts);
    return () => unsubscribe();
  }, []);

  const filtered = alerts.filter((a) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  const openCount = alerts.filter((a) => a.status === 'OPEN').length;
  const underReviewCount = alerts.filter((a) => a.status === 'UNDER_REVIEW').length;
  const highRiskCount = alerts.filter((a) => a.severity === 'HIGH' || a.severity === 'CRITICAL').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Anomaly Alerts & Risk Signals</h1>
            <span className="badge badge-info text-[10px] uppercase font-bold tracking-wider">Sangli Vigilance</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automated detection of stock shortages, distribution volume spikes, and unusual biometric patterns
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Open Incidents</span>
          <p className="text-2xl font-black text-red-600 mt-2">{openCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Require civil officer attention</p>
        </div>

        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Under Investigation</span>
          <p className="text-2xl font-black text-amber-600 mt-2">{underReviewCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Assigned to Taluka / District teams</p>
        </div>

        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">High / Critical Severity</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{highRiskCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Potential grain diversion signals</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4 bg-white border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter size={15} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input text-xs w-40"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">OPEN (Requires Review)</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-700">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="form-input text-xs w-36"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filtered.length}</strong> of <strong>{alerts.length}</strong> anomaly findings
        </div>
      </div>

      {/* Alerts Table */}
      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Alert Code</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Target Entity / Village</th>
              <th>Summary & Evidence</th>
              <th>Risk Score</th>
              <th>Detected At</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-400 text-xs">
                  Loading anomaly alerts...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-400 text-xs">
                  No alerts found matching filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((a) => {
                const isHigh = a.severity === 'HIGH' || a.severity === 'CRITICAL';
                return (
                  <tr key={a.id} className={isHigh && a.status === 'OPEN' ? 'bg-amber-50/40' : ''}>
                    <td className="font-mono text-xs font-bold text-slate-900">{a.alertCode}</td>
                    <td>
                      <span className="badge badge-info text-[10px]">
                        {(a.alertType || a.type || 'ANOMALY').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          a.severity === 'CRITICAL' || a.severity === 'HIGH'
                            ? 'badge-danger'
                            : a.severity === 'MEDIUM'
                            ? 'badge-warning'
                            : 'badge-info'
                        }`}
                      >
                        {a.severity}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-slate-900 text-xs">
                        {a.relatedShopName || a.relatedShopCode || a.relatedWarehouseCode || 'General Alert'}
                      </div>
                      <div className="text-[11px] text-slate-500">{a.village ? `${a.village}, Sangli` : 'Sangli District'}</div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-900 text-xs">{a.title}</div>
                      <div className="text-[11px] text-slate-600 line-clamp-1 max-w-md">
                        {a.description}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono font-bold text-xs text-slate-800">
                        {a.riskImpactScore ? `${a.riskImpactScore}/100` : '—'}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500 whitespace-nowrap">
                      {a.detectionDate || a.createdAt
                        ? new Date(a.detectionDate || a.createdAt).toLocaleDateString()
                        : 'Recent'}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          a.status === 'RESOLVED'
                            ? 'badge-success'
                            : a.status === 'UNDER_REVIEW'
                            ? 'badge-warning'
                            : a.status === 'OPEN'
                            ? 'badge-danger'
                            : 'badge-info'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to={`/alerts/${a.id}`} className="btn btn-secondary btn-sm flex items-center gap-1">
                        <Eye size={13} />
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
