import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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

  const handleQuickLogin = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
  };

  return (
    <div className="min-h-screen bg-[#f7f5eb] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full tricolour-bar"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-800 to-emerald-600 flex items-center justify-center text-white shadow-lg mb-3">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">GrainGuard AI</h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
            Food Grain Distribution Intelligence & Accountability
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Email
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
                placeholder="officer@grainguard.gov.in"
                className="form-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Secure Password
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
                placeholder="••••••••"
                className="form-input pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Credentials Quick Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            Quick Demo Login Roles
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickLogin('officer@grainguard.gov.in', 'Officer@123')}
              className="p-2 border border-emerald-200 bg-emerald-50 text-emerald-800 rounded-lg font-bold hover:bg-emerald-100 transition text-left"
            >
              👮 Officer Verma
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@grainguard.gov.in', 'Admin@123')}
              className="p-2 border border-slate-200 bg-slate-50 text-slate-800 rounded-lg font-bold hover:bg-slate-100 transition text-left"
            >
              🛡️ System Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('auditor@grainguard.gov.in', 'Auditor@123')}
              className="p-2 border border-amber-200 bg-amber-50 text-amber-800 rounded-lg font-bold hover:bg-amber-100 transition text-left"
            >
              📋 Auditor Priya
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('fps102@grainguard.gov.in', 'Owner@123')}
              className="p-2 border border-purple-200 bg-purple-50 text-purple-800 rounded-lg font-bold hover:bg-purple-100 transition text-left"
            >
              🏪 FPS102 Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
