import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_PROFILES } from '../context/roles';
import {
  ShieldCheck,
  Building2,
  Truck,
  Store,
  Users,
  Scale,
  FileCheck2,
  ArrowRight,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Sparkles,
  Menu,
  X,
  Target,
  ChevronRight,
  Activity,
  Award,
  BookOpen,
  Wheat,
  UserCheck
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoVideoModal, setShowDemoVideoModal] = useState(false);

  // Quick 1-click role login from landing page
  const handleRoleQuickLogin = (roleKey) => {
    switchRole(roleKey);
    const profile = ROLE_PROFILES[roleKey];
    if (roleKey === ROLES.BENEFICIARY) {
      navigate('/citizen-portal');
    } else if (roleKey === ROLES.WAREHOUSE_MANAGER) {
      navigate('/warehouse-ops');
    } else if (roleKey === ROLES.TRANSPORTER) {
      navigate('/transporter-ops');
    } else {
      navigate('/dashboard');
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Official Government Tricolour Bar */}
      <div className="w-full tricolour-bar"></div>

      {/* 2. Official Government Notification Strip */}
      <div className="bg-[#0e3820] text-emerald-100 text-[11px] py-1.5 px-4 font-medium border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              <strong>महाराष्ट्र शासन • Government of Maharashtra</strong> | Department of Food, Civil Supplies & Consumer Protection
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline">NFSA Digital Governance Initiative</span>
            <span className="text-emerald-300">|</span>
            <span>Toll-Free Helpline: <strong className="text-white">1967</strong> / <strong className="text-white">1800-22-4950</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Sticky Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 text-decoration-none group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-800 via-emerald-700 to-green-900 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition">
              <ShieldCheck size={28} className="text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-slate-900 tracking-tight">
                  GrainGuard <span className="text-emerald-700">AI</span>
                </span>
                <span className="hidden sm:inline-block bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 uppercase tracking-wider">
                  Maharashtra
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold tracking-tight">
                Transparent Food Distribution • Stronger Communities
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-emerald-700 cursor-pointer transition py-1 border-b-2 border-transparent hover:border-emerald-600"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-emerald-700 cursor-pointer transition py-1 border-b-2 border-transparent hover:border-emerald-600"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-emerald-700 cursor-pointer transition py-1 border-b-2 border-transparent hover:border-emerald-600"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="hover:text-emerald-700 cursor-pointer transition py-1 border-b-2 border-transparent hover:border-emerald-600"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="hover:text-emerald-700 cursor-pointer transition py-1 border-b-2 border-transparent hover:border-emerald-600"
            >
              Roles
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="hover:text-emerald-700 cursor-pointer transition py-1 border-b-2 border-transparent hover:border-emerald-600"
            >
              Our Impact
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-emerald-700 cursor-pointer transition py-1 border-b-2 border-transparent hover:border-emerald-600"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-[#14532d] hover:bg-[#0e3820] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>Dashboard ({user?.role?.split('_')[0] || 'User'})</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollToSection('login-section')}
                  className="hidden sm:flex text-slate-700 hover:text-emerald-800 text-xs font-bold px-3 py-2 transition"
                >
                  Demo Portals
                </button>
                <Link
                  to="/login"
                  className="bg-[#14532d] hover:bg-[#0e3820] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Lock size={13} className="text-emerald-300" />
                  <span>Login</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 shadow-lg animate-fade-in space-y-3 text-xs font-bold text-slate-800">
            <button onClick={() => scrollToSection('hero')} className="block w-full text-left py-2 hover:text-emerald-700">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 hover:text-emerald-700">
              About
            </button>
            <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 hover:text-emerald-700">
              Features
            </button>
            <button onClick={() => scrollToSection('workflow')} className="block w-full text-left py-2 hover:text-emerald-700">
              How It Works
            </button>
            <button onClick={() => scrollToSection('roles')} className="block w-full text-left py-2 hover:text-emerald-700">
              Roles
            </button>
            <button onClick={() => scrollToSection('impact')} className="block w-full text-left py-2 hover:text-emerald-700">
              Our Impact
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 hover:text-emerald-700">
              Contact
            </button>
            <div className="pt-2 border-t border-slate-100">
              <Link to="/login" className="block text-center bg-[#14532d] text-white py-2.5 rounded-xl font-bold">
                Go to Portal Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 4. HERO SECTION (Faithfully matching provided visual reference) */}
      <section id="hero" className="relative bg-white pt-8 pb-16 lg:pt-14 lg:pb-20 overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column (7 cols on lg) */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-6">
              
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14532d] text-white text-xs font-semibold shadow-xs">
                <span>🌾</span>
                <span>Maharashtra | Sangli District | Miraj Taluka</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-slate-900 tracking-tight leading-[1.12]">
                Transparent <br />
                Food Grain Distribution <br />
                for a <span className="text-[#c27803]">Stronger Maharashtra</span>
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
                GrainGuard AI uses technology and data intelligence to ensure food grains reach every eligible family on time, transparently, and without leakage.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => scrollToSection('login-section')}
                  className="bg-[#14532d] hover:bg-[#0e3820] text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => scrollToSection('workflow')}
                  className="bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold px-5 py-3.5 rounded-xl border border-slate-300 shadow-2xs transition flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center">
                    <Play size={10} className="text-slate-800 ml-0.5 fill-slate-800" />
                  </div>
                  <span>Watch Demo / How It Works</span>
                </button>
              </div>

              {/* 4 Compact Demo Statistics (Horizontal Row as in Mockup) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                {/* Stat 1: Villages */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 leading-none">2</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">Villages (Demo)</div>
                    <div className="text-[11px] text-slate-500">Bedag, Belanki</div>
                  </div>
                </div>

                {/* Stat 2: FPS Shops */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Store size={18} />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 leading-none">2</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">Fair Price Shops</div>
                    <div className="text-[11px] text-slate-500">Miraj Taluka</div>
                  </div>
                </div>

                {/* Stat 3: Beneficiaries */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 leading-none">25+</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">Beneficiaries</div>
                    <div className="text-[11px] text-slate-500">(Demo Data)</div>
                  </div>
                </div>

                {/* Stat 4: Food Grains */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Wheat size={18} />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 leading-none">2</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">Food Grains</div>
                    <div className="text-[11px] text-slate-500">Rice, Wheat</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Visual Column (5 cols on lg) - Authentic Indian Farmer Scene */}
            <div className="lg:col-span-6 xl:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-16/11 lg:aspect-4/3">
                <img
                  src="/hero-farmer.jpg"
                  alt="Maharashtra Public Food Grain Distribution Center with Indian Farmer"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    // Fallback to landing-mockup if needed
                    e.currentTarget.src = '/landing-mockup.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Floating "Our Vision" Card (Overlapping as shown in design mockup) */}
              <div className="sm:absolute sm:-bottom-6 sm:-left-8 sm:max-w-md mt-4 sm:mt-0 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200 flex items-center gap-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Target size={24} className="text-emerald-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>Our Vision</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    A fair, transparent, and accountable Public Distribution System for every family in Maharashtra.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WORKFLOW SECTION ("OUR SYSTEM: From Government Allocation to Beneficiary") */}
      <section id="workflow" className="py-16 bg-[#edf6f0] border-b border-emerald-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300/60">
              OUR SYSTEM
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              From Government Allocation to Beneficiary
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5">
              End-to-end digital monitoring of the food grain distribution journey
            </p>
          </div>

          {/* 5 Connected Workflow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            {/* Step 1: Government Allocation */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center relative group hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition">
                <Building2 size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Government Allocation</h3>
              <p className="text-xs text-slate-500 mt-1">State level planning and allocation</p>
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 items-center justify-center text-slate-400">
                <ArrowRight size={12} />
              </div>
            </div>

            {/* Step 2: Central Godowns */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center relative group hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition">
                <Building2 size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Central Godowns</h3>
              <p className="text-xs text-slate-500 mt-1">Stock storage and inventory</p>
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 items-center justify-center text-slate-400">
                <ArrowRight size={12} />
              </div>
            </div>

            {/* Step 3: Transporters */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center relative group hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition">
                <Truck size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Transporters</h3>
              <p className="text-xs text-slate-500 mt-1">Safe and tracked transportation</p>
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 items-center justify-center text-slate-400">
                <ArrowRight size={12} />
              </div>
            </div>

            {/* Step 4: Ration Shops (FPS) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center relative group hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition">
                <Store size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Ration Shops (FPS)</h3>
              <p className="text-xs text-slate-500 mt-1">Distribution to eligible families</p>
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 items-center justify-center text-slate-400">
                <ArrowRight size={12} />
              </div>
            </div>

            {/* Step 5: Beneficiaries */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center relative group hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                <Users size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Beneficiaries</h3>
              <p className="text-xs text-slate-500 mt-1">Food security for every household</p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. ABOUT SECTION */}
      <section id="about" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-emerald-700" />
                <span>About GrainGuard AI</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-snug">
                Eliminating Grain Leakage with Digital Intelligence & Accountability
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The National Food Security Act (NFSA) mandates subsidized food grains for millions of households across Maharashtra. However, manual record keeping, in-transit weight discrepancies, and unauthorized diversion create severe operational vulnerabilities.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>GrainGuard AI</strong> establishes an unbroken chain of custody: from state-level quota allocations at Mantralaya to Sangli Central Godowns, GPS-tracked carrier trucks, village Fair Price Shops in Miraj, Bedag, and Belanki, directly into the hands of Antyodaya and Priority citizens.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>NFSA Compliance</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Strict statutory quota verification before grain disbursal.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Weighbridge Tare</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Automated shortage detection with 1.0% tolerance bounds.</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Pillar */}
            <div className="bg-[#fafaf7] p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center justify-between">
                <span>Core Governance Pillars</span>
                <span className="badge badge-info text-[10px]">Sangli Model</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Cryptographic SHA-256 Audit Trail</h4>
                    <p className="text-slate-500 mt-0.5">Every dispatch, receipt weighment, and ration disbursement is signed into an immutable audit ledger.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Explainable AI Anomaly Detection</h4>
                    <p className="text-slate-500 mt-0.5">Detects transit shortages and distribution surges (+73.3% anomalies) without black-box assumptions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Human-in-the-Loop Sovereign Oversight</h4>
                    <p className="text-slate-500 mt-0.5">AI acts as a diagnostic inspector; formal regulatory decisions require authorized civil officer review.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FEATURES SECTION */}
      <section id="features" className="py-16 bg-[#fcfbf7] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              PLATFORM CAPABILITIES
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              Comprehensive Technology for PDS Integrity
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5">
              Engineered to support civil supplies officers, depot managers, shop owners, and citizens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                <Scale size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-base">Weighbridge Shortage Reconciliation</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Direct Gross-Tare Net calculations compare warehouse dispatch manifests against shop gate weighbridge readings to detect leakage in transit.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-base">Anomaly Alerts & Risk Profiling</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Automated detection of abnormal disbursal velocities and stock discrepancies, flagging high-risk Fair Price Shops for formal scrutiny.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4">
                <FileCheck2 size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-base">AI-Assisted Shop Audit Agent</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Autonomous inspection agent cross-referencing ledger records, weighbridge manifests, and PDS circulars to generate grounded audit dossiers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-base">Policy RAG Assistant</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Semantic retrieval across statutory government resolutions (such as GR No. PDS-2024/CR-88/CS-21) with cited policy references.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-base">Beneficiary Citizen Portal</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Citizens inspect their digital ration card passbook, check monthly rice & wheat quota balances, and file grievance tickets directly.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
                <Lock size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-base">Role-Based Access Boundaries</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Strict administrative boundaries: District officers review anomalies, warehouse managers manage waybills, and dealers issue grains.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. ROLES & QUICK LOGIN SECTION (Direct 1-Click Access on Landing Page) */}
      <section id="login-section" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              AUTHORIZED PORTAL ACCESS
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              Experience the 7 Canonical Roles in Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5">
              Select any role below to launch directly into the simulated Sangli District demo workspace:
            </p>
          </div>

          {/* 7 Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Role 1: Super Admin */}
            <div className="card p-5 bg-[#fafaf8] border-slate-200 hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-info text-[9px]">STATE LEVEL</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-sm">Super Admin</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">admin.demo@example.com</p>
                <p className="text-xs text-slate-600 mt-2">
                  Full administrative oversight, global audit logs, user provisioning, and state allocations.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin(ROLES.SUPER_ADMIN)}
                className="mt-4 w-full btn btn-primary text-xs py-2 font-bold flex items-center justify-center gap-1.5"
              >
                <span>Enter Admin Console</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Role 2: District Officer */}
            <div className="card p-5 bg-[#fafaf8] border-emerald-300 ring-2 ring-emerald-500/20 hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-warning text-[9px] font-black">CORE VIGILANCE</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                    <Award size={16} />
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-sm">District Supply Officer (DSO)</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">officer.demo@example.com</p>
                <p className="text-xs text-slate-600 mt-2">
                  Sangli District oversight, Miraj Taluka anomaly investigations, and AI audit agent execution.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin(ROLES.DISTRICT_OFFICER)}
                className="mt-4 w-full bg-[#14532d] hover:bg-[#0e3820] text-white text-xs py-2 rounded-lg font-bold shadow flex items-center justify-center gap-1.5 transition"
              >
                <span>Enter DSO Console</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Role 3: Warehouse Manager */}
            <div className="card p-5 bg-[#fafaf8] border-slate-200 hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-info text-[9px]">STORAGE DEPOT</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-sm">Warehouse Manager</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">warehouse.demo@example.com</p>
                <p className="text-xs text-slate-600 mt-2">
                  Sangli Central Godown (`WH-SAN-001`), grain bagging, and electronic waybill dispatch.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin(ROLES.WAREHOUSE_MANAGER)}
                className="mt-4 w-full btn btn-secondary text-xs py-2 font-bold flex items-center justify-center gap-1.5"
              >
                <span>Enter Godown Depot</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Role 4: Transporter */}
            <div className="card p-5 bg-[#fafaf8] border-slate-200 hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-info text-[9px]">FLEET LOGISTICS</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Truck size={16} />
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-sm">Transporter Carrier</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">transporter.demo@example.com</p>
                <p className="text-xs text-slate-600 mt-2">
                  Vehicle `MH-10-AZ-5542` driver trip sheet, checkpoint milestones, and seal checks.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin(ROLES.TRANSPORTER)}
                className="mt-4 w-full btn btn-secondary text-xs py-2 font-bold flex items-center justify-center gap-1.5"
              >
                <span>Enter Fleet Console</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Role 5: FPS Owner */}
            <div className="card p-5 bg-[#fafaf8] border-slate-200 hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-info text-[9px]">RATION SHOP</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Store size={16} />
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-sm">FPS Dealer (Bedag)</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">fps.demo@example.com</p>
                <p className="text-xs text-slate-600 mt-2">
                  Bedag Seva Store (`FPS-BED-001`), gate weighment receipts, and e-PoS grain disbursals.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin(ROLES.FPS_OWNER)}
                className="mt-4 w-full btn btn-secondary text-xs py-2 font-bold flex items-center justify-center gap-1.5"
              >
                <span>Enter Shop POS</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Role 6: Beneficiary Citizen */}
            <div className="card p-5 bg-[#fafaf8] border-slate-200 hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-success text-[9px]">CITIZEN PASSBOOK</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-sm">Citizen Beneficiary</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">beneficiary.demo@example.com</p>
                <p className="text-xs text-slate-600 mt-2">
                  Tukaram Shinde (Bedag, AAY Card), digital entitlement check, and grievance filing.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin(ROLES.BENEFICIARY)}
                className="mt-4 w-full btn btn-secondary text-xs py-2 font-bold flex items-center justify-center gap-1.5"
              >
                <span>Enter Citizen Passbook</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Role 7: Auditor */}
            <div className="card p-5 bg-[#fafaf8] border-slate-200 hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-info text-[9px]">VIGILANCE BUREAU</span>
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                    <FileCheck2 size={16} />
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-sm">State Auditor</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">auditor.demo@example.com</p>
                <p className="text-xs text-slate-600 mt-2">
                  Cryptographic ledger verification, transit shortage forensic reports, and NFSA adherence.
                </p>
              </div>
              <button
                onClick={() => handleRoleQuickLogin(ROLES.AUDITOR)}
                className="mt-4 w-full btn btn-secondary text-xs py-2 font-bold flex items-center justify-center gap-1.5"
              >
                <span>Enter Audit Trail</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Custom Standard Login Box */}
            <div className="card p-5 bg-emerald-950 text-white border-emerald-900 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center mb-3">
                  <Lock size={18} />
                </div>
                <h3 className="font-black text-white text-base">Standard Sign In</h3>
                <p className="text-xs text-emerald-200/80 mt-1.5 leading-relaxed">
                  Have specific credentials or want to login with official government email & password?
                </p>
              </div>
              <Link
                to="/login"
                className="mt-4 w-full bg-white hover:bg-emerald-50 text-emerald-950 text-xs py-2.5 rounded-lg font-black text-center shadow transition flex items-center justify-center gap-1.5"
              >
                <span>Go to Full Login Page</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 9. IMPACT METRICS SECTION */}
      <section id="impact" className="py-16 bg-[#0e3820] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              OUR IMPACT
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-3">
              Strengthening Public Distribution Accountability
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium mt-1.5">
              Demonstrated across Miraj Sub-Division and Sangli District test clusters
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/80">
              <p className="text-4xl font-black text-white">100%</p>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mt-2">Digital Traceability</p>
              <p className="text-[11px] text-emerald-100/70 mt-1">From Central Godown to Village Shop</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/80">
              <p className="text-4xl font-black text-amber-400">&lt; 1.0%</p>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mt-2">Transit Tolerance</p>
              <p className="text-[11px] text-emerald-100/70 mt-1">Statutory NFSA tare limits enforced</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/80">
              <p className="text-4xl font-black text-white">1,480</p>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mt-2">Fair Price Shops</p>
              <p className="text-[11px] text-emerald-100/70 mt-1">Under Sangli District supervision</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/80">
              <p className="text-4xl font-black text-emerald-300">24 / 7</p>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mt-2">AI Vigilance</p>
              <p className="text-[11px] text-emerald-100/70 mt-1">Continuous anomaly & spike detection</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CONTACT & CITIZEN INFORMATION SECTION */}
      <section id="contact" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                GOVERNMENT HELPDESK
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Civil Supplies Vigilance & Public Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                For public distribution grievances, ration card inquiries, or shop inspection reporting, contact the Miraj Sub-Division Civil Supplies Office or use the state toll-free helpline.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </div>
                  <span><strong>District Supply Office (DSO):</strong> Collectorate Campus, Sangli, Maharashtra - 416416</span>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <Phone size={16} />
                  </div>
                  <span><strong>Citizen Helpline (Toll-Free):</strong> 1967 / 1800-22-4950 (09:45 AM - 06:15 PM)</span>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <span><strong>Official Desk:</strong> dso.sangli@maharashtra.gov.in</span>
                </div>
              </div>
            </div>

            {/* Sangli Gazetteer Map & Info Box */}
            <div className="bg-[#fafaf7] p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 size={18} className="text-emerald-800" />
                  <span>Miraj Sub-Division PDS Directory</span>
                </div>
                <span className="badge badge-success text-[10px]">Active Hub</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Taluka Tehsildar</span>
                  <span className="font-extrabold text-slate-900">Smt. Vandana Patil</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">Miraj Tahsil Office</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Central Godown Depot</span>
                  <span className="font-extrabold text-slate-900">WH-SAN-001 (100 MT)</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">Sangli Central Godown #1</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2">
                <ShieldCheck size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>NFSA Antyodaya Notice:</strong> Monthly scale of issue is 35 KG per AAY family (20 KG Rice @ ₹3/kg, 15 KG Wheat @ ₹2/kg) strictly via e-PoS device.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 11. OFFICIAL FOOTER */}
      <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-xs">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-black text-lg">
                <ShieldCheck size={22} className="text-emerald-400" />
                <span>GrainGuard AI</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                AI-Powered Food Grain Distribution Intelligence & Accountability Platform for the Maharashtra Public Distribution System.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">
                NFSA Maharashtra • Sangli Pilot
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Navigation</h4>
              <ul className="space-y-1.5">
                <li><button onClick={() => scrollToSection('hero')} className="hover:text-white transition">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition">About the System</button></li>
                <li><button onClick={() => scrollToSection('workflow')} className="hover:text-white transition">Physical Movement Workflow</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition">Platform Features</button></li>
                <li><button onClick={() => scrollToSection('impact')} className="hover:text-white transition">Public Distribution Impact</button></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Authorized Portals</h4>
              <ul className="space-y-1.5">
                <li><button onClick={() => handleRoleQuickLogin(ROLES.SUPER_ADMIN)} className="hover:text-white transition">State Headquarters Portal</button></li>
                <li><button onClick={() => handleRoleQuickLogin(ROLES.DISTRICT_OFFICER)} className="hover:text-white transition">District Supply Office (DSO)</button></li>
                <li><button onClick={() => handleRoleQuickLogin(ROLES.WAREHOUSE_MANAGER)} className="hover:text-white transition">Central Godown Depot</button></li>
                <li><button onClick={() => handleRoleQuickLogin(ROLES.FPS_OWNER)} className="hover:text-white transition">Fair Price Shop (FPS) e-PoS</button></li>
                <li><button onClick={() => handleRoleQuickLogin(ROLES.BENEFICIARY)} className="hover:text-white transition">Citizen Ration Passbook</button></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-xs">Statutory Regulations</h4>
              <ul className="space-y-1.5">
                <li><span className="text-slate-300">National Food Security Act (NFSA) 2013</span></li>
                <li><span className="text-slate-300">Maharashtra GR No. PDS-2024/CR-88/CS-21</span></li>
                <li><span className="text-slate-300">PDS Control Order Section 30</span></li>
                <li><span className="text-slate-300">Weighbridge SOP v2024.1</span></li>
              </ul>
            </div>
          </div>

          {/* Sample Data Disclaimer Box */}
          <div className="my-6 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-400">⚠️ DEMO MODE — SAMPLE DATA ONLY:</span> This portal is an intelligence and accountability system demonstration for Maharashtra PDS (Sangli District • Miraj Taluka • Bedag & Belanki villages). All transactional ledgers, truck shipments, and beneficiary cards are simulated for academic evaluation and governance prototype review.
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              © 2026 GrainGuard AI • Government of Maharashtra Food Grain Distribution Intelligence Platform.
            </div>
            <div className="flex items-center gap-4">
              <span>All Rights Reserved</span>
              <span>•</span>
              <Link to="/login" className="text-emerald-400 hover:underline">Official Login</Link>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
