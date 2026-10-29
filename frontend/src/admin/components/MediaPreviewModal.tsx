import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download } from 'lucide-react';

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  isVideo?: boolean;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  isOpen,
  onClose,
  url,
  title = 'Media Preview',
  isVideo = false,
}) => {
  if (!isOpen || !url) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-4xl w-full max-h-[90vh] bg-[#121212] border border-neutral-800 rounded shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-[#161616]">
            <h4 className="font-serif text-sm font-medium text-white truncate max-w-md">{title}</h4>
            <div className="flex items-center gap-3">
              <a
                href={url}
                download
                className="p-1.5 text-neutral-400 hover:text-[#D4AF37] transition-colors rounded"
                title="Download media"
              >
                <Download className="w-4 h-4" />
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-neutral-400 hover:text-[#D4AF37] transition-colors rounded"
                title="Open original"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Container */}
          <div className="p-4 flex items-center justify-center bg-black/60 overflow-hidden min-h-[300px] max-h-[75vh]">
            {isVideo ? (
              <video
                src={url}
                controls
                autoPlay
                muted
                playsInline
                className="max-w-full max-h-[70vh] rounded object-contain"
              />
            ) : (
              <img
                src={url}
                alt={title}
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
