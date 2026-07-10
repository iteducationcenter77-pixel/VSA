'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useVectora } from '@/lib/store';
import { Student } from '@/types';
import {
  X,
  Camera,
  CheckCircle2,
  QrCode,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerModalProps {
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose }) => {
  const { recordQRScan } = useVectora();
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    type: 'checkin' | 'checkout';
    student?: Student;
    message: string;
  } | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const html5QrCode = new Html5Qrcode('qr-reader-viewport');
        scannerRef.current = html5QrCode;
        setCameraError(null);

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 260, height: 260 },
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
          setCameraError(
            'Camera access permission required. Please grant camera permissions on your mobile or PC browser.'
          );
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

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
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mobile / Camera QR Scanner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Point your camera directly at the Student ID Card QR Code
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

        {/* Scan Result Notification Overlay */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-600/15 via-emerald-500/10 to-cyan-500/15 border-2 border-emerald-500/40 dark:border-emerald-500/50 shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md shrink-0">
                  <CheckCircle2 className="w-6 h-6 animate-bounce" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                      {scanResult.type === 'checkin' ? 'CHECK-IN RECORDED' : 'CHECK-OUT RECORDED'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {scanResult.student && (
                    <div className="mt-2 flex items-center gap-2.5">
                      <img
                        src={
                          scanResult.student.photo_url ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
                        }
                        alt={scanResult.student.full_name}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                      />
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {scanResult.student.full_name}
                        </h4>
                        <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                          {scanResult.student.student_id} • {scanResult.student.course}
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="mt-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
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

        {/* Viewfinder Content */}
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[320px] rounded-2xl overflow-hidden border-2 border-indigo-500/50 bg-black shadow-inner">
            <div
              id="qr-reader-viewport"
              className="w-full min-h-[300px] flex items-center justify-center"
            />
          </div>

          {cameraError && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-500 text-xs text-center">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-indigo-500" />
            <span>Position the QR code centered inside the viewfinder box</span>
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span>Automatic audio beep upon scan</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold hover:opacity-90 transition-opacity"
          >
            Close Scanner
          </button>
        </div>
      </motion.div>
    </div>
  );
};
