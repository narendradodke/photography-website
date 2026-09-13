import React from 'react';
import { Camera, X, Phone, Mail } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TwitterIcon } from '../ui/SocialIcons';
import { NAV_LINKS, SITE_NAME, TAGLINE, SOCIAL_LINKS, CONTACT_INFO } from '../../utils/constants';
import { useUIStore } from '../../store/uiStore';

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
      <div className="relative ml-auto w-full max-w-sm bg-[#0E0E0E] h-full p-6 flex flex-col justify-between border-l border-white/10 z-10 animate-fade-in">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Camera className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-serif text-lg text-white font-bold">{SITE_NAME}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-4 py-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base uppercase tracking-widest text-neutral-300 hover:text-[#D4AF37] font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
          <div className="text-xs text-neutral-400 flex flex-col gap-1.5">
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
          <div className="flex items-center gap-4 text-neutral-400 pt-2">
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
