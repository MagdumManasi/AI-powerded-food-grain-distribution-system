import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import {
  History,
  ShieldCheck,
  Filter,
  Search,
  Lock,
  FileCheck2,
  Clock,
  Sparkles
} from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    try {
      const res = await dataService.getAuditLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    const unsubscribe = dataService.subscribe(loadLogs);
    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && !log.action.includes(actionFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchOp = log.operator?.toLowerCase().includes(q) || log.username?.toLowerCase().includes(q);
      const matchAction = log.action?.toLowerCase().includes(q);
      const matchEntity = log.entityType?.toLowerCase().includes(q) || log.entityId?.toLowerCase().includes(q);
      const matchDetails = log.details?.toLowerCase().includes(q);
      if (!matchOp && !matchAction && !matchEntity && !matchDetails) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Audit Trail & Compliance Ledger</h1>
            <span className="badge badge-success text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>SHA-256 Immutable</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Immutable cryptographic ledger of waybills, weighment reconciliations, distributions, citizen grievances, and AI audit executions
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-1 items-center gap-2 w-full">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by operator, action, waybill, or transaction ID..."
            className="form-input text-xs flex-1"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={15} className="text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="form-input text-xs w-48"
          >
            <option value="ALL">All Event Types</option>
            <option value="DISPATCH">Waybills / Dispatches</option>
            <option value="RECEIPT">Delivery Receipts</option>
            <option value="DISTRIBUTION">e-PoS Distributions</option>
            <option value="ALERT">Anomaly Alert Reviews</option>
            <option value="AI_AUDIT">AI Audit Runs</option>
            <option value="GRIEVANCE">Citizen Grievances</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Log Ref</th>
              <th>Action Event</th>
              <th>Target Entity</th>
              <th>Officer / Operator</th>
              <th>Log Details & Notes</th>
              <th>Cryptographic Hash</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400 text-xs">
                  Loading audit trail...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400 text-xs">
                  No audit log entries found matching criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-xs font-bold text-slate-400">
                    #LOG-{String(log.id).padStart(4, '0')}
                  </td>
                  <td>
                    <span
                      className={`badge text-[10px] ${
                        log.action.includes('AI_AUDIT')
                          ? 'badge-warning'
                          : log.action.includes('DISPATCH')
                          ? 'badge-info'
                          : log.action.includes('RECEIPT')
                          ? 'badge-success'
                          : log.action.includes('DISTRIBUTION')
                          ? 'badge-success'
                          : log.action.includes('ALERT')
                          ? 'badge-danger'
                          : 'badge-info'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="font-bold text-slate-800 text-xs">
                    <div>{log.entityType}</div>
                    <div className="font-mono text-[11px] text-emerald-800">{log.entityId}</div>
                  </td>
                  <td>
                    <div className="text-xs text-slate-900 font-semibold">{log.operator || log.username || 'System Engine'}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.role || 'DAEMON'}</div>
                  </td>
                  <td className="text-xs text-slate-700 max-w-sm">
                    {log.details || log.newValue || log.oldValue || 'Audit logged'}
                  </td>
                  <td className="font-mono text-[10px] text-slate-400 whitespace-nowrap">
                    {log.hash ? `${log.hash.substring(0, 12)}...` : 'sha256-verified'}
                  </td>
                  <td className="text-xs text-slate-500 whitespace-nowrap">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
