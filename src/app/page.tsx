'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useVectora } from '@/lib/store';
import { getTodayDateString } from '@/lib/utils';
import {
  QrCode,
  UserCheck,
  ShieldCheck,
  Moon,
  Sun,
  Lock,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Building2,
} from 'lucide-react';

// Modals
import { QRScannerModal } from '@/components/QRScannerModal';
import { ManualAttendanceModal } from '@/components/ManualAttendanceModal';
import { InstituteInquiryModal } from '@/components/InstituteInquiryModal';

export default function VSAPublicTerminalPage() {
  const { instituteSettings, themeMode, toggleThemeMode, attendance } = useVectora();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [activeModal, setActiveModal] = useState<
    'qrScanner' | 'manualAttendance' | 'instituteInquiry' | null
  >(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = getTodayDateString();
  const todayRecords = attendance.filter((a) => a.date === todayStr);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
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
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Campus Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {instituteSettings.institute_name} ({instituteSettings.institute_code}) Official Portal
              </p>
            </div>
          </div>

          {/* Right Controls: Clock, Theme, Admin Link */}
          <div className="flex items-center gap-3">
            {/* System Clock */}
            <div className="hidden md:flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{currentDate}</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                <span>{currentTime || '10:00:00 AM'}</span>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleThemeMode}
              title="Toggle Dark & Light Mode"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            >
              {themeMode === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* Admin Portal Button */}
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400 dark:text-indigo-600" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Terminal Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center">
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            VSA — Vectora Smart Attendance System
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Automatic Check-In &amp; Check-Out Terminal. Scan your Smart ID card or enter your ID number below.
          </p>
        </div>

        {/* Two Large Core Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full mb-10">
          {/* 1. QR Code Scanner Card */}
          <div
            onClick={() => setActiveModal('qrScanner')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 border border-indigo-500/30 shadow-2xl hover:shadow-indigo-600/20 cursor-pointer transition-all transform hover:-translate-y-1"
          >
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-4 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                  <QrCode className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  INSTANT SCANNER
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  QR Code Attendance Scanner
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Direct mobile &amp; webcam optical scanner.
                  <br />
                  <span className="text-cyan-300 font-semibold">1st Scan: Check-In (Arrival)</span> |{' '}
                  <span className="text-emerald-300 font-semibold">2nd Scan: Check-Out (Departure)</span>
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10 text-xs font-bold text-cyan-300">
                <span>Open Scanner Camera</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* 2. Manual Attendance Entry Card */}
          <div
            onClick={() => setActiveModal('manualAttendance')}
            className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-1"
          >
            <div className="flex flex-col h-full justify-between space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                  <UserCheck className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  MANUAL ENTRY
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Manual Attendance Entry
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Lookup student by official ID Number or Full Name to record arrival or departure time cleanly.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Open Manual Lookup</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Want VSA for Your Institute? Sign Up / WhatsApp Contact Banner */}
        <div className="max-w-4xl mx-auto w-full mb-10">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">
                  Want VSA — Vectora Smart Attendance for Your Institute?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Deploy cloud Smart Attendance with ID card printing &amp; real-time reports for your college or academy.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('instituteInquiry')}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Sign Up / Contact via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Live Today's Check-in Feed Strip */}
        <div className="max-w-4xl mx-auto w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Today&apos;s Live Campus Check-Ins ({todayRecords.length})
              </h4>
            </div>
            <Link
              href="/admin"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Admin Dashboard →
            </Link>
          </div>

          {todayRecords.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No check-in records for today yet. Scan a QR card above to log the first student!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {todayRecords.slice(0, 6).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {rec.student_name}
                    </div>
                    <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      {rec.student_id}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg shrink-0">
                    {rec.departure_time ? `Out: ${rec.departure_time}` : rec.arrival_time || 'Present'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} <span className="font-bold text-slate-800 dark:text-slate-200">VSA — Vectora Smart Attendance System</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveModal('instituteInquiry')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
            >
              Institute Sign-Up Inquiry (+91 86383 73298)
            </button>
            <span>•</span>
            <Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold">
              Admin Login Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* ACTIVE MODALS */}
      {activeModal === 'qrScanner' && (
        <QRScannerModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'manualAttendance' && (
        <ManualAttendanceModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'instituteInquiry' && (
        <InstituteInquiryModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
