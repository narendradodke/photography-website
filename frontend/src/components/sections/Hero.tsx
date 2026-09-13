import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TwitterIcon } from '../ui/SocialIcons';
import { SOCIAL_LINKS } from '../../utils/constants';

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-10 overflow-hidden bg-black"
    >
      {/* Background Image with Cinematic Vignette & Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=2000&q=90"
          alt="Cinematic photographer silhouette"
          className="w-full h-full object-cover object-center brightness-75 scale-105 animate-pulse-slow"
        />
        {/* Editorial Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60"></div>
      </div>

      {/* Left Vertical Social Icons (Desktop only) */}
      <div className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] rotate-90 origin-left translate-y-6">
          Follow
        </span>
        <div className="w-px h-12 bg-[#D4AF37]/40 mb-4"></div>
        <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#D4AF37] transition-all hover:scale-110" aria-label="Instagram">
          <InstagramIcon size={16} />
        </a>
        <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#D4AF37] transition-all hover:scale-110" aria-label="YouTube">
          <YoutubeIcon size={16} />
        </a>
        <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#D4AF37] transition-all hover:scale-110" aria-label="Facebook">
          <FacebookIcon size={16} />
        </a>
        <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#D4AF37] transition-all hover:scale-110" aria-label="Twitter">
          <TwitterIcon size={16} />
        </a>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-8"
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-[#D4AF37]"></span>
              <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">
                Professional Photographer
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
              Turning <span className="text-[#D4AF37] italic">Moments</span> into Memories
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl font-light leading-relaxed mb-8">
              I'm a passionate photographer who believes in the power of real moments. From grand heritage weddings to quiet intimate portraits, every frame is crafted with cinematic light, natural emotion, and editorial timelessness.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-sm tracking-wider uppercase transition-all duration-300 shadow-xl shadow-[#D4AF37]/20 hover:scale-105"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/30 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white text-sm font-medium tracking-wider uppercase transition-all duration-300 backdrop-blur-sm"
              >
                <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                <span>About Me</span>
              </a>
            </div>
          </motion.div>

          {/* Right Cursive Accent Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center text-center p-8 relative"
          >
            <div className="relative">
              <span className="font-cursive text-5xl xl:text-6xl text-[#D4AF37] leading-tight block transform -rotate-6 select-none drop-shadow-md">
                "Every Frame <br /> Has A Story"
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 mt-4 block">
                — LensFrame Philosophy
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Area: Stats Bar & Scroll indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/15 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className="font-serif text-3xl sm:text-4xl text-[#D4AF37] font-semibold">500+</span>
            <div className="text-xs uppercase tracking-wider text-neutral-400">
              Happy Clients <br /> Across India
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-serif text-3xl sm:text-4xl text-[#D4AF37] font-semibold">1000+</span>
            <div className="text-xs uppercase tracking-wider text-neutral-400">
              Photos Captured <br /> In High Resolution
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-serif text-3xl sm:text-4xl text-[#D4AF37] font-semibold">5+</span>
            <div className="text-xs uppercase tracking-wider text-neutral-400">
              Years Experience <br /> In Visual Arts
            </div>
          </div>
        </div>

        {/* Center Scroll Indicator */}
        <div className="flex justify-center mt-6">
          <a
            href="#about"
            aria-label="Scroll down to about section"
            className="text-neutral-400 hover:text-[#D4AF37] transition-colors flex flex-col items-center gap-1 animate-bounce"
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
