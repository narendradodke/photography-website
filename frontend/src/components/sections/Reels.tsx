import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Film } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { getReels } from '../../services/portfolioService';
import type { ReelItem } from '../../types/portfolio';
import { fadeUp } from '../../utils/animations';

export const Reels: React.FC = () => {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    getReels().then(setReels);
  }, []);

  return (
    <section id="reels" className="py-24 lg:py-32 bg-[#0E0E0E] dark:bg-[#0E0E0E] light:bg-[#FFFFFF] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          tag="Reels & Motion"
          title="Cinematic Reels & Teasers"
          highlightWord="Cinematic"
          subtitle="Vertical cinematic reels, intimate vows, and BTS shorts captured with anamorphic lenses and dynamic 4K color grading."
        />

        {/* 4 Vertical 9:16 Video Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reels.map((reel) => (
            <motion.div
              key={reel.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative aspect-[9/16] overflow-hidden bg-neutral-900 border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 shadow-xl cursor-pointer"
              onClick={() => setActiveVideo(reel.videoUrl)}
            >
              {/* Cover Thumbnail */}
              <img
                src={reel.cover}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* Duration Badge Top Right */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-white border border-white/10">
                <Clock className="w-3 h-3 text-[#D4AF37]" />
                <span>{reel.duration}</span>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-black flex items-center justify-center transform group-hover:scale-115 transition-transform duration-300 shadow-xl shadow-[#D4AF37]/30">
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </div>
              </div>

              {/* Bottom details */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">
                  <Film className="w-3 h-3" />
                  <span>{reel.photosCount} Frames</span>
                </div>
                <h4 className="font-serif text-lg text-white font-medium">{reel.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal Preview if clicked */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div className="relative max-w-sm w-full aspect-[9/16] bg-black rounded-lg overflow-hidden border border-white/20">
            <video
              src={activeVideo}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
};
