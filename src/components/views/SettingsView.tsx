'use client';

import React, { useState } from 'react';
import { useVectora } from '@/lib/store';
import {
  Settings,
  Building2,
  Palette,
  Database,
  Save,
  Download,
  Copy,
  ShieldCheck,
  CheckCircle2,
  CloudLightning,
  Info,
} from 'lucide-react';

const SUPABASE_SCHEMA_SQL = `-- Complete Vectora Smart Attendance Supabase SQL Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  mobile TEXT NOT NULL,
  course TEXT NOT NULL,
  batch TEXT NOT NULL,
  admission_date DATE DEFAULT CURRENT_DATE,
  qr_code_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  arrival_time TIME,
  departure_time TIME,
  total_hours NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'Present',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

export const SettingsView: React.FC = () => {
  const { instituteSettings, updateInstituteSettings, students, attendance, addToast } = useVectora();

  const [formData, setFormData] = useState({ ...instituteSettings });
  const [copiedSql, setCopiedSql] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstituteSettings(formData);
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

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    addToast('SQL Copied', 'Paste this script in your Supabase SQL Editor.', 'info');
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
            Manage institutional identity, ID card branding, colors, and Vercel cloud deployment schema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBackupJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Backup Database JSON</span>
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

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Institute Logo Image URL
                </label>
                <input
                  type="text"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
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

          {/* Vercel & Supabase Cloud Environment Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <CloudLightning className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Vercel Hosting & Supabase Environment Status
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Vercel Ready
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                <Info className="w-4 h-4 shrink-0" />
                <span>Zero-Config Vercel Environment Variables</span>
              </div>
              <p className="leading-relaxed">
                When deployed on Vercel, simply configure your Supabase keys directly in the Vercel Project Environment Variables:
              </p>
              <div className="font-mono text-[11px] bg-slate-900 text-slate-200 p-2.5 rounded-xl space-y-1">
                <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
              </div>
              <p className="text-[11px] text-slate-500">
                The application automatically detects Vercel environment variables and synchronizes student and attendance records in real-time.
              </p>
            </div>

            {/* SQL Script snippet copy box */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Supabase Database Setup SQL Schema
                </span>
                <button
                  onClick={handleCopySQL}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 text-slate-300 text-[10px] font-mono overflow-x-auto max-h-36">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          </div>
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
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-[10px]"
                  >
                    {formData.institute_code}
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
                  <span>Authorized Signature</span>
                  <span className="font-bold text-indigo-600">{formData.institute_code} SMART CARD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
