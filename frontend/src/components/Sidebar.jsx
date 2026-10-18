import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_PROFILES } from '../context/roles';
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
  ShieldCheck,
  Network,
  CreditCard,
  MessageSquareWarning,
  Scale,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role || ROLES.DISTRICT_OFFICER;
  const profile = ROLE_PROFILES[role] || ROLE_PROFILES.DISTRICT_OFFICER;

  // Build role-isolated navigation structure
  const getRoleSections = () => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return [
          {
            title: 'Apex State Governance',
            items: [
              { to: '/dashboard', label: 'State Executive Console', icon: LayoutDashboard },
              { to: '/hierarchy', label: 'Hierarchy Explorer', icon: Network, badge: 'Sangli Scope' },
              { to: '/ration-shops', label: 'Fair Price Shops (FPS)', icon: Store },
              { to: '/beneficiaries', label: 'Beneficiary Registry', icon: Users },
            ],
          },
          {
            title: 'Grain Logistics & Movement',
            items: [
              { to: '/dispatch', label: 'Dispatches to Lowest Shops', icon: Truck, badge: 'Supply Flow' },
              { to: '/receipts', label: 'Receipts & Shortages', icon: CheckCircle2 },
              { to: '/godowns', label: 'Storage Godowns', icon: Warehouse },
              { to: '/inventory', label: 'Stock Inventory Ledgers', icon: Boxes },
              { to: '/distributions', label: 'Distribution Transactions', icon: PackageCheck },
            ],
          },
          {
            title: 'Intelligence & Accountability',
            items: [
              { to: '/alerts', label: 'Anomaly Engine & Alerts', icon: AlertTriangle, highlight: true },
              { to: '/audit', label: 'AI Shop Audit Agent', icon: FileCheck2 },
              { to: '/complaints', label: 'Citizen Grievances', icon: MessageSquareWarning },
              { to: '/ai-assistant', label: 'Policy RAG Assistant', icon: BotMessageSquare },
              { to: '/documents', label: 'Policy Knowledge Base', icon: BookOpen },
              { to: '/audit-logs', label: 'Cryptographic Audit Trail', icon: History },
            ],
          },
        ];

      case ROLES.DISTRICT_OFFICER:
        return [
          {
            title: 'District Administration',
            items: [
              { to: '/dashboard', label: 'Sangli District Overview', icon: LayoutDashboard },
              { to: '/hierarchy', label: 'Bedag & Belanki Hierarchy', icon: Network, badge: 'Miraj Taluka' },
              { to: '/ration-shops', label: 'Fair Price Shops (FPS)', icon: Store },
              { to: '/beneficiaries', label: 'District Beneficiaries', icon: Users },
            ],
          },
          {
            title: 'Dispatches to Lowest Shops',
            items: [
              { to: '/dispatch', label: 'Dispatches to Shops (FPS)', icon: Truck, badge: 'Lowest Tier' },
              { to: '/receipts', label: 'Receipts & Shortage Tracking', icon: CheckCircle2 },
              { to: '/godowns', label: 'District Warehouses', icon: Warehouse },
              { to: '/inventory', label: 'Stock Ledgers', icon: Boxes },
              { to: '/distributions', label: 'Shop Distribution Log', icon: PackageCheck },
            ],
          },
          {
            title: 'Inspection & Compliance',
            items: [
              { to: '/alerts', label: 'Anomaly Alerts & Risk', icon: AlertTriangle, highlight: true },
              { to: '/audit', label: 'AI Shop Audit Agent', icon: FileCheck2 },
              { to: '/complaints', label: 'Grievance Redressal', icon: MessageSquareWarning },
              { to: '/ai-assistant', label: 'AI Policy Assistant', icon: BotMessageSquare },
              { to: '/documents', label: 'PDS Manuals & SOPs', icon: BookOpen },
            ],
          },
        ];

      case ROLES.WAREHOUSE_MANAGER:
        return [
          {
            title: 'Godown Depot Operations',
            items: [
              { to: '/warehouse-ops', label: 'Depot Operations Console', icon: Warehouse, badge: 'WH-SAN-001' },
              { to: '/inventory', label: 'Depot Stock & Silos', icon: Boxes },
              { to: '/dispatch', label: 'Create Dispatch Waybill', icon: Truck },
              { to: '/receipts', label: 'Inbound State Allocations', icon: CheckCircle2 },
            ],
          },
          {
            title: 'Logistics Fleet',
            items: [
              { to: '/transporter-ops', label: 'Transporter Fleet Dispatch', icon: Scale },
              { to: '/godowns', label: 'Warehouse Profile', icon: Store },
              { to: '/ai-assistant', label: 'Depot AI Helpdesk', icon: BotMessageSquare },
              { to: '/documents', label: 'Buffer & Storage SOPs', icon: BookOpen },
            ],
          },
        ];

      case ROLES.TRANSPORTER:
        return [
          {
            title: 'Logistics & Fleet Transit',
            items: [
              { to: '/transporter-ops', label: 'Vehicle Dashboard', icon: Truck, badge: 'MH-10-AZ-5542' },
              { to: '/dispatch', label: 'Assigned Waybills / Trips', icon: Boxes },
              { to: '/receipts', label: 'Weighbridge Slips / Receipts', icon: CheckCircle2 },
              { to: '/godowns', label: 'Pickup Warehouse Details', icon: Warehouse },
            ],
          },
          {
            title: 'Transit Guidelines',
            items: [
              { to: '/documents', label: 'Transit Rules & SOP', icon: BookOpen },
              { to: '/ai-assistant', label: 'Transit Assistant', icon: BotMessageSquare },
            ],
          },
        ];

      case ROLES.FPS_OWNER:
        return [
          {
            title: 'Shop Point-of-Sale (FPS-BED-001)',
            items: [
              { to: '/dashboard', label: 'Shop Dashboard', icon: LayoutDashboard },
              { to: '/distributions', label: 'Issue Grain to Beneficiary', icon: PackageCheck, badge: 'Point of Sale' },
              { to: '/receipts', label: 'Confirm Inbound Delivery', icon: CheckCircle2 },
              { to: '/inventory', label: 'Shop Stock Ledger', icon: Boxes },
              { to: '/beneficiaries', label: 'Registered Cardholders', icon: Users },
              { to: '/ration-shops/1', label: 'My Shop Profile (Bedag)', icon: Store },
            ],
          },
          {
            title: 'Compliance & Assistance',
            items: [
              { to: '/alerts', label: 'Shop Anomaly Status', icon: AlertTriangle },
              { to: '/complaints', label: 'Beneficiary Grievances', icon: MessageSquareWarning },
              { to: '/documents', label: 'Entitlement Quotas & SOP', icon: BookOpen },
              { to: '/ai-assistant', label: 'PDS AI Helpdesk', icon: BotMessageSquare },
            ],
          },
        ];

      case ROLES.BENEFICIARY:
        return [
          {
            title: 'Citizen Beneficiary Portal',
            items: [
              { to: '/citizen-portal', label: 'My Digital Ration Passbook', icon: CreditCard, badge: 'RC-SAN-AAY' },
              { to: '/distributions', label: 'Grain Collection History', icon: PackageCheck },
              { to: '/ration-shops/1', label: 'Assigned Fair Price Shop', icon: Store },
              { to: '/complaints', label: 'File Grievance / Complaint', icon: MessageSquareWarning },
            ],
          },
          {
            title: 'Rights & Entitlements',
            items: [
              { to: '/ai-assistant', label: 'Ask PDS Citizen AI', icon: BotMessageSquare },
              { to: '/documents', label: 'NFSA Quotas & Rights', icon: BookOpen },
            ],
          },
        ];

      case ROLES.AUDITOR:
        return [
          {
            title: 'Statutory Vigilance Audit',
            items: [
              { to: '/dashboard', label: 'Vigilance Overview', icon: LayoutDashboard },
              { to: '/alerts', label: 'Flagged Anomalies & Risk', icon: AlertTriangle, highlight: true },
              { to: '/audit', label: 'AI Shop Audit Agent', icon: FileCheck2 },
              { to: '/audit-logs', label: 'Cryptographic Audit Trail', icon: History },
              { to: '/hierarchy', label: 'Hierarchy Risk Matrix', icon: Network },
            ],
          },
          {
            title: 'Forensic Reconciliation',
            items: [
              { to: '/receipts', label: 'Shortage Discrepancies', icon: CheckCircle2 },
              { to: '/ration-shops', label: 'Shop Risk Registry', icon: Store },
              { to: '/distributions', label: 'Distribution Ledger', icon: PackageCheck },
              { to: '/complaints', label: 'Grievance Review', icon: MessageSquareWarning },
              { to: '/ai-assistant', label: 'Forensic Policy Assistant', icon: BotMessageSquare },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const sections = getRoleSections();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-3 flex flex-col justify-between shrink-0 shadow-sm">
      <nav className="space-y-4">
        {/* Role Clearance Banner */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
              {profile.clearanceLevel}
            </span>
            <span className="text-sm">{profile.icon}</span>
          </div>
          <div className="text-xs font-black text-slate-900 leading-tight">{profile.title}</div>
          <div className="text-[11px] text-slate-600 font-semibold truncate mt-0.5">{profile.name}</div>
        </div>

        {/* Dynamic Role Sections */}
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/70'
                    } ${item.highlight && !isActive ? 'text-amber-800 bg-amber-50/50' : ''}`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                    }`}>
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
          <span>🇮🇳 Sangli PDS Governance</span>
        </div>
        <p className="text-[10px] text-emerald-800 leading-relaxed font-medium">
          Maharashtra ➔ Sangli ➔ Miraj ➔ Bedag & Belanki ➔ Citizen. Strict jurisdiction boundaries.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
