import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_PROFILES } from '../context/roles';
import { ShieldCheck, LogOut, Sparkles, ChevronDown, Check, Building2, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, switchRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (roleKey) => {
    switchRole(roleKey);
    setShowRoleMenu(false);
    navigate('/dashboard');
  };

  const currentRole = user?.role || ROLES.DISTRICT_OFFICER;
  const currentProfile = ROLE_PROFILES[currentRole] || ROLE_PROFILES.DISTRICT_OFFICER;

  // Compute jurisdiction label
  const getJurisdictionLabel = () => {
    const j = currentProfile.jurisdiction;
    if (j.level === 'STATE') return `🏛️ State: ${j.state}`;
    if (j.level === 'DISTRICT') return `📍 Dist: ${j.district} (${j.talukasCount} Talukas)`;
    if (j.level === 'TALUKA_GODOWN') return `🏭 Godown: ${j.godownCode} (${j.taluka})`;
    if (j.level === 'TRANSIT') return `🚚 Transit: ${j.vehicleNumber}`;
    if (j.level === 'FPS') return `🏪 Shop: ${j.shopCode} (${j.village})`;
    if (j.level === 'CITIZEN') return `🌾 Citizen: ${j.rationCardNumber}`;
    if (j.level === 'STATE_AUDIT') return `⚖️ Vigilance: Maharashtra`;
    return 'Official Jurisdiction';
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
      <div className="tricolour-bar"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Section */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2.5 text-decoration-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-800 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-emerald-950 tracking-tight">GrainGuard AI</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide border border-amber-300">
                  NFSA 2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Food Grain Distribution & Anti-Leakage Platform</p>
            </div>
          </Link>

          {/* Active Jurisdiction Tag */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <span>{getJurisdictionLabel()}</span>
          </div>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3">
          {/* Link to Hierarchy Explorer */}
          <Link
            to="/hierarchy"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
          >
            <span>🌾 Hierarchy Map</span>
          </Link>

          {/* AI Assistant Link */}
          <Link
            to="/ai-assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span className="hidden sm:inline">AI Help</span>
          </Link>

          {/* Interactive Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-left transition"
              title="Click to switch role preview"
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
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                <div className="px-2 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Operational Role (7 Roles)
                </div>
                <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
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
                          <span className="text-sm">{p.icon}</span>
                          <div>
                            <div className="font-bold leading-tight">{p.title}</div>
                            <div className={`text-[10px] ${isCurrent ? 'text-emerald-200' : 'text-slate-500'}`}>
                              {p.name}
                            </div>
                          </div>
                        </div>
                        {isCurrent && <Check size={14} className="text-emerald-200" />}
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
