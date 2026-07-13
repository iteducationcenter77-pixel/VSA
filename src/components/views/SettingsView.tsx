'use client';

import React, { useState } from 'react';
import { useVectora } from '@/lib/store';
import { formatImageUrl } from '@/lib/utils';
import {
  Settings,
  Building2,
  Palette,
  Save,
  Download,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Copy,
  Database,
} from 'lucide-react';

const SUPABASE_SQL = `-- Run this once in your Supabase SQL Editor to store Students & Attendance:

CREATE TABLE IF NOT EXISTS vsa_students (
  id TEXT PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  father_name TEXT,
  mother_name TEXT,
  gender TEXT,
  date_of_birth TEXT,
  mobile TEXT,
  email TEXT,
  address TEXT,
  course TEXT,
  batch TEXT,
  admission_date TEXT,
  course_start_date TEXT,
  course_end_date TEXT,
  emergency_contact TEXT,
  blood_group TEXT,
  status TEXT,
  remarks TEXT,
  qr_code_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vsa_attendance (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  date TEXT NOT NULL,
  arrival_time TEXT,
  departure_time TEXT,
  total_hours NUMERIC DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  status TEXT,
  recorded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

export const SettingsView: React.FC = () => {
  const { instituteSettings, updateInstituteSettings, students, attendance, addToast, clearAllData } = useVectora();

  const [formData, setFormData] = useState({ ...instituteSettings });
  const [copiedSQL, setCopiedSQL] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, [fieldName]: dataUrl }));
        addToast(
          'Image Attached',
          `${fieldName.replace('_', ' ')} image converted successfully. Click Save Configuration to apply.`,
          'success'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstituteSettings(formData);
    addToast('Configuration Saved', 'All institute branding, logo, signature, and seal applied to ID cards.', 'success');
  };

  const handleBackupJSON = () => {
    const backupData = {
      instituteSettings: formData,
      students,
      attendance,
      backupTimestamp: new Date().toISOString(),
      version: '2.0.0',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vectora_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Backup Complete', 'All students and attendance records exported as JSON.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Institute & Branding Settings</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customize ID card branding, institutional logo, authorized signatory, official seal stamp, and color theme
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete all demo students and attendance records to start completely fresh?')) {
                clearAllData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all border border-rose-500/30"
          >
            <span>Wipe All Demo Students &amp; Logs</span>
          </button>

          <button
            type="button"
            onClick={handleBackupJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Backup Database JSON</span>
          </button>
        </div>
      </div>

      {/* Supabase SQL Verification Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/30 to-slate-900 border border-indigo-500/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Supabase Full Database SQL Schema (Students + Attendance)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                If attendance records don&apos;t save, run this SQL query once in your Supabase SQL Editor to create both tables.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(SUPABASE_SQL);
              setCopiedSQL(true);
              addToast('SQL Copied', 'Paste this query into your Supabase SQL Editor and run it.', 'success');
              setTimeout(() => setCopiedSQL(false), 3000);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
          >
            {copiedSQL ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Copied SQL!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy SQL Command</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Settings Form & Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Form */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Institute Branding & Contact Information
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Institute Name *
                </label>
                <input
                  type="text"
                  name="institute_name"
                  value={formData.institute_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Institute Code (ID Prefix) *
                </label>
                <input
                  type="text"
                  name="institute_code"
                  value={formData.institute_code}
                  onChange={handleChange}
                  placeholder="VCI"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Principal / Director Name
                </label>
                <input
                  type="text"
                  name="principal_name"
                  value={formData.principal_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* 1. Institute Logo Upload */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Institute Logo (Google Drive Link or Direct File Upload)
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo_url')}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="Paste Google Drive shareable link or image URL..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
                <p className="text-[10px] text-slate-500">
                  Google Drive links are automatically converted to direct images for your ID card header.
                </p>
              </div>

              {/* 2. Authorized Signature Upload */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Authorized Signatory Signature Image
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Signature PNG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'authorized_signature_url')}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  name="authorized_signature_url"
                  value={formData.authorized_signature_url || ''}
                  onChange={handleChange}
                  placeholder="Transparent PNG signature image URL or upload directly..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* 3. Official Seal / Round Stamp Upload */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Official Round Seal / Stamp Image
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Seal/Stamp Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'official_seal_url')}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  name="official_seal_url"
                  value={formData.official_seal_url || formData.institute_stamp_url || ''}
                  onChange={handleChange}
                  placeholder="Round official institute stamp/seal URL or upload directly..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  State & PIN Code
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    name="pin_code"
                    value={formData.pin_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  ID Card & Brand Color Theme
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Primary Accent Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Secondary Accent Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Credentials */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Custom Admin Portal Login Credentials (Supabase)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Admin Login Email / ID
                  </label>
                  <input
                    type="text"
                    name="admin_username"
                    value={formData.admin_username || ''}
                    onChange={handleChange}
                    placeholder="admin@vectora.edu"
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Admin Login Password
                  </label>
                  <input
                    type="password"
                    name="admin_password"
                    value={formData.admin_password || ''}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Institute Configuration</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 cols: Live Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Live ID Card Preview</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400">Real-Time Theme</span>
            </div>

            {/* Miniature ID Card Preview box */}
            <div className="flex justify-center py-4 bg-slate-100 dark:bg-slate-950 rounded-2xl">
              <div
                style={{ borderColor: formData.primary_color }}
                className="w-64 rounded-2xl bg-white border-2 shadow-xl overflow-hidden p-4 text-slate-800 flex flex-col justify-between min-h-[360px]"
              >
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                  <div
                    style={{ backgroundColor: formData.primary_color }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-[10px] shrink-0 overflow-hidden"
                  >
                    {formData.logo_url ? (
                      <img
                        src={formatImageUrl(formData.logo_url)}
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      formData.institute_code
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-black uppercase tracking-tight truncate">
                      {formData.institute_name}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">{formData.city}</div>
                  </div>
                </div>

                <div className="flex flex-col items-center my-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
                    alt="Sample Student"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-500 shadow-sm"
                  />
                  <div className="font-bold text-xs text-slate-900 mt-2">Aarav Mehta</div>
                  <div
                    style={{ backgroundColor: formData.primary_color }}
                    className="text-[9px] font-mono font-bold text-white px-2 py-0.5 rounded-full mt-0.5"
                  >
                    VCI-07-26-0001
                  </div>
                </div>

                <div className="space-y-1 text-[9px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Course:</span>
                    <span className="font-bold">Full Stack Dev</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Principal:</span>
                    <span className="font-semibold">{formData.principal_name}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400">
                  <span>Authorized Sign</span>
                  <div className="relative flex flex-col items-end">
                    {(formData.official_seal_url || formData.institute_stamp_url) && (
                      <img
                        src={formatImageUrl(formData.official_seal_url || formData.institute_stamp_url)}
                        alt="Seal"
                        className="absolute -top-3 -right-1 w-9 h-9 object-contain opacity-80 pointer-events-none"
                      />
                    )}
                    {formData.authorized_signature_url ? (
                      <img
                        src={formatImageUrl(formData.authorized_signature_url)}
                        alt="Sign"
                        className="h-5 object-contain relative z-10"
                      />
                    ) : (
                      <span className="font-bold text-indigo-600 relative z-10">
                        {formData.institute_code} SMART CARD
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
