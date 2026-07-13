'use client';

import React, { useState } from 'react';
import { useVectora } from '@/lib/store';
import { getTodayDateString, formatImageUrl } from '@/lib/utils';
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
  UserX,
  PlusCircle,
} from 'lucide-react';

interface AttendanceViewProps {
  onOpenQRScanner: () => void;
  onOpenManualAttendance: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  onOpenQRScanner,
  onOpenManualAttendance,
}) => {
  const { attendance, students, deleteAttendanceRecord, recordManualAttendance } = useVectora();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'present' | 'absent'>('present');

  const todayStr = getTodayDateString();
  const todayRecords = (attendance || []).filter((a) => a && a.date === todayStr);

  const presentStudentIds = new Set(todayRecords.map((a) => a.student_id));
  const activeStudents = (students || []).filter((s) => s && s.status === 'Active');
  const absentStudentsToday = activeStudents.filter((s) => !presentStudentIds.has(s.student_id));

  const filteredRecords = todayRecords.filter((rec) => {
    if (!rec) return false;
    const name = String(rec.student_name || '');
    const id = String(rec.student_id || '');
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAbsent = absentStudentsToday.filter((student) => {
    const name = String(student.full_name || '');
    const id = String(student.student_id || '');
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStudentPhoto = (studentId: string) => {
    const found = students.find((s) => s.student_id === studentId);
    return formatImageUrl(found?.photo_url) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
  };

  const getStudentCourse = (studentId: string) => {
    const found = students.find((s) => s.student_id === studentId);
    return found?.course || 'General Course';
  };

  const handleQuickMarkPresent = (student: any) => {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    recordManualAttendance(student.student_id, todayStr, nowTime, null);
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
            Real-time check-in, check-out, and absent tracking across all institute courses
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-400">Checked In Today</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {presentStudentIds.size}
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
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">Absent Today</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {absentStudentsToday.length}
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Checked In Logs vs Absent Today */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('present')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'present'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Present &amp; Check-In Logs ({todayRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('absent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'absent'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>Absent Students Today ({absentStudentsToday.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeSubTab === 'present'
                ? "Filter today's logs by Student Name or VCI ID..."
                : 'Search absent students by Name or ID...'
            }
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {activeSubTab === 'present' && (
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
        )}
      </div>

      {/* TAB 1: PRESENT / CHECK-IN LOGS */}
      {activeSubTab === 'present' && (
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
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No attendance logs matching your filters today.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
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
                      <td className="py-4 px-4 text-slate-500">{record.recorded_by}</td>

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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ABSENT STUDENTS TODAY */}
      {activeSubTab === 'absent' && (
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Student details</th>
                  <th className="py-3.5 px-4">Course &amp; Batch</th>
                  <th className="py-3.5 px-4">Mobile Number</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-6 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredAbsent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-emerald-600 font-bold">
                      🎉 All active students are marked present today! Zero absentees.
                    </td>
                  </tr>
                ) : (
                  filteredAbsent.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={formatImageUrl(student.photo_url) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                            alt={student.full_name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                              {student.full_name}
                            </div>
                            <div className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                              {student.student_id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Course / Batch */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {student.course}
                        </div>
                        <div className="text-[10px] text-slate-400">{student.batch}</div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {student.mobile}
                      </td>

                      {/* Absent badge */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          Absent Today
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleQuickMarkPresent(student)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Mark Present</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
