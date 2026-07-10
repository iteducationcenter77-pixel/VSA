'use client';

import React, { useState } from 'react';
import { useVectora } from '@/lib/store';
import { getTodayDateString } from '@/lib/utils';
import {
  CalendarCheck2,
  QrCode,
  UserCheck,
  Search,
  Filter,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AttendanceViewProps {
  onOpenQRScanner: () => void;
  onOpenManualAttendance: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  onOpenQRScanner,
  onOpenManualAttendance,
}) => {
  const { attendance, students, deleteAttendanceRecord } = useVectora();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = getTodayDateString();
  const todayRecords = attendance.filter((a) => a.date === todayStr);

  const filteredRecords = todayRecords.filter((rec) => {
    const matchesSearch =
      rec.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.student_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStudentPhoto = (studentId: string) => {
    const found = students.find((s) => s.student_id === studentId);
    return found?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
  };

  const getStudentCourse = (studentId: string) => {
    const found = students.find((s) => s.student_id === studentId);
    return found?.course || 'Computer Science';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Live Today&apos;s Attendance Terminal</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {todayStr}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time check-in and check-out logs across all institute courses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenManualAttendance}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
          >
            <UserCheck className="w-4 h-4 text-indigo-500" />
            <span>Manual Entry</span>
          </button>

          <button
            onClick={onOpenQRScanner}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Open QR Scanner</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-400">Checked In Today</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {todayRecords.length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-400">Present Status</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {todayRecords.filter((a) => a.status === 'Present').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-400">Late Entries</div>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {todayRecords.filter((a) => a.status === 'Late Entry').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-400">Checked Out</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {todayRecords.filter((a) => a.departure_time !== null).length}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter today's logs by Student Name or VCI ID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['ALL', 'Present', 'Late Entry', 'Early Exit', 'Half Day'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Status' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-6">Student details</th>
                <th className="py-3.5 px-4">Arrival (Check-In)</th>
                <th className="py-3.5 px-4">Departure (Check-Out)</th>
                <th className="py-3.5 px-4">Total Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-6 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Student Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={getStudentPhoto(record.student_id)}
                        alt={record.student_name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {record.student_name}
                        </div>
                        <div className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                          {record.student_id} • {getStudentCourse(record.student_id)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Arrival */}
                  <td className="py-4 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {record.arrival_time || '—'}
                  </td>

                  {/* Departure */}
                  <td className="py-4 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {record.departure_time || (
                      <span className="text-slate-400 font-sans italic">In Campus</span>
                    )}
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {record.total_hours > 0 ? `${record.total_hours} Hours` : 'In Progress'}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        record.status === 'Present'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : record.status === 'Late Entry'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>

                  {/* Recorded By */}
                  <td className="py-4 px-4 text-slate-500">
                    {record.recorded_by}
                  </td>

                  {/* Delete */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => deleteAttendanceRecord(record.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
