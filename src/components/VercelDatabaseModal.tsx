'use client';

import React, { useState } from 'react';
import { useVectora } from '@/lib/store';
import {
  Database,
  Cloud,
  CheckCircle2,
  UploadCloud,
  DownloadCloud,
  X,
  AlertCircle,
  FileCode,
  Server,
  RefreshCw,
} from 'lucide-react';

interface VercelDatabaseModalProps {
  onClose: () => void;
}

export function VercelDatabaseModal({ onClose }: VercelDatabaseModalProps) {
  const { students, attendance, instituteSettings, addToast } = useVectora();
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [providerUsed, setProviderUsed] = useState<string | null>(null);

  // Sync to Vercel Server API (/api/db)
  const handleSyncToVercelCloud = async () => {
    setSyncing(true);
    setSyncStatus('Pushing students and attendance records to Vercel Cloud API...');

    try {
      // Sync Students
      const resStudents = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          table: 'students',
          records: students,
        }),
      });
      const dataStudents = await resStudents.json();

      // Sync Attendance
      const resAttendance = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          table: 'attendance',
          records: attendance,
        }),
      });
      const dataAttendance = await resAttendance.json();

      if (dataStudents.success && dataAttendance.success) {
        setProviderUsed(dataStudents.provider || 'vercel_postgres');
        setSyncStatus(
          `Cloud Sync Complete! Provider: ${
            dataStudents.provider === 'vercel_postgres'
              ? 'Vercel Postgres SQL'
              : dataStudents.provider === 'supabase'
              ? 'Supabase Cloud Postgres'
              : 'Vercel Server Ready (Add POSTGRES_URL in Vercel settings for SQL persistence)'
          }`
        );
        addToast(
          'Cloud Sync Successful',
          `Synchronized ${students.length} students & ${attendance.length} attendance records with Vercel API.`,
          'success'
        );
      } else {
        setSyncStatus(`Sync issue: ${dataStudents.error || dataAttendance.error}`);
        addToast('Sync Issue', 'Check console or Vercel database settings.', 'error');
      }
    } catch (err: unknown) {
      setSyncStatus(`Network error connecting to Vercel API: ${String(err)}`);
      addToast('Sync Error', 'Failed to reach /api/db server route.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Download Full Database Backup Snapshot
  const handleDownloadBackup = () => {
    const fullBackup = {
      exported_at: new Date().toISOString(),
      platform: 'VSA Vectora Smart Attendance',
      institute_settings: instituteSettings,
      students: students,
      attendance_records: attendance,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchorElement = document.createElement('a');
    downloadAnchorElement.setAttribute('href', dataStr);
    downloadAnchorElement.setAttribute(
      'download',
      `VSA_${instituteSettings.institute_code || 'VCI'}_Database_Backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchorElement);
    downloadAnchorElement.click();
    downloadAnchorElement.remove();

    addToast('Database Exported', 'Full JSON Database snapshot downloaded to your device.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Vercel Cloud Database &amp; Storage Hub
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sync data to your Vercel Postgres / Supabase Cloud or download offline backup
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status badge */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
            <Cloud className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                Vercel Hosting Status: Live Server API Active (`/api/db`)
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your system is connected to universal Vercel API routes. To enable persistent cloud Postgres storage on Vercel, link a <strong>Vercel Postgres</strong> or <strong>Supabase</strong> database in your Vercel Dashboard Project Settings.
              </p>
            </div>
          </div>

          {/* Sync Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{students.length}</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Student Records Ready to Sync
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{attendance.length}</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Attendance Scans Logged
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSyncToVercelCloud}
              disabled={syncing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Synchronizing with Vercel Server...' : 'Push & Sync All Data to Vercel Cloud Database'}</span>
            </button>

            <button
              onClick={handleDownloadBackup}
              className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <DownloadCloud className="w-4 h-4 text-cyan-500" />
              <span>Download Complete Offline JSON Database Backup</span>
            </button>
          </div>

          {syncStatus && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* SQL Instructions box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Vercel Dashboard Quick Setup Guide
            </div>
            <div className="text-slate-300">
              1. In Vercel Project Dashboard (`vsa-jgu7egszb...`), go to <strong>Storage</strong> → <strong>Connect Postgres / Supabase</strong>.<br />
              2. Vercel automatically populates <code>POSTGRES_URL</code> or <code>NEXT_PUBLIC_SUPABASE_URL</code>.<br />
              3. Click <strong>Push &amp; Sync All Data</strong> above to instantly populate cloud tables!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
