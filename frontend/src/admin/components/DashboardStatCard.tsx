import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: 'gold' | 'emerald' | 'amber' | 'neutral';
  onClick?: () => void;
}

export const DashboardStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'gold',
  onClick,
}) => {
  const getBadgeStyle = () => {
    switch (badgeColor) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'neutral':
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
      case 'gold':
      default:
        return 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 bg-[#141414] border border-neutral-800 rounded relative overflow-hidden transition-all duration-300 group hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/5 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Decorative top gold line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="flex items-start justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          {title}
        </span>
        <div className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-[#D4AF37] group-hover:border-[#D4AF37]/50 group-hover:scale-105 transition-all">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-serif text-3xl font-bold text-white tracking-tight">
          {value}
        </h3>
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getBadgeStyle()}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-neutral-500 mt-2 truncate font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};

