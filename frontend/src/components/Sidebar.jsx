import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  History,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'OFFICER';

  // Role-based navigation structure
  const getRoleSections = () => {
    switch (role) {
      case 'OFFICER':
        return [
          {
            title: 'District Administration',
            items: [
              { to: '/dashboard', label: 'District Overview', icon: LayoutDashboard },
              { to: '/ration-shops', label: 'Fair Price Shops (FPS)', icon: Store },
              { to: '/beneficiaries', label: 'District Beneficiaries', icon: Users },
            ],
          },
          {
            title: 'Grain Movement & Tracking',
            items: [
              { to: '/dispatch', label: 'Dispatches to Shops', icon: Truck, badge: 'Supply Flow' },
              { to: '/receipts', label: 'Receipts & Shortages', icon: CheckCircle2 },
              { to: '/godowns', label: 'District Godowns', icon: Warehouse },
              { to: '/inventory', label: 'Stock Ledgers', icon: Boxes },
              { to: '/distributions', label: 'Shop Distributions', icon: PackageCheck },
            ],
          },
          {
            title: 'AI Inspection & Oversight',
            items: [
              { to: '/alerts', label: 'Anomaly Alerts & Risk', icon: AlertTriangle, highlight: true },
              { to: '/audit', label: 'AI Shop Audit Agent', icon: FileCheck2 },
              { to: '/ai-assistant', label: 'AI Policy Assistant', icon: BotMessageSquare },
              { to: '/documents', label: 'PDS Policy Manuals', icon: BookOpen },
            ],
          },
        ];

      case 'FPS_OWNER':
        return [
          {
            title: 'Shop Point-of-Sale (FPS)',
            items: [
              { to: '/dashboard', label: 'Shop Dashboard', icon: LayoutDashboard },
              { to: '/ration-shops/2', label: 'My Shop Profile (FPS102)', icon: Store },
              { to: '/distributions', label: 'Issue Grain to Beneficiary', icon: PackageCheck, badge: 'Point of Sale' },
              { to: '/inventory', label: 'Current Shop Stock', icon: Boxes },
              { to: '/receipts', label: 'Confirm Inbound Delivery', icon: CheckCircle2 },
              { to: '/beneficiaries', label: 'Assigned Beneficiaries', icon: Users },
            ],
          },
          {
            title: 'Compliance & Assistance',
            items: [
              { to: '/alerts', label: 'Shop Anomaly Alerts', icon: AlertTriangle },
              { to: '/documents', label: 'Entitlement Quotas & SOP', icon: BookOpen },
              { to: '/ai-assistant', label: 'PDS AI Helpdesk', icon: BotMessageSquare },
            ],
          },
        ];

      case 'TRANSPORTER':
        return [
          {
            title: 'Fleet & Grain Transit',
            items: [
              { to: '/dashboard', label: 'Fleet Operations', icon: LayoutDashboard },
              { to: '/dispatch', label: 'Assigned Waybills / Transit', icon: Truck },
              { to: '/receipts', label: 'Delivery Confirmations', icon: CheckCircle2 },
              { to: '/godowns', label: 'Pickup Godowns', icon: Warehouse },
            ],
          },
          {
            title: 'Guidance',
            items: [
              { to: '/ai-assistant', label: 'Transit Assistant', icon: BotMessageSquare },
              { to: '/documents', label: 'Transport Guidelines', icon: BookOpen },
            ],
          },
        ];

      case 'AUDITOR':
        return [
          {
            title: 'Statutory Audit & Evidence',
            items: [
              { to: '/dashboard', label: 'Audit Dashboard', icon: LayoutDashboard },
              { to: '/alerts', label: 'Flagged Anomalies', icon: AlertTriangle, highlight: true },
              { to: '/audit', label: 'AI Shop Audit Agent', icon: FileCheck2 },
              { to: '/audit-logs', label: 'Cryptographic Audit Trail', icon: History },
            ],
          },
          {
            title: 'Inspection Verification',
            items: [
              { to: '/ration-shops', label: 'FPS Risk Registry', icon: Store },
              { to: '/receipts', label: 'Shortage Discrepancies', icon: CheckCircle2 },
              { to: '/distributions', label: 'Distribution Ledger', icon: PackageCheck },
              { to: '/documents', label: 'Statutory Regulations', icon: BookOpen },
              { to: '/ai-assistant', label: 'AI Forensic Assistant', icon: BotMessageSquare },
            ],
          },
        ];

      case 'ADMIN':
      default:
        return [
          {
            title: 'System Governance',
            items: [
              { to: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
              { to: '/beneficiaries', label: 'Beneficiary Management', icon: Users },
              { to: '/ration-shops', label: 'Fair Price Shops (FPS)', icon: Store },
              { to: '/godowns', label: 'Storage Godowns', icon: Warehouse },
              { to: '/inventory', label: 'Stock Inventory', icon: Boxes },
            ],
          },
          {
            title: 'Supply Chain Operations',
            items: [
              { to: '/dispatch', label: 'Shipment Dispatches', icon: Truck },
              { to: '/receipts', label: 'Shipment Receipts', icon: CheckCircle2 },
              { to: '/distributions', label: 'Distribution Ledger', icon: PackageCheck },
            ],
          },
          {
            title: 'AI Intelligence & Audits',
            items: [
              { to: '/alerts', label: 'Anomaly Alerts & Risk', icon: AlertTriangle, highlight: true },
              { to: '/audit', label: 'AI Shop Audit Agent', icon: FileCheck2 },
              { to: '/ai-assistant', label: 'AI Policy Assistant & RAG', icon: BotMessageSquare },
              { to: '/documents', label: 'Policy Knowledge Base', icon: BookOpen },
              { to: '/audit-logs', label: 'Compliance Audit Trail', icon: History },
            ],
          },
        ];
    }
  };

  const sections = getRoleSections();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-3 flex flex-col justify-between shrink-0 shadow-sm">
      <nav className="space-y-4">
        {/* User Role Banner */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Clearance</div>
            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>{role} CONSOLE</span>
            </div>
          </div>
          <span className="badge badge-success text-[9px]">{role}</span>
        </div>

        {/* Dynamic Role Sections */}
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/70'
                    } ${item.highlight && !location.pathname.includes(item.to) ? 'text-amber-800 bg-amber-50/50' : ''}`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Official Footnote */}
      <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-200 text-xs text-emerald-900 mt-4">
        <div className="font-bold flex items-center gap-1.5 mb-1">
          <span>🇮🇳 NFSA Compliance</span>
        </div>
        <p className="text-[10px] text-emerald-800 leading-relaxed font-medium">
          Role-governed data isolation: Actions logged under statutory compliance rules.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
