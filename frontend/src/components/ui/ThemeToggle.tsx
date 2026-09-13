import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme mode"
      className={`
        p-2.5 rounded-full transition-all duration-300
        bg-[#1F1F1F] dark:bg-[#1F1F1F] light:bg-neutral-200
        text-[#D4AF37] hover:scale-105 active:scale-95
        border border-[#333333] dark:border-[#333333] light:border-neutral-300
        shadow-sm flex items-center justify-center
        ${className}
      `}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#D4AF37] transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-800 transition-transform duration-300 -rotate-12" />
      )}
    </button>
  );
};
