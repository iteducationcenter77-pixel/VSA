'use client';

import React, { useState } from 'react';
import { useVectora } from '@/lib/store';
import { getTodayDateString, downloadCSV } from '@/lib/utils';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  Calendar,
  Users,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { attendance, students, instituteSettings, addToast } = useVectora();

  const todayStr = getTodayDateString();

  const [datePreset, setDatePreset] = useState<'today' | 'yesterday' | 'all'>('today');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const courses = Array.from(new Set(students.map((s) => s.course)));
  const batches = Array.from(new Set(students.map((s) => s.batch)));

  const filteredRecords = attendance.filter((rec) => {
    // Filter Date Preset
    if (datePreset === 'today' && rec.date !== todayStr) return false;
    if (datePreset === 'yesterday' && rec.date !== '2026-07-09') return false;

    // Filter Course / Batch
    const stu = students.find((s) => s.student_id === rec.student_id);
    if (courseFilter !== 'ALL' && stu?.course !== courseFilter) return false;
    if (batchFilter !== 'ALL' && stu?.batch !== batchFilter) return false;

    // Filter Status
    if (statusFilter !== 'ALL' && rec.status !== statusFilter) return false;

    return true;
  });

  const totalHoursLogged = filteredRecords
    .reduce((acc, r) => acc + (r.total_hours || 0), 0)
    .toFixed(1);

  const handleExportCSV = () => {
    const headers = [
      'Record ID',
      'Student ID',
      'Student Name',
      'Attendance Date',
      'Arrival Time',
      'Departure Time',
      'Total Hours',
      'Status',
      'Recorded By',
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.student_id,
      r.student_name,
      r.date,
      r.arrival_time || 'N/A',
      r.departure_time || 'N/A',
      r.total_hours,
      r.status,
      r.recorded_by,
    ]);
    downloadCSV(`Attendance_Report_${datePreset}.csv`, headers, rows);
    addToast('Report Exported', 'CSV file downloaded successfully.', 'success');
  };

  const handlePrintReport = () => {
    window.print();
    addToast('Print Triggered', 'Opening browser print dialogue.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            <span>Attendance Analytics & Export Engine</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Generate audit-ready institute reports with multi-criteria filtering
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV / Excel</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Date Presets */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Period:
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { id: 'today', label: "Today's Attendance" },
                { id: 'yesterday', label: "Yesterday's Attendance" },
                { id: 'all', label: 'All History' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDatePreset(item.id as 'today' | 'yesterday' | 'all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    datePreset === item.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Courses</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Batches</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Status</option>
              <option value="Present">Present</option>
              <option value="Late Entry">Late Entry</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Summary strip for filtered report */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Filtered Records</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {filteredRecords.length}
            </div>
          </div>
          <Users className="w-8 h-8 text-indigo-500 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Instructional Hours</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {totalHoursLogged} hrs
            </div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Late Arrival Count</div>
            <div className="text-2xl font-black text-amber-500 mt-1">
              {filteredRecords.filter((r) => r.status === 'Late Entry').length}
            </div>
          </div>
          <FileText className="w-8 h-8 text-amber-500 opacity-80" />
        </div>
      </div>

      {/* Report Table */}
      <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm print:border-none print:shadow-none">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between print:block">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {instituteSettings.institute_name} — Official Attendance Log
            </h4>
            <p className="text-xs text-slate-500">
              Period: {datePreset.toUpperCase()} | Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            {instituteSettings.institute_code} AUDIT REF
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Arrival</th>
                <th className="py-3 px-4">Departure</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-6 font-mono font-semibold text-slate-600 dark:text-slate-400">
                    {rec.date}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {rec.student_id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {rec.student_name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                    {rec.arrival_time || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                    {rec.departure_time || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {rec.total_hours}h
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rec.status}</span>
                  </td>
                  <td className="py-3.5 px-6 text-right text-slate-400">
                    {rec.recorded_by}
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
