import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, User as UserIcon, Bell, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
      <div className="tricolour-bar"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Section */}
        <Link to="/dashboard" className="flex items-center gap-3 text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-800 to-emerald-600 flex items-center justify-center text-white shadow-md">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-emerald-950 tracking-tight">GrainGuard AI</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide border border-amber-300">
                PDS INTELLIGENCE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Smart Food Grain Distribution & Accountability</p>
          </div>
        </Link>

        {/* Right Nav Options */}
        <div className="flex items-center gap-4">
          <Link
            to="/ai-assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
          >
            <Sparkles size={14} className="text-emerald-600 animate-pulse" />
            <span>AI Assistant</span>
          </Link>

          {/* User profile dropdown info */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">{user?.name || 'Authorized Officer'}</div>
              <div className="text-[11px] font-semibold text-emerald-700 tracking-wider">
                {user?.role || 'OFFICER'}
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
