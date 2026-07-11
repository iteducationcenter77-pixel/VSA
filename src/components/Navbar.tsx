'use client';

import React, { useState, useEffect } from 'react';
import { useVectora } from '@/lib/store';
import {
  QrCode,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  Calendar,
  Clock,
  UserCheck,
  PlusCircle,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  onOpenQRScanner: () => void;
  onOpenManualAttendance?: () => void;
  onOpenAddStudent: () => void;
  onOpenVercelDatabase?: () => void;
  onSearchQueryChange?: (query: string) => void;
  onSearchChange?: (query: string) => void;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onOpenQRScanner,
  onOpenManualAttendance,
  onOpenAddStudent,
  onOpenVercelDatabase,
  onSearchQueryChange,
  onSearchChange,
}) => {
  const { instituteSettings, themeMode, toggleThemeMode, students, attendance } = useVectora();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    onSearchQueryChange?.(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const presentTodayCount = attendance.filter((a) => a.date === todayStr).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity + Hamburger Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/20 text-white font-black text-lg">
            {instituteSettings.logo_url && instituteSettings.logo_url.startsWith('http') ? (
              <img
                src={instituteSettings.logo_url}
                alt="Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span>{instituteSettings.institute_code}</span>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div className="hidden sm:flex flex-col">
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
              {instituteSettings.institute_name}
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Cloud v2.0
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>{instituteSettings.institute_code}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {presentTodayCount}/{students.length} Present Today
              </span>
            </p>
          </div>
        </div>

        {/* Middle: Live Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search by Student Name, ID (VCI-XX), or Course..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right: Live Clock & Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Live System Clock */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{currentDate}</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              <span>{currentTime || '10:00:00 AM'}</span>
            </div>
          </div>

          {/* Quick Add Student Button */}
          <button
            onClick={onOpenAddStudent}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Student</span>
          </button>

          {/* Manual Attendance Trigger */}
          <button
            onClick={onOpenManualAttendance}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
          >
            <UserCheck className="w-4 h-4 text-indigo-500" />
            <span>Manual</span>
          </button>

          {/* Primary QR Attendance Scan Trigger */}
          <button
            onClick={onOpenQRScanner}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <QrCode className="w-4 h-4 animate-pulse" />
            <span>Scan QR Attendance</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleThemeMode}
            aria-label="Toggle Dark Mode"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
