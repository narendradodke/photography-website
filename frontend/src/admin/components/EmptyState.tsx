import React from 'react';
import { Camera, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are currently no items matching your criteria in the system.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#141414] border border-neutral-800 rounded">
      <div className="p-4 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] mb-4">
        {icon || <Camera className="w-8 h-8" />}
      </div>
      <h3 className="font-serif text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-xs text-neutral-400 max-w-sm mb-6 leading-relaxed uppercase tracking-wider">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/15"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

