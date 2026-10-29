import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Camera,
  LayoutDashboard,
  CalendarCheck,
  Mail,
  Image as ImageIcon,
  BookOpen,
  Film,
  Package,
  MessageSquareQuote,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';
import { useAdminAuthStore } from '../store/authStore';
import { SITE_NAME } from '../../utils/constants';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAdminAuthStore();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Messages', path: '/admin/messages', icon: Mail },
    { label: 'Portfolio', path: '/admin/portfolio', icon: ImageIcon },
    { label: 'Albums', path: '/admin/albums', icon: BookOpen },
    { label: 'Reels', path: '/admin/reels', icon: Film },
    { label: 'Packages', path: '/admin/packages', icon: Package },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    ...(user?.role === 'superadmin' ? [{ label: 'Administrators', path: '/admin/users', icon: Users }] : []),
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0D0D0D] border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                {SITE_NAME}
              </h2>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block -mt-0.5">
                Admin Console
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#D4AF37] text-black font-semibold shadow-md shadow-[#D4AF37]/15'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-850/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#D4AF37]'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-neutral-800 bg-[#090909] space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded text-xs text-neutral-400 hover:text-[#D4AF37] hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </span>
            <span className="text-[10px] text-neutral-600">Live</span>
          </a>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 px-1">
            <div className="flex flex-col truncate pr-2">
              <span className="text-xs font-medium text-white truncate">
                {user?.full_name || user?.username}
              </span>
              <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider capitalize">
                {user?.role}
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="p-2 rounded text-neutral-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

