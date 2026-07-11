'use client';

import React, { useState } from 'react';
import { useVectora } from '@/lib/store';
import { generateNextStudentID, getTodayDateString } from '@/lib/utils';
import { X, UserPlus, Sparkles, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface StudentRegistrationModalProps {
  onClose: () => void;
  onOpenIDCard: (studentId: string) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
];

const COURSES = [
  'Full Stack Web Engineering',
  'AI & Data Science Professional',
  'Cyber Security & Ethical Hacking',
  'Cloud Computing & AWS DevOps',
  'UI/UX & Interactive Product Design',
  'Python Advanced & Microservices',
];

const BATCHES = [
  'Morning Batch (09:00 AM - 01:00 PM)',
  'Afternoon Batch (02:00 PM - 06:00 PM)',
  'Evening Batch (06:00 PM - 09:00 PM)',
  'Weekend Intensive (10:00 AM - 04:00 PM)',
];

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  onClose,
  onOpenIDCard,
}) => {
  const { students, addStudent, instituteSettings } = useVectora();

  const autoId = generateNextStudentID(students, instituteSettings.institute_code);

  const uniqueCourses = Array.from(
    new Set([...students.map((s) => s.course).filter(Boolean), ...COURSES])
  );
  const uniqueBatches = Array.from(
    new Set([...students.map((s) => s.batch).filter(Boolean), ...BATCHES])
  );

  const [formData, setFormData] = useState({
    student_id: autoId,
    full_name: '',
    photo_url: AVATAR_PRESETS[0],
    father_name: '',
    mother_name: '',
    gender: 'Male' as const,
    date_of_birth: '2004-05-15',
    mobile: '',
    email: '',
    address: '',
    course: '',
    batch: '',
    admission_date: getTodayDateString(),
    course_start_date: getTodayDateString(),
    course_end_date: '2026-12-31',
    emergency_contact: '',
    blood_group: 'B+',
    status: 'Active' as const,
    remarks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.mobile) return;
    const added = addStudent(formData);
    onClose();
    onOpenIDCard(added.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Student Admission Form</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                  ID: {autoId}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register new student and automatically generate unique QR code & Smart ID Card
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Photograph & Auto ID */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5">
            <img
              src={formData.photo_url}
              alt="Avatar"
              className="w-20 h-24 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Student Photograph (Upload Photo or Select Preset)
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 inline-flex items-center gap-1.5 transition-all">
                  <span>📷 Upload &amp; Auto-Crop Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement('canvas');
                          canvas.width = 300;
                          canvas.height = 380;
                          const ctx = canvas.getContext('2d');
                          if (!ctx) return;
                          const imgAspect = img.width / img.height;
                          const targetAspect = 300 / 380;
                          let drawW = 300, drawH = 380, offX = 0, offY = 0;
                          if (imgAspect > targetAspect) {
                            drawH = 380;
                            drawW = img.width * (380 / img.height);
                            offX = (300 - drawW) / 2;
                          } else {
                            drawW = 300;
                            drawH = img.height * (300 / img.width);
                            offY = (380 - drawH) / 2;
                          }
                          ctx.fillStyle = '#ffffff';
                          ctx.fillRect(0, 0, 300, 380);
                          ctx.drawImage(img, offX, offY, drawW, drawH);
                          setFormData((prev) => ({ ...prev, photo_url: canvas.toDataURL('image/jpeg', 0.9) }));
                        };
                        img.src = event.target?.result as string;
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                <span className="text-[11px] text-slate-500">Optimizes &amp; fits ID Card 4:5 portrait aspect</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {AVATAR_PRESETS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, photo_url: url }))}
                    className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all ${
                      formData.photo_url === url
                        ? 'border-indigo-600 scale-110 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Personal Details Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Siddharth Rao"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Father&apos;s Name
                </label>
                <input
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  placeholder="Father's Full Name"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Mother&apos;s Name
                </label>
                <input
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  placeholder="Mother's Full Name"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Address */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@vectora.edu"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  placeholder="Parent / Guardian mobile"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full street address & area"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Course & Academic Schedule */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Course & Academic Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Enrolled Course (Type manually or choose recommendation) *
                </label>
                <input
                  type="text"
                  name="course"
                  required
                  list="course-suggestions"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Web Engineering"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <datalist id="course-suggestions">
                  {uniqueCourses.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Batch Name / Timing (Type manually or choose recommendation) *
                </label>
                <input
                  type="text"
                  name="batch"
                  required
                  list="batch-suggestions"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="e.g. Morning Batch (09:00 AM - 01:00 PM)"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <datalist id="batch-suggestions">
                  {uniqueBatches.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    name="admission_date"
                    value={formData.admission_date}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Course Start Date
                  </label>
                  <input
                    type="date"
                    name="course_start_date"
                    value={formData.course_start_date}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Course End Date
                  </label>
                  <input
                    type="date"
                    name="course_end_date"
                    value={formData.course_end_date}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Register Student & Generate ID Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
