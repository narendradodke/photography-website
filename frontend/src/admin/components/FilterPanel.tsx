import React from 'react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterPanelProps {
  options: FilterOption[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  options,
  activeId,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none ${className}`}>
      {options.map((opt) => {
        const isActive = activeId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`text-xs px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 font-medium ${
              isActive
                ? 'bg-[#D4AF37] text-black font-semibold shadow-md shadow-[#D4AF37]/20'
                : 'bg-[#181818] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <span>{opt.label}</span>
            {typeof opt.count === 'number' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/20 text-black' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

