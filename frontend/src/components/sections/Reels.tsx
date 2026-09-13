import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Film } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { InstagramIcon } from '../ui/SocialIcons';
import { getReels } from '../../services/portfolioService';
import type { ReelItem } from '../../types/portfolio';
import { fadeUp } from '../../utils/animations';

export const Reels: React.FC = () => {
  const [reels, setReels] = useState<ReelItem[]>([]);

  useEffect(() => {
    getReels().then(setReels);
  }, []);

  return (
    <section id="reels" className="py-24 lg:py-32 bg-[#0E0E0E] dark:bg-[#0E0E0E] light:bg-[#FFFFFF] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header with Instagram CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <SectionHeading
            tag="Reels & Motion"
            title="Cinematic Reels & Teasers"
            highlightWord="Cinematic"
            subtitle="Vertical cinematic reels, intimate vows, and BTS moments captured in high-definition 4K."
            align="left"
            className="mb-0 sm:mb-0"
          />

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-xs uppercase tracking-widest text-[#D4AF37] hover:text-[#E6C558] font-semibold mt-6 md:mt-0 transition-colors group self-start md:self-auto"
          >
            <InstagramIcon size={16} />
            <span>Follow on Instagram</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Responsive Instagram Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {reels.map((reel) => (
            <motion.div
              key={reel.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="group flex flex-col rounded-2xl overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 bg-[#121212] dark:bg-[#121212] light:bg-neutral-50 shadow-xl hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
            >
              {/* Category & Title Header */}
              <div className="px-4 py-3 border-b border-neutral-800 dark:border-neutral-800 light:border-neutral-200 flex items-center justify-between bg-neutral-900/50 dark:bg-neutral-900/50 light:bg-neutral-100/60">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
                  <Film className="w-3 h-3" />
                  <span>{reel.category}</span>
                </div>
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-[#D4AF37] transition-colors"
                  aria-label={`Open ${reel.title} on Instagram`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* 9:16 Instagram Reel Embed Frame */}
              <div className="relative w-full aspect-[9/16] bg-black overflow-hidden">
                <iframe
                  src={reel.embedUrl}
                  title={reel.title}
                  className="w-full h-full border-0"
                  scrolling="no"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Card Footer with Direct Instagram Watch Button */}
              <div className="p-4 flex flex-col gap-2.5">
                <h4 className="font-serif text-sm sm:text-base text-white dark:text-white light:text-neutral-900 font-medium truncate">
                  {reel.title}
                </h4>

                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-neutral-800/80 hover:bg-[#D4AF37] text-neutral-300 hover:text-black dark:bg-neutral-800/80 dark:hover:bg-[#D4AF37] dark:text-neutral-300 dark:hover:text-black light:bg-neutral-200 light:hover:bg-[#D4AF37] light:text-neutral-800 light:hover:text-black text-xs font-semibold tracking-wide transition-all duration-300"
                >
                  <InstagramIcon size={14} />
                  <span>Watch on Instagram</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
