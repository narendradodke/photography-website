import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { getAlbums } from '../../services/portfolioService';
import type { AlbumsData } from '../../types/portfolio';
import { fadeUp } from '../../utils/animations';

export const Albums: React.FC = () => {
  const [data, setData] = useState<AlbumsData | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAlbums().then(setData);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!data) return null;

  return (
    <section id="albums" className="py-24 lg:py-32 bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#F8F8F8] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <SectionHeading
            tag="Albums Collection"
            title="Handcrafted Wedding Albums"
            highlightWord="Albums"
            subtitle="Archival fine-art photo albums printed on Italian museum-grade paper, bound in genuine leather."
            align="left"
            className="mb-0 sm:mb-0"
          />

          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white dark:text-white light:text-neutral-900 transition-colors"
              aria-label="Scroll Carousel Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white dark:text-white light:text-neutral-900 transition-colors"
              aria-label="Scroll Carousel Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Big Album Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative group rounded-none overflow-hidden bg-neutral-900 border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 mb-16 shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
              <img
                src={data.featured.cover}
                alt={data.featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest px-3 py-1.5">
                {data.featured.badge}
              </div>
            </div>

            <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-between bg-[#141414] dark:bg-[#141414] light:bg-white">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-medium block mb-2">
                  Featured Masterpiece
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white dark:text-white light:text-neutral-900 mb-4">
                  {data.featured.title}
                </h3>
                <p className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed mb-6">
                  {data.featured.subtitle}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold tracking-wider uppercase">
                  <ImageIcon className="w-4 h-4" />
                  <span>{data.featured.photosCount} Curated Photos Included</span>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
                >
                  <span>Order Custom Album</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Horizontal Carousel Row */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x"
        >
          {data.carousel.map((album) => (
            <div
              key={album.id}
              className="shrink-0 w-72 sm:w-80 snap-start group relative overflow-hidden bg-neutral-900 border border-neutral-800 dark:border-neutral-800 light:border-neutral-300"
            >
              <div className="h-64 sm:h-72 overflow-hidden relative">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>

              <div className="p-5 bg-[#141414] dark:bg-[#141414] light:bg-white">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-1">
                  {album.tag}
                </span>
                <h4 className="font-serif text-lg text-white dark:text-white light:text-neutral-900 font-medium">
                  {album.title}
                </h4>
                <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mt-1">
                  {album.photosCount} Archival Pages
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
