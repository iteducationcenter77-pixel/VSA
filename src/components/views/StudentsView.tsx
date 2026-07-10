'use client';

import React, { useState } from 'react';
import { useVectora } from '@/lib/store';
import { Student } from '@/types';
import { downloadCSV } from '@/lib/utils';
import {
  Search,
  UserPlus,
  QrCode,
  FileSpreadsheet,
  Filter,
  Eye,
  Trash2,
  Award,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';

interface StudentsViewProps {
  onOpenAddStudent: () => void;
  onOpenIDCard: (studentId: string) => void;
  searchQuery: string;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onOpenAddStudent,
  onOpenIDCard,
  searchQuery,
}) => {
  const { students, deleteStudent, attendance } = useVectora();
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);

  const courses = Array.from(new Set(students.map((s) => s.course)));

  const query = searchQuery || localSearch;

  const filteredStudents = students.filter((s) => {
    const matchesQuery =
      !query ||
      s.full_name.toLowerCase().includes(query.toLowerCase()) ||
      s.student_id.toLowerCase().includes(query.toLowerCase()) ||
      s.course.toLowerCase().includes(query.toLowerCase()) ||
      s.mobile.includes(query);

    const matchesCourse = selectedCourse === 'ALL' || s.course === selectedCourse;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

    return matchesQuery && matchesCourse && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'Full Name',
      'Gender',
      'DOB',
      'Mobile',
      'Email',
      'Course',
      'Batch',
      'Admission Date',
      'Status',
    ];
    const rows = filteredStudents.map((s) => [
      s.student_id,
      s.full_name,
      s.gender,
      s.date_of_birth,
      s.mobile,
      s.email,
      s.course,
      s.batch,
      s.admission_date,
      s.status,
    ]);
    downloadCSV('vectora_students.csv', headers, rows);
  };

  const getStudentStats = (studentId: string) => {
    const recs = attendance.filter((a) => a.student_id === studentId);
    const presentCount = recs.filter((a) => a.status !== 'Absent').length;
    const absentCount = recs.filter((a) => a.status === 'Absent').length;
    const totalHours = recs.reduce((acc, a) => acc + (a.total_hours || 0), 0);
    return {
      presentCount,
      absentCount,
      totalHours: Number(totalHours.toFixed(1)),
      rate: recs.length > 0 ? Math.round((presentCount / recs.length) * 100) : 95,
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Student Management & Smart ID Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing {filteredStudents.length} of {students.length} enrolled students
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Student</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search student name, VCI ID, or mobile..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="ALL">All Courses</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-6">Student Information</th>
                <th className="py-3.5 px-4">Enrolled Course</th>
                <th className="py-3.5 px-4">Batch Details</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Smart ID Card</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Photo + Name + ID */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                        alt={student.full_name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {student.full_name}
                        </div>
                        <div className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-xs mt-0.5">
                          {student.student_id}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{student.mobile}</div>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {student.course}
                  </td>

                  {/* Batch */}
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                    {student.batch}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        student.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  {/* Smart ID Card Trigger */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onOpenIDCard(student.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 font-semibold transition-all border border-indigo-200 dark:border-indigo-800/60"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>ID Card</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedStudentForProfile(student)}
                        title="View Full Profile"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete student ${student.full_name}?`)) {
                            deleteStudent(student.id);
                          }
                        }}
                        title="Delete Student"
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT PROFILE MODAL DRAWER */}
      {selectedStudentForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentForProfile.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                  alt={selectedStudentForProfile.full_name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedStudentForProfile.full_name}
                  </h3>
                  <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {selectedStudentForProfile.student_id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForProfile(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats strip */}
              {(() => {
                const stats = getStudentStats(selectedStudentForProfile.student_id);
                return (
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                      <div className="text-xs text-slate-400 font-semibold">Attendance</div>
                      <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                        {stats.rate}%
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                      <div className="text-xs text-slate-400 font-semibold">Present Days</div>
                      <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        {stats.presentCount}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                      <div className="text-xs text-slate-400 font-semibold">Absent</div>
                      <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                        {stats.absentCount}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                      <div className="text-xs text-slate-400 font-semibold">Total Hours</div>
                      <div className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                        {stats.totalHours}h
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Profile details grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="text-slate-400">Course Program:</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedStudentForProfile.course}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-slate-400">Batch Timing:</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedStudentForProfile.batch}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-slate-400">Mobile Number:</div>
                  <div className="font-bold text-slate-900 dark:text-white font-mono">
                    {selectedStudentForProfile.mobile}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-slate-400">Email Address:</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedStudentForProfile.email || 'N/A'}
                  </div>
                </div>
              </div>

              {/* ID Card Action Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Official Vectora Smart ID Card
                  </h4>
                  <p className="text-xs text-slate-500">Includes secure QR verification token</p>
                </div>
                <button
                  onClick={() => {
                    const id = selectedStudentForProfile.id;
                    setSelectedStudentForProfile(null);
                    onOpenIDCard(id);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  Generate ID Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
