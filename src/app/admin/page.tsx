'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  ShieldCheck,
  Lock,
  LogOut,
  ArrowRight,
  Building2,
} from 'lucide-react';

export default function VSAInstitutePortalPage() {
  const router = useRouter();
  const { addToast, instituteSettings } = useVectora();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

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

  const handleSignOut = () => {
    sessionStorage.removeItem('vsa_admin_auth');
    setIsAuthenticated(false);
    addToast('Signed Out', 'You have securely signed out of your Institute Portal.', 'info');
    router.push('/');
  };

  const handleOpenIDCard = (studentId: string) => {
    setSelectedStudentIdForCard(studentId);
    setActiveModal('idCard');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse text-xs font-mono text-slate-400">Loading Institute Portal...</div>
      </div>
    );
  }

  // REDIRECT / PROMPT IF NOT SIGNED IN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 text-center">
          <div className="inline-flex p-3.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Authentication Required</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Please sign in on the VSA Authentication Portal to access your institute&apos;s isolated attendance scanner and directory.
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Go to Sign In / Sign Up Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // AUTHENTICATED INSTITUTE PORTAL
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner strip */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white px-4 sm:px-6 lg:px-8 py-2.5 text-xs flex items-center justify-between border-b border-indigo-500/20">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span className="font-extrabold tracking-wide uppercase">
            {instituteSettings.institute_name} — VSA INSTITUTE COMMAND PORTAL
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[11px] font-bold transition-colors"
        >
          <LogOut className="w-3 h-3" />
          <span>Sign Out</span>
        </button>
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
