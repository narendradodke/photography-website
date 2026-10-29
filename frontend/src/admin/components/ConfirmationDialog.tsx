import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDangerous = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#141414] border border-neutral-800 rounded shadow-2xl overflow-hidden z-10 p-6"
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full shrink-0 ${
                isDangerous ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">{message}</p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 rounded text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-5 py-2.5 rounded font-semibold text-xs uppercase tracking-wider transition-all shadow-md ${
                    isDangerous
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                      : 'bg-[#D4AF37] hover:bg-[#E6C558] text-black shadow-[#D4AF37]/20'
                  } disabled:opacity-50`}
                >
                  {isLoading ? 'Processing...' : confirmLabel}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

