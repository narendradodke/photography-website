import React from 'react';
import { Menu, Shield, Globe } from 'lucide-react';
import { useAdminAuthStore } from '../store/authStore';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  title,
  subtitle,
  actionButton,
}) => {
  const { user } = useAdminAuthStore();

  return (
    <header className="sticky top-0 z-30 bg-[#0E0E0E]/90 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-neutral-400 hover:text-white rounded bg-neutral-900 border border-neutral-800"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-neutral-400 uppercase tracking-widest mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actionButton}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900 text-xs text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Live Site</span>
        </a>

        {/* User Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Shield className="w-4 h-4" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-white leading-tight">
              {user?.username}
            </span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
