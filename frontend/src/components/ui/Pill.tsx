import React from 'react';

interface PillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

export const Pill: React.FC<PillProps> = ({ label, active = false, onClick, count }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-5 py-2 text-xs font-semibold uppercase tracking-widest rounded-full transition-all duration-300
        ${
          active
            ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/25'
            : 'bg-[#181818] dark:bg-[#181818] light:bg-neutral-100 text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-white dark:hover:text-white light:hover:text-neutral-900 hover:bg-[#252525] dark:hover:bg-[#252525] light:hover:bg-neutral-200 border border-[#2D2D2D] dark:border-[#2D2D2D] light:border-neutral-300'
        }
      `}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-300'}`}>
          {count}
        </span>
      )}
    </button>
  );
};
