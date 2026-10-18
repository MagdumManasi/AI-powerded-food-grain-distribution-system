import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROLES, ROLE_PROFILES } from '../context/roles';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building2,
  MapPin,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('officer@grainguard.gov.in');
  const [password, setPassword] = useState('Officer@123');
  const [selectedRole, setSelectedRole] = useState(ROLES.DISTRICT_OFFICER);
  const [error, setError] = useState('');
  const { login, loading, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const profile = ROLE_PROFILES[roleKey];
    setEmail(profile.email);
    // Set matching password for demo
    if (roleKey === ROLES.SUPER_ADMIN) setPassword('Admin@123');
    else if (roleKey === ROLES.DISTRICT_OFFICER) setPassword('Officer@123');
    else if (roleKey === ROLES.FPS_OWNER) setPassword('Owner@123');
    else if (roleKey === ROLES.TRANSPORTER) setPassword('Transporter@123');
    else if (roleKey === ROLES.AUDITOR) setPassword('Auditor@123');
    else setPassword('Pass@123');
  };

  const handleQuickInstantLogin = (roleKey) => {
    switchRole(roleKey);
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex flex-col justify-between relative overflow-hidden">
      {/* Official Government Tricolour Header Band */}
      <div className="w-full tricolour-bar"></div>

      <div className="max-w-6xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-3 uppercase tracking-wider">
            <span>Government of Maharashtra • Department of Food & Civil Supplies</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-800 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={28} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                GrainGuard AI
                <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded tracking-normal">
                  v2.0 HIERARCHICAL
                </span>
              </h1>
              <p className="text-xs text-slate-600 font-semibold">
                National Food Security Act (NFSA) Distribution Intelligence & Leakage Prevention
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Role Selector & Credentials Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 7 Role Cards (Hierarchy Overview) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Select Role Clearance (7 Roles)</h2>
                <p className="text-xs text-slate-500">
                  Choose an administrative tier to preview isolated dashboards and operations
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                STATE → BENEFICIARY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.keys(ROLE_PROFILES).map((roleKey) => {
                const p = ROLE_PROFILES[roleKey];
                const isSelected = selectedRole === roleKey;
                return (
                  <div
                    key={roleKey}
                    onClick={() => handleRoleSelect(roleKey)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl shrink-0">{p.icon}</span>
                        <div>
                          <div className="text-xs font-black text-slate-900 leading-tight">{p.title}</div>
                          <div className="text-[11px] font-bold text-emerald-800">{p.name}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                      <span className="font-semibold truncate">
                        {p.jurisdiction.level === 'STATE' && 'Statewide (Apex Level)'}
                        {p.jurisdiction.level === 'DISTRICT' && 'Pune District (14 Talukas)'}
                        {p.jurisdiction.level === 'TALUKA_GODOWN' && 'Haveli Central Godown #1'}
                        {p.jurisdiction.level === 'TRANSIT' && 'FLC Truck MH-12-PQ-9988'}
                        {p.jurisdiction.level === 'FPS' && 'FPS102 (Hadapsar Village)'}
                        {p.jurisdiction.level === 'CITIZEN' && 'Card #RC-AAY-889901'}
                        {p.jurisdiction.level === 'STATE_AUDIT' && 'Vigilance Directorate'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickInstantLogin(roleKey);
                        }}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-700 text-white hover:bg-emerald-800 shrink-0"
                      >
                        Enter ⚡
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Administrative Hierarchy Flow Pill */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs">
              <div className="font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>🌾 Administrative Hierarchy & Physical Movement:</span>
              </div>
              <p className="text-[10px] font-mono text-amber-950 font-semibold leading-relaxed">
                STATE (Allocation) ➔ DISTRICT (Quota) ➔ TALUKA/GODOWN (Bulk Buffer) ➔ TRANSPORTER (Weighbridge) ➔ VILLAGE FPS (e-PoS) ➔ BENEFICIARY (Quota)
              </p>
            </div>
          </div>

          {/* Right Column: Sign In Form Box */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-5">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Authentication</div>
              <h2 className="text-lg font-black text-slate-900">Sign In to GrainGuard Console</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authenticating as: <strong className="text-emerald-800">{ROLE_PROFILES[selectedRole]?.name}</strong>
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email / Service ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input pl-10 text-xs"
                    placeholder="officer@grainguard.gov.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pl-10 text-xs"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Validating Credentials...' : `Enter ${ROLE_PROFILES[selectedRole]?.title}`}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => handleQuickInstantLogin(selectedRole)}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline"
              >
                Instant 1-Click Access without Password ➔
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-3 bg-white text-center text-[11px] text-slate-500 font-medium">
        GrainGuard AI • National Informatics Center (NIC) Compliant • NFSA Statutory Leakage Prevention System
      </footer>
    </div>
  );
};

export default Login;
