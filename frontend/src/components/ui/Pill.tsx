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
            : 'bg-[#181818] text-neutral-400 hover:text-white hover:bg-[#252525] border border-[#2D2D2D]'
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
