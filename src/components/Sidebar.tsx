'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  FileSpreadsheet,
  Settings,
  QrCode,
  Sparkles,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useVectora } from '@/lib/store';

interface SidebarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  onOpenQRScanner?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
  onOpenQRScanner,
  isOpen = false,
  onClose,
}) => {
  const { instituteSettings } = useVectora();

  const handleSelectTab = (tab: string) => {
    setActiveTab?.(tab);
    onTabChange?.(tab);
    onClose?.();
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: '',
    },
    {
      id: 'students',
      label: 'Students',
      icon: Users,
      badge: 'Smart ID',
    },
    {
      id: 'attendance',
      label: 'Attendance Hub',
      icon: CalendarCheck2,
      badge: 'Live',
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: FileSpreadsheet,
      badge: 'Export',
    },
    {
      id: 'settings',
      label: 'Institute Settings',
      icon: Settings,
      badge: '',
    },
  ];

  const sidebarContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full justify-between">
      {/* Navigation items */}
      <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        {isMobile && (
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                {instituteSettings.institute_code}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                  {instituteSettings.institute_name}
                </div>
                <div className="text-[10px] text-slate-400">Navigation Menu</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Bottom Promotion Card */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-indigo-950 border border-indigo-500/25 shadow-xl relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Smart Attendance</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Quickly verify student identity or mark check-in/out via instant QR code scan.
          </p>
          <button
            onClick={() => {
              onOpenQRScanner?.();
              onClose?.();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Launch Scanner</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg min-h-[calc(100vh-4rem)]">
        {sidebarContent(false)}
      </aside>

      {/* Mobile / Tablet Hamburger Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-white dark:bg-slate-950 shadow-2xl flex flex-col border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-300">
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
