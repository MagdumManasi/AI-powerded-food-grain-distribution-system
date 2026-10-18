import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { History, ShieldCheck, Filter } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/audit-logs');
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Audit Trail & Compliance Ledger</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Immutable cryptographic log of logins, stock transfers, distributions, anomaly reviews, and AI audit executions
        </p>
      </div>

      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Action Event</th>
              <th>Target Entity</th>
              <th>Officer / Operator</th>
              <th>Log Details & Notes</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400 text-xs">Loading audit trail...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400 text-xs">No audit logs recorded yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-xs font-bold text-slate-400">#{log.id}</td>
                  <td>
                    <span className={`badge ${
                      log.action === 'AI_AUDIT'
                        ? 'badge-warning'
                        : log.action === 'STOCK_TRANSFER'
                        ? 'badge-info'
                        : log.action === 'DISTRIBUTION'
                        ? 'badge-success'
                        : 'badge-info'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="font-bold text-slate-800">
                    {log.entityType} {log.entityId ? `#${log.entityId}` : ''}
                  </td>
                  <td className="text-xs text-emerald-800 font-semibold">{log.username || 'System Daemon'}</td>
                  <td className="text-xs text-slate-700">{log.newValue || log.oldValue || 'Audit logged'}</td>
                  <td className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
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
