import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Film, Volume2, VolumeX, Play } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { InstagramIcon } from '../ui/SocialIcons';
import { getReels } from '../../services/portfolioService';
import type { ReelItem } from '../../types/portfolio';
import { fadeUp } from '../../utils/animations';

interface ReelCardProps {
  reel: ReelItem;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be restricted if unmuted without user interaction
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleCardClick = () => {
    // On mobile touch or click, toggle playback
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 bg-[#121212] dark:bg-[#121212] light:bg-neutral-50 shadow-xl hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/15 transition-all duration-300"
    >
      {/* Category & External Link Header */}
      <div className="px-4 py-2.5 border-b border-neutral-800 dark:border-neutral-800 light:border-neutral-200 flex items-center justify-between bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-neutral-100/70">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
          <Film className="w-3 h-3" />
          <span>{reel.category}</span>
        </div>
        <a
          href={reel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-[#D4AF37] transition-colors"
          title="Open in Instagram"
          aria-label={`Open ${reel.title} on Instagram`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 9:16 Video Container with Hover-to-Play */}
      <div
        className="relative w-full aspect-[9/16] bg-black overflow-hidden cursor-pointer select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <video
          ref={videoRef}
          src={reel.videoUrl || (reel as any).embedUrl}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
        />

        {/* Gradient Scrims for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Subtle Play badge when not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300">
            <div className="w-13 h-13 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
          </div>
        )}

        {/* Floating Sound Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-[#D4AF37] hover:text-black transition-all"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
        </button>

        {/* Hover Hint Badge */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] text-white/80 pointer-events-none">
          <span className="truncate font-medium">{reel.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10 text-[#D4AF37]">
            {isPlaying ? 'Playing' : 'Hover to play'}
          </span>
        </div>
      </div>

      {/* Card Footer with Direct Instagram Link */}
      <div className="p-3.5 flex flex-col gap-2 bg-[#141414] dark:bg-[#141414] light:bg-white border-t border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
        <a
          href={reel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-neutral-800/80 hover:bg-[#D4AF37] text-neutral-300 hover:text-black dark:bg-neutral-800/80 dark:hover:bg-[#D4AF37] dark:text-neutral-300 dark:hover:text-black light:bg-neutral-100 light:hover:bg-[#D4AF37] light:text-neutral-800 light:hover:text-black text-xs font-semibold tracking-wide transition-all duration-300"
        >
          <InstagramIcon size={14} />
          <span>Watch on Instagram</span>
        </a>
      </div>
    </motion.div>
  );
};

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
            subtitle="Vertical cinematic reels, intimate vows, and BTS moments captured in high-definition 4K. Hover over any reel to play instantly."
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
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      </div>
    </section>
  );
};
