'use client';

import React, { useState, useRef } from 'react';
import { useVectora } from '@/lib/store';
import { Student } from '@/types';
import {
  X,
  User,
  Camera,
  CheckCircle2,
  RefreshCw,
  Crop,
} from 'lucide-react';

interface StudentEditModalProps {
  student: Student;
  onClose: () => void;
}

export function StudentEditModal({ student, onClose }: StudentEditModalProps) {
  const { updateStudent, addToast } = useVectora();

  const [formData, setFormData] = useState({
    full_name: student.full_name,
    course: student.course,
    batch: student.batch,
    mobile: student.mobile,
    email: student.email,
    admission_date: student.admission_date,
    status: student.status,
    photo_url: student.photo_url || '',
  });

  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-compress & crop image to ID Card portrait ratio (300x380, JPEG 0.9 quality)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas with ID Card Portrait dimensions (300 x 380 px - 4:5 aspect ratio)
        const canvas = document.createElement('canvas');
        const targetWidth = 300;
        const targetHeight = 380;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setCompressing(false);
          return;
        }

        // Center crop calculation to preserve aspect ratio perfectly
        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;
        let drawWidth = targetWidth;
        let drawHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > targetAspect) {
          drawHeight = targetHeight;
          drawWidth = img.width * (targetHeight / img.height);
          offsetX = (targetWidth - drawWidth) / 2;
        } else {
          drawWidth = targetWidth;
          drawHeight = img.height * (targetWidth / img.width);
          offsetY = (targetHeight - drawHeight) / 2;
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setFormData((prev) => ({ ...prev, photo_url: compressedDataUrl }));
        setCompressing(false);
        addToast('Photo Compressed & Cropped', 'Optimized to ID Card portrait standard (300x380 px).', 'success');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      addToast('Missing Name', 'Please provide student full name.', 'error');
      return;
    }

    updateStudent(student.id, formData);
    addToast('Student Updated!', `Updated profile information for ${formData.full_name}.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Student Profile ({student.student_id})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update information and ID card portrait
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Photo Compression & Crop Stage */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="relative w-24 h-28 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-indigo-500/50 shrink-0 flex items-center justify-center">
              {formData.photo_url ? (
                <img src={formData.photo_url} alt="Portrait" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
              {compressing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                <Crop className="w-3.5 h-3.5 text-indigo-500" />
                <span>Auto-Compress &amp; Crop ID Card Photo</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload any image. It will automatically crop and compress to a clean 300x380 px ID card standard without losing facial detail.
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload &amp; Auto-Crop Photo</span>
              </button>
            </div>
          </div>

          {/* Student Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Batch Timing
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Enrollment / Admission Date
              </label>
              <input
                type="date"
                value={formData.admission_date}
                onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Completed' })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active Student</option>
                <option value="Completed">Completed Course</option>
                <option value="Inactive">Inactive / Alumni</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30"
            >
              Save Student Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
