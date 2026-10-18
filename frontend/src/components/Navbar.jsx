import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_PROFILES } from '../context/roles';
import { ShieldCheck, LogOut, Sparkles, ChevronDown, Check, RotateCcw, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

const Navbar = () => {
  const { user, logout, switchRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [resetting, setResetting] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (roleKey) => {
    switchRole(roleKey);
    setShowRoleMenu(false);
    navigate('/dashboard');
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo records back to the initial sample dataset (Sangli, Bedag & Belanki)?')) {
      setResetting(true);
      await dataService.resetDemoData();
      setResetting(false);
      window.location.reload();
    }
  };

  const currentRole = user?.role || ROLES.DISTRICT_OFFICER;
  const currentProfile = ROLE_PROFILES[currentRole] || ROLE_PROFILES.DISTRICT_OFFICER;

  // Compute jurisdiction label
  const getJurisdictionLabel = () => {
    const j = currentProfile.jurisdiction;
    if (j.level === 'STATE') return `🏛️ Maharashtra Apex (All 36 Dist.)`;
    if (j.level === 'DISTRICT') return `📍 Sangli Dist. (Miraj - Bedag/Belanki)`;
    if (j.level === 'WAREHOUSE') return `🏭 WH-SAN-001 (Sangli Central Godown)`;
    if (j.level === 'TRANSIT') return `🚚 Carrier: MH-10-AZ-5542`;
    if (j.level === 'FPS') return `🏪 FPS-BED-001 (Bedag Village)`;
    if (j.level === 'CITIZEN') return `🌾 Citizen: ${j.rationCardNumber} (Bedag)`;
    if (j.level === 'AUDIT') return `⚖️ Vigilance Cell (Sangli Corridor)`;
    return 'Official Jurisdiction';
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
      {/* Official Government Tricolour Bar */}
      <div className="tricolour-bar"></div>

      {/* Top Demo Banner */}
      <div className="bg-amber-500/10 border-b border-amber-300/60 px-4 py-1 flex items-center justify-between text-[11px] font-bold text-amber-900">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] font-black tracking-wider uppercase">
            DEMO MODE
          </span>
          <span>SAMPLE DATA FIRST — SANGLI DISTRICT (MIRAJ TALUKA • BEDAG & BELANKI VILLAGES)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetData}
            disabled={resetting}
            title="Reset simulated changes back to default"
            className="flex items-center gap-1 text-[10px] text-amber-950 font-extrabold hover:text-emerald-900 underline cursor-pointer"
          >
            <RotateCcw size={11} className={resetting ? 'animate-spin' : ''} />
            <span>Reset Demo State</span>
          </button>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-[10px] font-mono text-slate-500">Standalone Frontend Mode</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between py-2">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2.5 text-decoration-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-800 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-emerald-950 tracking-tight">GrainGuard AI</span>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide border border-emerald-300">
                  SANGLI PDS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Food Grain Distribution & Anti-Leakage Platform</p>
            </div>
          </Link>

          {/* Active Jurisdiction Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <span>{getJurisdictionLabel()}</span>
          </div>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-2.5">
          {/* Link to Hierarchy Explorer */}
          <Link
            to="/hierarchy"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
          >
            <span>🌾 Hierarchy</span>
          </Link>

          {/* AI Assistant Link */}
          <Link
            to="/ai-assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span className="hidden sm:inline">AI Help</span>
          </Link>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-left transition"
              title="Click to preview another role"
            >
              <span className="text-base">{currentProfile.icon}</span>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-[11px] font-black text-slate-900">{currentProfile.name}</div>
                <div className="text-[10px] font-bold text-emerald-800">{currentProfile.title}</div>
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </button>

            {/* Role Dropdown Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                <div className="px-2 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Switch Role Preview (7 Roles)</span>
                  <span className="text-[9px] font-mono text-emerald-700">SANGLI DEMO</span>
                </div>
                <div className="space-y-1 mt-1 max-h-88 overflow-y-auto">
                  {Object.keys(ROLE_PROFILES).map((roleKey) => {
                    const p = ROLE_PROFILES[roleKey];
                    const isCurrent = currentRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        onClick={() => handleRoleChange(roleKey)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                          isCurrent
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{p.icon}</span>
                          <div>
                            <div className="font-bold leading-tight">{p.title}</div>
                            <div className={`text-[10px] ${isCurrent ? 'text-emerald-200' : 'text-slate-500'}`}>
                              {p.name} • {p.email}
                            </div>
                          </div>
                        </div>
                        {isCurrent && <Check size={14} className="text-emerald-200 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
