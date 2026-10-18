import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Warehouse,
  Boxes,
  Truck,
  CheckCircle2,
  PackageCheck,
  AlertTriangle,
  FileCheck2,
  BotMessageSquare,
  BookOpen,
  History
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/beneficiaries', label: 'Beneficiaries', icon: Users },
    { to: '/ration-shops', label: 'Ration Shops (FPS)', icon: Store },
    { to: '/godowns', label: 'Godowns', icon: Warehouse },
    { to: '/inventory', label: 'Grain Inventory', icon: Boxes },
    { to: '/dispatch', label: 'Shipment Dispatch', icon: Truck },
    { to: '/receipts', label: 'Shipment Receipts', icon: CheckCircle2 },
    { to: '/distributions', label: 'Distribution Ledger', icon: PackageCheck },
    { to: '/alerts', label: 'AI Alerts & Risk', icon: AlertTriangle, highlight: true },
    { to: '/audit', label: 'AI Shop Audit', icon: FileCheck2 },
    { to: '/ai-assistant', label: 'AI Assistant & RAG', icon: BotMessageSquare },
    { to: '/documents', label: 'Policy Knowledge Base', icon: BookOpen },
    { to: '/audit-logs', label: 'Audit Trail', icon: History },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-3 flex flex-col justify-between shrink-0">
      <nav className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Distribution Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/70'
                } ${item.highlight && !location.pathname.includes(item.to) ? 'text-amber-700' : ''}`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Official Help Banner */}
      <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-200 text-xs text-emerald-900 mt-4">
        <div className="font-bold flex items-center gap-1.5 mb-1">
          <span>🇮🇳 Government PDS Portal</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          National Food Security Act Compliance Monitoring & Automated Anomaly Detection.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
