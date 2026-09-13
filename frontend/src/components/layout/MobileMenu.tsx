import React from 'react';
import { Camera, X, Phone, Mail } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TwitterIcon } from '../ui/SocialIcons';
import { NAV_LINKS, SITE_NAME, TAGLINE, SOCIAL_LINKS, CONTACT_INFO } from '../../utils/constants';
import { useUIStore } from '../../store/uiStore';
import { ThemeToggle } from '../ui/ThemeToggle';

export const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-sm bg-[#0E0E0E] dark:bg-[#0E0E0E] light:bg-white h-full p-6 flex flex-col justify-between border-l border-white/10 dark:border-white/10 light:border-neutral-200 z-10 animate-fade-in shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 dark:border-white/10 light:border-neutral-200">
            <div className="flex items-center gap-2.5">
              <Camera className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-serif text-lg text-white dark:text-white light:text-neutral-900 font-bold">{SITE_NAME}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-neutral-100 text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-white dark:hover:text-white light:hover:text-neutral-900 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-4 py-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base uppercase tracking-widest text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:text-[#D4AF37] font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-white/10 dark:border-white/10 light:border-neutral-200 flex flex-col gap-4">
          <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{CONTACT_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{CONTACT_INFO.email}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-neutral-400 dark:text-neutral-400 light:text-neutral-600 pt-2">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors" aria-label="Instagram">
              <InstagramIcon size={16} />
            </a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors" aria-label="YouTube">
              <YoutubeIcon size={16} />
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors" aria-label="Facebook">
              <FacebookIcon size={16} />
            </a>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors" aria-label="Twitter">
              <TwitterIcon size={16} />
            </a>
          </div>

          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-2">{TAGLINE}</p>
        </div>
      </div>
    </div>
  );
};
