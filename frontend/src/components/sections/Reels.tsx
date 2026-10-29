import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Film, Volume2, VolumeX, Play, Download } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { InstagramIcon } from '../ui/SocialIcons';
import { getReels } from '../../services/portfolioService';
import type { ReelItem } from '../../types/portfolio';
import { fadeUp } from '../../utils/animations';
import { downloadReelVideo } from '../../utils/downloadHelper';

interface ReelCardProps {
  reel: ReelItem;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const videoSrc = reel.videoUrl || (reel as any).video_url;
  const posterSrc = reel.cover || (videoSrc ? videoSrc.replace(/\.mp4$/i, '-poster.jpg') : undefined);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.defaultMuted = isMuted;
    }
  }, [isMuted]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadStatus('Checking...');
    const result = await downloadReelVideo(reel);
    if (result.isExternal) {
      setDownloadStatus('Instagram');
    } else if (!result.success) {
      setDownloadStatus('Unavailable');
    } else {
      setDownloadStatus('Downloaded');
    }
    setTimeout(() => {
      setDownloadStatus(null);
    }, 2500);
  };

  const handleMouseEnter = () => {
    if (videoRef.current && videoSrc) {
      videoRef.current.muted = isMuted;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocked unmuted autoplay, mute and retry
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
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
    if (videoRef.current && videoSrc) {
      if (videoRef.current.paused) {
        videoRef.current.muted = isMuted;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(() => {});
            }
          });
        }
      } else {
        videoRef.current.pause();
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="text-neutral-400 hover:text-[#D4AF37] transition-colors p-1"
            title="Download reel video"
            aria-label={`Download ${reel.title} video`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <a
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-[#D4AF37] transition-colors p-1"
            title="Open in Instagram"
            aria-label={`Open ${reel.title} on Instagram`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 9:16 Video Container with Hover-to-Play & Tap-to-Play */}
      <div
        className="relative w-full aspect-[9/16] bg-black overflow-hidden cursor-pointer select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            src={`${videoSrc}#t=0.001`}
            poster={posterSrc}
            preload="auto"
            muted={isMuted}
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : posterSrc ? (
          <img
            src={posterSrc}
            alt={reel.title}
            className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-neutral-500">
            <Film className="w-12 h-12 text-[#D4AF37] mb-2 opacity-50" />
            <p className="text-xs text-neutral-400 font-medium">{reel.title}</p>
          </div>
        )}

        {/* Gradient Scrims for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Subtle Play badge when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300">
            <div className="w-13 h-13 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
          </div>
        )}

        {/* Floating Sound Toggle Button (only when video source is present) */}
        {videoSrc && (
          <button
            type="button"
            onClick={toggleSound}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-[#D4AF37] hover:text-black transition-all"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
          </button>
        )}

        {/* Hover Hint Badge */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] text-white/90 pointer-events-none">
          <span className="truncate font-medium">{reel.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[#D4AF37] font-mono">
            {isPlaying ? 'Playing' : 'Tap / Hover'}
          </span>
        </div>
      </div>

      {/* Card Footer with Direct Instagram Link & Download Video Button */}
      <div className="p-3 bg-[#141414] dark:bg-[#141414] light:bg-white border-t border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-neutral-800/80 hover:bg-[#D4AF37] text-neutral-300 hover:text-black dark:bg-neutral-800/80 dark:hover:bg-[#D4AF37] dark:text-neutral-300 dark:hover:text-black light:bg-neutral-100 light:hover:bg-[#D4AF37] light:text-neutral-800 light:hover:text-black text-xs font-semibold tracking-wide transition-all duration-300 truncate"
            title="Watch on Instagram"
          >
            <InstagramIcon size={13} />
            <span className="truncate">Instagram</span>
          </a>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:text-black text-xs font-semibold tracking-wide transition-all duration-300 truncate shadow-sm"
            title="Download reel video"
            aria-label={`Download ${reel.title} video`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{downloadStatus || 'Download'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const Reels: React.FC = () => {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getReels()
      .then((items) => {
        if (isMounted) {
          setReels(items);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
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
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="aspect-[9/16] rounded-2xl bg-neutral-900/80 border border-neutral-800 animate-pulse flex flex-col justify-end p-4"
              >
                <div className="h-4 bg-neutral-800 rounded w-2/3 mb-2" />
                <div className="h-3 bg-neutral-800 rounded w-1/3" />
              </div>
            ))
          ) : (
            reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
