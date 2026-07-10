'use client';

import React from 'react';
import { useVectora } from '@/lib/store';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useVectora();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />,
            info: <Info className="w-6 h-6 text-cyan-400 shrink-0" />,
            warning: <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />,
            error: <XCircle className="w-6 h-6 text-rose-400 shrink-0" />,
          };

          const borderColors = {
            success: 'border-emerald-500/30 bg-emerald-950/90 dark:bg-emerald-950/90 text-white',
            info: 'border-cyan-500/30 bg-cyan-950/90 dark:bg-cyan-950/90 text-white',
            warning: 'border-amber-500/30 bg-amber-950/90 dark:bg-amber-950/90 text-white',
            error: 'border-rose-500/30 bg-rose-950/90 dark:bg-rose-950/90 text-white',
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${borderColors[toast.type]}`}
            >
              {icons[toast.type]}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold tracking-wide text-white">{toast.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.description}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
