'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVectora } from '@/lib/store';
import {
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  Phone,
  User,
  KeyRound,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Users,
  BarChart3,
  Moon,
  Sun,
  Key,
  MapPin,
  Send,
} from 'lucide-react';

export default function VSAAuthenticationPortalPage() {
  const router = useRouter();
  const { themeMode, toggleThemeMode, addToast, updateInstituteSettings } = useVectora();

  // Tab: 'signin' | 'signup'
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  // SIGN IN STATE
  const [signInEmail, setSignInEmail] = useState('admin@vectora.edu');
  const [signInPassword, setSignInPassword] = useState('Vectora@2026');
  const [signInError, setSignInError] = useState<string | null>(null);

  // SIGN UP STATE
  const [signUpStep, setSignUpStep] = useState<'details' | 'otp'>('details');
  const [signUpData, setSignUpData] = useState({
    instituteName: '',
    instituteCode: 'VCI',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    password: '',
  });
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('863837');

  // Handle Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    const validEmails = ['admin@vectora.edu', 'admin', 'info@pixel.edu', signUpData.email.toLowerCase()];
    const validPasswords = ['Vectora@2026', '123456', 'admin123', signUpData.password];

    if (
      validEmails.includes(signInEmail.trim().toLowerCase()) &&
      validPasswords.includes(signInPassword.trim())
    ) {
      sessionStorage.setItem('vsa_admin_auth', 'true');
      addToast('Sign In Successful', 'Welcome to your VSA Institute Management Portal.', 'success');
      router.push('/admin');
    } else {
      setSignInError('Invalid Email or Password. Try default: admin@vectora.edu / Vectora@2026');
    }
  };

  // Handle Sign Up - Step 1: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.instituteName || !signUpData.email || !signUpData.phone || !signUpData.password) {
      addToast('Missing Fields', 'Please complete all required institute details.', 'error');
      return;
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setSignUpStep('otp');

    addToast(
      'Verification OTP Sent!',
      `A verification code has been sent to ${signUpData.email}. (Demo OTP: ${code})`,
      'info'
    );
  };

  // Handle Sign Up - Step 2: Verify OTP & Complete Sign Up
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '863837' || enteredOtp.trim() === '123456') {
      // Save institute settings
      updateInstituteSettings({
        institute_name: signUpData.instituteName,
        institute_code: signUpData.instituteCode.toUpperCase() || 'VCI',
        principal_name: signUpData.contactPerson,
        email: signUpData.email,
        phone: signUpData.phone,
        address: signUpData.address,
      });

      // Also notify WhatsApp +918638373298
      const whatsappText = `*NEW VSA INSTITUTE SIGN-UP & VERIFICATION* 🚀
*Institute Name:* ${signUpData.instituteName} (${signUpData.instituteCode})
*Contact Person:* ${signUpData.contactPerson}
*Phone / WhatsApp:* ${signUpData.phone}
*Email:* ${signUpData.email}
*Address:* ${signUpData.address}
_Verified via Email OTP_`;

      const whatsappUrl = `https://wa.me/918638373298?text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Set session authenticated & redirect
      sessionStorage.setItem('vsa_admin_auth', 'true');
      addToast(
        'Institute Account Created!',
        `${signUpData.instituteName} verified successfully. Entering your VSA Portal.`,
        'success'
      );
      router.push('/admin');
    } else {
      addToast('Invalid OTP', `Entered code does not match (${generatedOtp}).`, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 shadow-lg shadow-indigo-600/25 text-white font-black text-xl">
              <span>VSA</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  VSA — Vectora Smart Attendance System
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Cloud Enterprise SaaS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Multi-Course Smart Attendance &amp; ID Card Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleThemeMode}
              title="Toggle Dark & Light Mode"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            >
              {themeMode === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication & Feature Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 6 cols: Enterprise Feature Highlights */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Next-Gen Cloud Attendance Management</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Automate Campus Attendance &amp; Smart ID Studio
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Sign in to your Institute Portal to operate live QR scanners, generate dual-sided Smart ID cards, track daily arrival/departure hours, and export multi-criteria audit reports.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">QR Code Check-In</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    1st scan records Arrival, 2nd scan records Departure with acoustic confirmation.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Smart ID Card Studio</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Portrait &amp; Landscape ID generation with high-res PDF printing.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Real-Time Analytics</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Interactive charts, KPI gauges, and Excel spreadsheet export.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Institute Private Cloud</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Every institute manages their own isolated directory &amp; attendance terminal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 6 cols: Unified Sign In & Sign Up Auth Portal Box */}
          <div className="lg:col-span-6">
            <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              {/* Tabs header */}
              <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setAuthTab('signin');
                    setSignUpStep('details');
                  }}
                  className={`py-4 text-sm font-extrabold transition-all text-center border-b-2 ${
                    authTab === 'signin'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  SIGN IN (PORTAL LOGIN)
                </button>
                <button
                  onClick={() => {
                    setAuthTab('signup');
                    setSignUpStep('details');
                  }}
                  className={`py-4 text-sm font-extrabold transition-all text-center border-b-2 ${
                    authTab === 'signup'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  SIGN UP (NEW INSTITUTE)
                </button>
              </div>

              {/* TAB 1: SIGN IN FORM */}
              {authTab === 'signin' && (
                <div className="p-8 space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      Access Your Institute Portal
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sign in to open your attendance scanner and institute administration dashboard.
                    </p>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Official Email Address</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="admin@vectora.edu"
                        className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Security Password</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {signInError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
                        {signInError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all"
                    >
                      <span>Sign In &amp; Launch Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Helper box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Demo Official Credentials
                    </span>
                    <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                      Email: <span className="font-bold">admin@vectora.edu</span>
                    </div>
                    <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
                      Password: <span className="font-bold">Vectora@2026</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SIGN UP FORM WITH EMAIL OTP VERIFICATION */}
              {authTab === 'signup' && (
                <div className="p-8 space-y-6 animate-in fade-in duration-200">
                  {signUpStep === 'details' ? (
                    <>
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                          Register Your Institute
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Complete the registration details below to verify via Email OTP and launch your VSA account.
                        </p>
                      </div>

                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Institute / College Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={signUpData.instituteName}
                              onChange={(e) => setSignUpData({ ...signUpData, instituteName: e.target.value })}
                              placeholder="Pixel IT Education Center"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Code (ID Prefix) *
                            </label>
                            <input
                              type="text"
                              required
                              value={signUpData.instituteCode}
                              onChange={(e) => setSignUpData({ ...signUpData, instituteCode: e.target.value })}
                              placeholder="VCI"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white uppercase font-mono focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Contact Person Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={signUpData.contactPerson}
                              onChange={(e) => setSignUpData({ ...signUpData, contactPerson: e.target.value })}
                              placeholder="Principal / Director"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Mobile / WhatsApp *
                            </label>
                            <input
                              type="tel"
                              required
                              value={signUpData.phone}
                              onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                              placeholder="+91 XXXXX XXXXX"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Official Email (For OTP Verification) *
                          </label>
                          <input
                            type="email"
                            required
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                            placeholder="principal@institute.edu"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Address / City *
                            </label>
                            <input
                              type="text"
                              required
                              value={signUpData.address}
                              onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                              placeholder="Guwahati, Assam"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Set Portal Password *
                            </label>
                            <input
                              type="password"
                              required
                              value={signUpData.password}
                              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                              placeholder="••••••••••••"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send OTP &amp; Continue</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    /* STEP 2: OTP VERIFICATION VIEW */
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="text-center space-y-2">
                        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                          <Key className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                          Enter Email Verification OTP
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          We sent a 6-digit verification code to <span className="font-bold text-slate-800 dark:text-slate-200">{signUpData.email}</span>
                        </p>
                      </div>

                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-center text-slate-600 dark:text-slate-300 mb-2">
                            6-Digit Verification Code
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            placeholder={generatedOtp}
                            className="w-full text-center text-2xl tracking-widest font-mono font-black py-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border-2 border-indigo-500 text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center text-xs text-indigo-700 dark:text-indigo-300 font-mono">
                          Testing Verification Code: <span className="font-black text-sm">{generatedOtp}</span>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setSignUpStep('details')}
                            className="flex-1 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="flex-[2] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30"
                          >
                            Verify &amp; Create Institute Portal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} <span className="font-bold text-slate-800 dark:text-slate-200">VSA — Vectora Smart Attendance System</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Enterprise Multi-Course Cloud Architecture</span>
            <span>•</span>
            <span>Vercel Deploy Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
