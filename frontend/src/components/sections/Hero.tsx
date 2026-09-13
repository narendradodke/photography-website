import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-10 sm:pb-12 overflow-hidden bg-black"
    >
      {/* Clean Static Background Image & Cinematic Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt="Cinematic bridal portrait"
          className="w-full h-full object-cover object-[75%_center] sm:object-[80%_center] brightness-90"
        />

        {/* Deep Dark Gradients matching the mockup: deep black on left, fading to transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 via-45% to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/70"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Top spacer to balance layout under fixed navbar */}
      <div className="relative z-10 w-full"></div>

      {/* Main Hero Content - Left Aligned Editorial Typography */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full my-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="max-w-2xl select-none"
        >
          {/* Main Title */}
          <h1 className="flex flex-col font-serif uppercase leading-[1.02] tracking-[0.05em] sm:tracking-[0.08em]">
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-white font-normal drop-shadow-sm">
              Capturing
            </span>
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-[#D4AF37] font-normal mt-1 sm:mt-2 drop-shadow-sm">
              Moments
            </span>
          </h1>

          {/* Subtitle / Categories */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-neutral-300 font-sans text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase font-light mt-6 sm:mt-7">
            <span>People</span>
            <span className="text-[#D4AF37] text-xs">•</span>
            <span>Emotions</span>
            <span className="text-[#D4AF37] text-xs">•</span>
            <span>Stories</span>
          </div>

          {/* Gold Accent Bar */}
          <div className="w-20 sm:w-28 h-[2px] bg-[#D4AF37] mt-4 sm:mt-5"></div>
        </motion.div>
      </div>

      {/* Bottom Area: Minimalist Mouse Scroll Down Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-4"
        >
          <a
            href="#portfolio"
            aria-label="Scroll down to portfolio"
            className="inline-flex items-center gap-3.5 text-neutral-400 hover:text-[#D4AF37] transition-colors duration-300 group cursor-pointer select-none"
          >
            {/* Mouse Pill Icon */}
            <div className="w-[22px] h-[34px] rounded-full border-[1.5px] border-neutral-400/80 group-hover:border-[#D4AF37] flex justify-center pt-1.5 transition-colors">
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-[3px] h-[5px] rounded-full bg-[#D4AF37]"
              />
            </div>
            <span className="text-xs tracking-[0.18em] uppercase text-neutral-300 group-hover:text-white font-medium transition-colors">
              Scroll Down
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

