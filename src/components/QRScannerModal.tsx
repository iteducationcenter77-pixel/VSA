'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useVectora } from '@/lib/store';
import { Student } from '@/types';
import {
  X,
  Camera,
  CheckCircle2,
  Sparkles,
  QrCode,
  Clock,
  UserCheck,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerModalProps {
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose }) => {
  const { students, recordQRScan } = useVectora();
  const [activeTab, setActiveTab] = useState<'camera' | 'simulator'>('simulator');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    type: 'checkin' | 'checkout';
    student?: Student;
    message: string;
  } | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Initialize camera when activeTab === 'camera'
  useEffect(() => {
    let isMounted = true;
    if (activeTab === 'camera') {
      const startCamera = async () => {
        try {
          const html5QrCode = new Html5Qrcode('qr-reader-viewport');
          scannerRef.current = html5QrCode;
          setIsScanning(true);
          setCameraError(null);

          await html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              if (isMounted) {
                handleScanToken(decodedText);
              }
            },
            () => {
              // Ignore frame decode failures
            }
          );
        } catch (err: unknown) {
          if (isMounted) {
            setCameraError('Camera access not granted or unavailable. Use Demo Simulator mode below.');
            setIsScanning(false);
          }
        }
      };

      startCamera();
    } else {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    }

    return () => {
      isMounted = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [activeTab]);

  const handleScanToken = (token: string) => {
    const res = recordQRScan(token);
    setScanResult({
      success: res.success,
      type: res.type,
      student: res.student,
      message: res.message,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live QR Attendance Terminal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan student ID card QR code for instant check-in / check-out
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

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Interactive Simulator Mode (Fast Demo)</span>
          </button>

          <button
            onClick={() => {
              setScanResult(null);
              setActiveTab('camera');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'camera'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Webcam Scan Mode</span>
          </button>
        </div>

        {/* Scan Result Overlay Box */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-6 mt-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-600/15 via-emerald-500/10 to-cyan-500/15 border-2 border-emerald-500/40 dark:border-emerald-500/50 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-white">
                      {scanResult.type === 'checkin' ? 'CHECK-IN RECORDED' : 'CHECK-OUT RECORDED'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {scanResult.student && (
                    <div className="mt-2.5 flex items-center gap-3">
                      <img
                        src={scanResult.student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                        alt={scanResult.student.full_name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                      />
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {scanResult.student.full_name}
                        </h4>
                        <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                          {scanResult.student.student_id} • {scanResult.student.course}
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {scanResult.message}
                  </p>
                </div>

                <button
                  onClick={() => setScanResult(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'simulator' ? (
            <div>
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Select any active student to simulate instant QR card scan:
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleScanToken(student.qr_code_token)}
                    className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 transition-all text-left shadow-sm"
                  >
                    <img
                      src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                      alt={student.full_name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {student.full_name}
                      </h5>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                        {student.student_id}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {student.course}
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div
                id="qr-reader-viewport"
                className="w-full max-w-sm overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-black min-h-[280px] flex items-center justify-center"
              />

              {cameraError && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-500 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              <p className="mt-3 text-xs text-slate-500 text-center">
                Position the student ID QR code inside the viewfinder above.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span>Smart detection calculates check-in vs check-out automatically</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold hover:opacity-90 transition-opacity"
          >
            Done Scanning
          </button>
        </div>
      </motion.div>
    </div>
  );
};
