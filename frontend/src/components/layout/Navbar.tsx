import React, { useState, useEffect } from 'react';
import { Camera, Menu, X } from 'lucide-react';
import { NAV_LINKS, SITE_NAME, TAGLINE } from '../../utils/constants';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useUIStore } from '../../store/uiStore';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0A0A0A]/90 dark:bg-[#0A0A0A]/90 light:bg-white/90 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-black/10 py-3 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="p-2 rounded-full border border-[#D4AF37]/50 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all duration-300">
            <Camera className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white dark:text-white light:text-neutral-900 group-hover:text-[#D4AF37] transition-colors">
              {SITE_NAME}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] -mt-1 font-medium">
              {TAGLINE}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-widest text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:text-[#D4AF37] transition-colors duration-200 relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <a
            href="#booking"
            className="hidden sm:inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#E6C558] text-black transition-all duration-300 shadow-md hover:shadow-[#D4AF37]/20"
          >
            Book Shoot
          </a>

          {/* Hamburger Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 dark:text-neutral-300 light:text-neutral-800 hover:text-[#D4AF37] transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};
