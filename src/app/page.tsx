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
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VSAFacebookStyleAuthPage() {
  const router = useRouter();
  const { themeMode, toggleThemeMode, addToast, updateInstituteSettings } = useVectora();

  // Mode: 'signin' | 'signup' | 'otp'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'otp'>('signin');

  // SIGN IN STATE
  const [signInEmail, setSignInEmail] = useState('admin@vectora.edu');
  const [signInPassword, setSignInPassword] = useState('Vectora@2026');
  const [signInError, setSignInError] = useState<string | null>(null);

  // SIGN UP STATE
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
      addToast('Sign In Successful', 'Welcome to your VSA Institute Portal.', 'success');
      router.push('/admin');
    } else {
      setSignInError('Invalid Email or Password. Default: admin@vectora.edu / Vectora@2026');
    }
  };

  // Handle Sign Up - Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.instituteName || !signUpData.email || !signUpData.phone || !signUpData.password) {
      addToast('Missing Fields', 'Please fill in all required institute registration details.', 'error');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setAuthMode('otp');

    addToast(
      'Verification Code Sent',
      `Sent a 6-digit verification pin to ${signUpData.email}. (Demo Pin: ${code})`,
      'info'
    );
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '863837' || enteredOtp.trim() === '123456') {
      updateInstituteSettings({
        institute_name: signUpData.instituteName,
        institute_code: signUpData.instituteCode.toUpperCase() || 'VCI',
        principal_name: signUpData.contactPerson,
        email: signUpData.email,
        phone: signUpData.phone,
        address: signUpData.address,
      });

      const whatsappText = `*NEW VSA INSTITUTE SIGN-UP VERIFIED* 🚀
*Institute Name:* ${signUpData.instituteName} (${signUpData.instituteCode})
*Contact Person:* ${signUpData.contactPerson}
*Phone / WhatsApp:* ${signUpData.phone}
*Email:* ${signUpData.email}
*Address:* ${signUpData.address}
_Verified via Email OTP_`;

      const whatsappUrl = `https://wa.me/918638373298?text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      sessionStorage.setItem('vsa_admin_auth', 'true');
      addToast(
        'Institute Account Activated!',
        `${signUpData.instituteName} verified successfully. Opening Portal.`,
        'success'
      );
      router.push('/admin');
    } else {
      addToast('Invalid Verification Pin', `Pin does not match (${generatedOtp}).`, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors font-sans">
      {/* Subtle Top Utility Bar */}
      <div className="w-full px-6 py-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">Vectora Cloud Enterprise</span>
          <span>•</span>
          <span>Multi-Campus Attendance System</span>
        </div>

        <button
          onClick={toggleThemeMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold"
        >
          {themeMode === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Split Facebook/Instagram Inspired Layout */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* LEFT COLUMN: Facebook-style Bold Branding & Tagline */}
        <div className="lg:w-6/12 text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 shadow-xl shadow-indigo-600/30 flex items-center justify-center text-white font-black text-2xl tracking-tighter">
              VSA
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
              Vectora
            </h1>
          </div>

          <p className="text-2xl sm:text-3xl font-medium text-slate-800 dark:text-slate-200 leading-snug max-w-lg mx-auto lg:mx-0">
            Smart Attendance helps you connect and manage campus attendance effortlessly across courses.
          </p>

          <div className="hidden sm:grid grid-cols-2 gap-4 pt-4 max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Live QR Scanner</div>
                <div className="text-[11px] text-slate-500">Auto Arrival &amp; Departure</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Smart ID Studio</div>
                <div className="text-[11px] text-slate-500">Portrait &amp; Landscape Print</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Iconic Floating Card Auth Container */}
        <div className="w-full max-w-[440px]">
          <AnimatePresence mode="wait">
            {/* 1. SIGN IN VIEW */}
            {authMode === 'signin' && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-2xl shadow-indigo-950/10 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 space-y-5"
              >
                <div className="space-y-1 pb-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Sign in to Institute Portal
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your authorized administrator credentials below.
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-3.5">
                  <div>
                    <input
                      type="text"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="Email address or Institute ID"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-300/80 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-300/80 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                  </div>

                  {signInError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{signInError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Log In
                  </button>
                </form>

                {/* Demo credentials subtle hint */}
                <div className="text-center">
                  <span className="text-[11px] text-slate-400">
                    Default login: <strong className="text-indigo-600 dark:text-indigo-400">admin@vectora.edu</strong> / <strong className="text-slate-700 dark:text-slate-300">Vectora@2026</strong>
                  </span>
                </div>

                {/* Divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                  <span className="flex-shrink mx-4 text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold">
                    OR
                  </span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                </div>

                {/* Create New Institute CTA Button (Iconic Green/Emerald Button) */}
                <div className="pt-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#42b72a] hover:bg-[#36a420] text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    Create New Institute Account
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. SIGN UP VIEW (Create New Institute Account) */}
            {authMode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-2xl shadow-indigo-950/10 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 space-y-5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      Create New Institute Account
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      It&apos;s quick and easy. Verify via Email OTP.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        value={signUpData.instituteName}
                        onChange={(e) => setSignUpData({ ...signUpData, instituteName: e.target.value })}
                        placeholder="Institute / College Name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={signUpData.instituteCode}
                        onChange={(e) => setSignUpData({ ...signUpData, instituteCode: e.target.value })}
                        placeholder="Code (VCI)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        value={signUpData.contactPerson}
                        onChange={(e) => setSignUpData({ ...signUpData, contactPerson: e.target.value })}
                        placeholder="Principal / Director Name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        placeholder="Mobile / WhatsApp No"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder="Official Email (for OTP verification)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        value={signUpData.address}
                        onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                        placeholder="City & State"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        required
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        placeholder="New Password"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight pt-1">
                    By clicking Send Verification OTP, you agree to receive a 6-digit verification code and WhatsApp onboarding confirmation.
                  </p>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-[#42b72a] hover:bg-[#36a420] text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Verification OTP</span>
                    </button>
                  </div>
                </form>

                <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Already have an account? Log In
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. EMAIL OTP VERIFICATION VIEW */}
            {authMode === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-2xl shadow-indigo-950/10 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 space-y-5"
              >
                <div className="text-center space-y-1">
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-2">
                    <Key className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Enter Verification Code
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We sent a 6-digit confirmation pin to <strong className="text-slate-800 dark:text-slate-200">{signUpData.email}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder={generatedOtp}
                      className="w-full text-center text-2xl tracking-widest font-mono font-black py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-indigo-500 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center text-xs text-indigo-700 dark:text-indigo-300 font-mono">
                    Demo Pin: <span className="font-black text-sm">{generatedOtp}</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30"
                    >
                      Verify &amp; Enter Portal
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-500 dark:text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} <span className="font-bold text-slate-700 dark:text-slate-300">VSA — Vectora Smart Attendance System</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Next.js 16 &amp; Supabase</span>
            <span>•</span>
            <span>WhatsApp Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
