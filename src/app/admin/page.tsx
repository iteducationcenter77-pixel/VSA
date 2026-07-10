'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/views/DashboardView';
import { StudentsView } from '@/components/views/StudentsView';
import { AttendanceView } from '@/components/views/AttendanceView';
import { ReportsView } from '@/components/views/ReportsView';
import { SettingsView } from '@/components/views/SettingsView';
import { useVectora } from '@/lib/store';

// Modals
import { IDCardModal } from '@/components/IDCardModal';
import { QRScannerModal } from '@/components/QRScannerModal';
import { ManualAttendanceModal } from '@/components/ManualAttendanceModal';
import { StudentRegistrationModal } from '@/components/StudentRegistrationModal';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  KeyRound,
  User,
  LogOut,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function VSAAdminPage() {
  const { addToast } = useVectora();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard navigation & modals
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<
    'idCard' | 'qrScanner' | 'manualAttendance' | 'registerStudent' | null
  >(null);
  const [selectedStudentIdForCard, setSelectedStudentIdForCard] = useState<string | null>(null);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('vsa_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
    setAuthChecked(true);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const validUsernames = ['admin', 'admin@vectora.edu', 'vsa-admin'];
    const validPasswords = ['Vectora@2026', '123456', 'admin123'];

    if (
      validUsernames.includes(loginUsername.trim().toLowerCase()) &&
      validPasswords.includes(loginPassword.trim())
    ) {
      sessionStorage.setItem('vsa_admin_auth', 'true');
      setIsAuthenticated(true);
      addToast('Admin Authenticated', 'Welcome to the Vectora Smart Attendance Enterprise Portal.', 'success');
    } else {
      setLoginError('Invalid Admin Username or Password. Please verify your credentials.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('vsa_admin_auth');
    setIsAuthenticated(false);
    addToast('Logged Out', 'Admin session locked successfully.', 'info');
  };

  const handleOpenIDCard = (studentId: string) => {
    setSelectedStudentIdForCard(studentId);
    setActiveModal('idCard');
  };

  // Wait until we check sessionStorage on mount
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse text-xs font-mono text-slate-400">Verifying security token...</div>
      </div>
    );
  }

  // LOGIN SCREEN GUARD
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">VSA Admin Portal Secure Login</h2>
            <p className="text-xs text-slate-400">
              Enter your authorized administrative credentials to manage students, ID cards, and attendance records.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admin Username / Official Email</span>
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin@vectora.edu"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Password</span>
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Default Official Credentials
            </span>
            <div className="text-xs font-mono text-indigo-300">
              Username: <span className="text-white font-bold">admin@vectora.edu</span>
            </div>
            <div className="text-xs font-mono text-cyan-300">
              Password: <span className="text-white font-bold">Vectora@2026</span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Attendance Scanner</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner strip indicating Admin Portal */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white px-4 sm:px-6 lg:px-8 py-2 text-xs flex items-center justify-between border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-bold tracking-wide">VSA — VECTORA SMART ATTENDANCE ADMIN PORTAL</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-indigo-300 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Scanner</span>
          </Link>
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[11px] font-bold transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* Navbar */}
      <Navbar
        onOpenQRScanner={() => setActiveModal('qrScanner')}
        onOpenAddStudent={() => setActiveModal('registerStudent')}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && activeTab !== 'students') {
            setActiveTab('students');
          }
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenQRScanner={() => setActiveModal('qrScanner')}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                onOpenQRScanner={() => setActiveModal('qrScanner')}
                onOpenManualAttendance={() => setActiveModal('manualAttendance')}
                onOpenAddStudent={() => setActiveModal('registerStudent')}
                onNavigateToTab={setActiveTab}
                onOpenIDCard={handleOpenIDCard}
              />
            )}

            {activeTab === 'students' && (
              <StudentsView
                onOpenAddStudent={() => setActiveModal('registerStudent')}
                onOpenIDCard={handleOpenIDCard}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceView
                onOpenQRScanner={() => setActiveModal('qrScanner')}
                onOpenManualAttendance={() => setActiveModal('manualAttendance')}
              />
            )}

            {activeTab === 'reports' && <ReportsView />}

            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* ACTIVE MODALS */}
      {activeModal === 'idCard' && selectedStudentIdForCard && (
        <IDCardModal
          studentId={selectedStudentIdForCard}
          onClose={() => {
            setActiveModal(null);
            setSelectedStudentIdForCard(null);
          }}
        />
      )}

      {activeModal === 'qrScanner' && (
        <QRScannerModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'manualAttendance' && (
        <ManualAttendanceModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'registerStudent' && (
        <StudentRegistrationModal
          onClose={() => setActiveModal(null)}
          onOpenIDCard={handleOpenIDCard}
        />
      )}
    </div>
  );
}
