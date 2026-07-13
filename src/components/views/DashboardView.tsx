'use client';

import React from 'react';
import { useVectora } from '@/lib/store';
import { getTodayDateString } from '@/lib/utils';
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  LogIn,
  LogOut,
  UserPlus,
  QrCode,
  CalendarCheck2,
  FileSpreadsheet,
  Settings,
  Sparkles,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

interface DashboardViewProps {
  onOpenQRScanner: () => void;
  onOpenManualAttendance: () => void;
  onOpenAddStudent: () => void;
  onNavigateToTab: (tab: string) => void;
  onOpenIDCard: (studentId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQRScanner,
  onOpenManualAttendance,
  onOpenAddStudent,
  onNavigateToTab,
  onOpenIDCard,
}) => {
  const { students, attendance, instituteSettings } = useVectora();

  const todayStr = getTodayDateString();
  const todayRecords = (attendance || []).filter((a) => a && a.date === todayStr);

  const totalStudents = (students || []).length;
  const activeStudents = (students || []).filter((s) => s && s.status === 'Active').length;
  const newAdmissions = (students || []).filter((s) => s && (s.admission_date || '') >= '2026-05-01').length;

  const presentStudentIds = new Set(
    todayRecords.filter((a) => a && a.status !== 'Absent').map((a) => a.student_id)
  );
  const presentToday = presentStudentIds.size;
  const absentToday = Math.max(0, activeStudents - presentToday);
  const attendancePercentage = activeStudents > 0 ? Math.round((presentToday / activeStudents) * 100) : 0;

  const checkInsToday = todayRecords.filter((a) => a && a.arrival_time !== null && a.arrival_time !== undefined).length;
  const checkOutsToday = todayRecords.filter((a) => a && a.departure_time !== null && a.departure_time !== undefined).length;

  const recentlyAdded = [...(students || [])].slice(0, 4);

  // Chart Data: Present vs Absent Today Donut
  const pieData = [
    { name: 'Present Today', value: presentToday, color: '#10b981' },
    { name: 'Absent Today', value: absentToday, color: '#f43f5e' },
  ];

  // Chart Data: 7-Day / Monthly Trend
  const trendData = [
    { date: 'Jul 04', present: 7, absent: 1, rate: 88 },
    { date: 'Jul 05', present: 8, absent: 0, rate: 100 },
    { date: 'Jul 06', present: 6, absent: 2, rate: 75 },
    { date: 'Jul 07', present: 8, absent: 0, rate: 100 },
    { date: 'Jul 08', present: 7, absent: 1, rate: 88 },
    { date: 'Jul 09', present: 8, absent: 0, rate: 100 },
    { date: 'Today', present: presentToday, absent: absentToday, rate: attendancePercentage },
  ];

  // Course distribution data
  const courseCounts: Record<string, number> = {};
  (students || []).forEach((s) => {
    if (!s) return;
    const courseName = String(s.course || 'General Course');
    const parts = courseName.split(' ');
    const short = parts[0] + ' ' + (parts[1] || '');
    courseCounts[short] = (courseCounts[short] || 0) + 1;
  });
  const courseBarData = Object.entries(courseCounts).map(([name, count]) => ({
    name,
    students: count,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Large Quick Actions Hub Strip */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-2xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{instituteSettings.institute_name} Command Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Smart Attendance Administration
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Automated QR card check-in, real-time arrival tracking, and cloud-synced institute reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5" />
              <span>+ Add Student</span>
            </button>

            <button
              onClick={onOpenQRScanner}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <QrCode className="w-5 h-5" />
              <span>Launch Scanner</span>
            </button>

            <button
              onClick={onOpenManualAttendance}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Manual Entry</span>
            </button>

            <button
              onClick={() => onNavigateToTab('reports')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-300" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => onNavigateToTab('settings')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all"
            >
              <Settings className="w-4 h-4 text-amber-300" />
              <span>Institute Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Students
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
            {totalStudents}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-500 font-bold">{activeStudents} active</span> in records
          </div>
        </div>

        {/* Present Today */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Present Today
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {presentToday}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Checked in today
          </div>
        </div>

        {/* Absent Today */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Absent Today
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400">
            {absentToday}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Pending arrival
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Attendance %
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {attendancePercentage}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Daily target: &ge;85%
          </div>
        </div>

        {/* Check-ins & Check-outs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today&apos;s Scans
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <div>
              <span className="text-xl font-black text-slate-900 dark:text-white">{checkInsToday}</span>
              <span className="text-[11px] text-slate-400 ml-1">In</span>
            </div>
            <div className="text-slate-300 dark:text-slate-700 font-bold">/</div>
            <div>
              <span className="text-xl font-black text-slate-900 dark:text-white">{checkOutsToday}</span>
              <span className="text-[11px] text-slate-400 ml-1">Out</span>
            </div>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Automatic time diff
          </div>
        </div>
      </div>

      {/* 3. Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Present vs Absent Today Donut Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Present vs Absent Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-4">Live attendance ratio for today</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-semibold pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-700 dark:text-slate-300">Present ({presentToday})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="text-slate-700 dark:text-slate-300">Absent ({absentToday})</span>
            </div>
          </div>
        </div>

        {/* Attendance Trend Line Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Weekly Attendance Analytics
              </h3>
              <p className="text-xs text-slate-400">Present students trend over recent sessions</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg">
              Avg: 91%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  name="Present Students"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  name="Absent Students"
                  stroke="#f43f5e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Course Distribution Bar Chart & Recently Added Students */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm lg:col-span-7">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Course-wise Student Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Number of active students enrolled across programs</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseBarData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recently Added Students & Quick Card Generator */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recently Admitted Students
                </h3>
                <p className="text-xs text-slate-400">Click student to view ID Card</p>
              </div>
              <button
                onClick={onOpenAddStudent}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>+ New</span>
              </button>
            </div>

            <div className="space-y-3">
              {recentlyAdded.map((student) => (
                <div
                  key={student.id}
                  onClick={() => onOpenIDCard(student.id)}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/70 dark:border-slate-800 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                      alt={student.full_name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {student.full_name}
                      </h4>
                      <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                        {student.student_id}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 flex items-center gap-1">
                    <span>ID Card</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Smart ID Cards</div>
                <div className="text-[11px] text-slate-500">Auto generated with custom QR code</div>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('students')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
