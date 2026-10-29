import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAdminAuthStore } from '../store/authStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAdminAuthStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
                isSuccess
                  ? 'bg-[#121212]/95 border-[#D4AF37]/50 text-white'
                  : isError
                  ? 'bg-[#180A0A]/95 border-red-500/50 text-red-100'
                  : 'bg-[#141414]/95 border-neutral-700 text-neutral-200'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
                {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400" />}
              </div>

              <div className="flex-1">
                {toast.title && (
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-neutral-300 leading-relaxed">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-neutral-500 hover:text-white transition-colors p-0.5"
                aria-label="Dismiss toast"
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

