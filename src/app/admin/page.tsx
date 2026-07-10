'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/views/DashboardView';
import { StudentsView } from '@/components/views/StudentsView';
import { AttendanceView } from '@/components/views/AttendanceView';
import { ReportsView } from '@/components/views/ReportsView';
import { SettingsView } from '@/components/views/SettingsView';

// Modals
import { IDCardModal } from '@/components/IDCardModal';
import { QRScannerModal } from '@/components/QRScannerModal';
import { ManualAttendanceModal } from '@/components/ManualAttendanceModal';
import { StudentRegistrationModal } from '@/components/StudentRegistrationModal';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function VSAAdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal control states
  const [activeModal, setActiveModal] = useState<
    'idCard' | 'qrScanner' | 'manualAttendance' | 'registerStudent' | null
  >(null);
  const [selectedStudentIdForCard, setSelectedStudentIdForCard] = useState<string | null>(null);

  const handleOpenIDCard = (studentId: string) => {
    setSelectedStudentIdForCard(studentId);
    setActiveModal('idCard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner strip indicating Admin Portal */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white px-4 sm:px-6 lg:px-8 py-2 text-xs flex items-center justify-between border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-bold tracking-wide">VSA — VECTORA SMART ATTENDANCE ADMIN PORTAL</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-indigo-300 hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Attendance Scanner</span>
        </Link>
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
