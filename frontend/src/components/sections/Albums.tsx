import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon, Download, Sparkles, BookOpen } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { getAlbums } from '../../services/portfolioService';
import type { AlbumsData, AlbumItem } from '../../types/portfolio';
import { fadeUp } from '../../utils/animations';
import { downloadAlbumMedia } from '../../utils/downloadHelper';

export const Albums: React.FC = () => {
  const [data, setData] = useState<AlbumsData | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [activeSpreadImage, setActiveSpreadImage] = useState<string>('');
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getAlbums().then((result) => {
      if (isMounted && result) {
        setData(result);
        if (result.featured) {
          setSelectedAlbumId(result.featured.id);
          const initialImg = (result.featured.previewImages && result.featured.previewImages.length > 0)
            ? result.featured.previewImages[0]
            : result.featured.cover;
          setActiveSpreadImage(initialImg);
        } else if (result.carousel && result.carousel.length > 0) {
          setSelectedAlbumId(result.carousel[0].id);
          setActiveSpreadImage(result.carousel[0].cover);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Consolidate full albums list
  const allAlbums: AlbumItem[] = useMemo(() => {
    if (!data) return [];
    if (data.albums && data.albums.length > 0) return data.albums;
    const list: AlbumItem[] = [];
    if (data.featured) {
      list.push({
        ...data.featured,
        tag: data.featured.badge || 'Featured Spread',
      });
    }
    if (data.carousel) {
      list.push(...data.carousel);
    }
    return list;
  }, [data]);

  // Current active album
  const currentAlbum: AlbumItem | undefined = useMemo(() => {
    return allAlbums.find((a) => a.id === selectedAlbumId) || (data?.featured as unknown as AlbumItem) || allAlbums[0];
  }, [allAlbums, selectedAlbumId, data]);

  // Spreads for current album
  const availableSpreads: string[] = useMemo(() => {
    if (!currentAlbum) return [];
    const list = currentAlbum.previewImages && currentAlbum.previewImages.length > 0
      ? [...currentAlbum.previewImages]
      : [currentAlbum.cover];
    if (!list.includes(currentAlbum.cover)) {
      list.unshift(currentAlbum.cover);
    }
    return list;
  }, [currentAlbum]);

  const handleSelectAlbum = (album: AlbumItem) => {
    setSelectedAlbumId(album.id);
    const spreads = album.previewImages && album.previewImages.length > 0
      ? album.previewImages
      : [album.cover];
    setActiveSpreadImage(spreads[0] || album.cover);
  };

  const handleSelectSpread = (spreadUrl: string) => {
    setActiveSpreadImage(spreadUrl);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 360;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!data || !currentAlbum) return null;

  return (
    <section id="albums" className="py-24 lg:py-32 bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#F8F8F8] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <SectionHeading
            tag="Albums Collection"
            title="Handcrafted Wedding Albums"
            highlightWord="Albums"
            subtitle="Archival fine-art photo albums printed on Italian museum-grade paper, bound in genuine leather with custom gold embossing."
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

        {/* 1. Large Interactive Featured Album Preview */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative group rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 mb-14 shadow-2xl transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Left Column: Large Spread Viewer with Fade Transition */}
            <div className="lg:col-span-8 relative bg-black flex items-center justify-center overflow-hidden min-h-[340px] sm:min-h-[440px] lg:min-h-[520px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSpreadImage || currentAlbum.cover}
                  src={activeSpreadImage || currentAlbum.cover}
                  alt={currentAlbum.title}
                  initial={{ opacity: 0.4, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full h-full object-cover object-center select-none"
                />
              </AnimatePresence>

              {/* Gradient Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Album Category/Badge at top left */}
              <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                <span className="bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentAlbum.badge || currentAlbum.tag || 'Handcrafted Spread'}
                </span>
              </div>

              {/* Layflat Spread watermark indicator at bottom left */}
              <div className="absolute bottom-4 left-5 z-10 hidden sm:flex items-center gap-2 text-white/80 text-[11px] font-mono tracking-wider bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10">
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Seamless Flush-Mount Layflat Spread</span>
              </div>

              {/* Quick Download Overlay button on hover */}
              <button
                type="button"
                onClick={() => downloadAlbumMedia(currentAlbum, activeSpreadImage)}
                className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-black/70 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-[#D4AF37] transition-all shadow-lg"
                title="Download this album spread"
                aria-label="Download album spread"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Right Column: Album Details, Spreads Strip & CTAs */}
            <div className="lg:col-span-4 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#141414] dark:bg-[#141414] light:bg-white border-t lg:border-t-0 lg:border-l border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                    Curated Archival Album
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Vol. {currentAlbum.id.replace('album-', '')}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white dark:text-white light:text-neutral-900 mb-3">
                  {currentAlbum.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed mb-6">
                  {currentAlbum.subtitle || 'Handcrafted Italian fine-art wedding album with metallic foil embossing and flush-mount layflat binding.'}
                </p>

                {/* Badges / Specifications */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800/80 dark:bg-neutral-800/80 light:bg-neutral-100 border border-neutral-700/60 dark:border-neutral-700/60 light:border-neutral-200">
                    <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{currentAlbum.photosCount} Archival Photos</span>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-medium">
                    Museum Paper
                  </span>
                </div>

                {/* Spreads Strip: Clicking any spread switches large preview */}
                <div className="pt-4 border-t border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                      Album Spreads ({availableSpreads.length})
                    </span>
                    <span className="text-[10px] text-[#D4AF37]">Click to preview</span>
                  </div>

                  <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                    {availableSpreads.map((spreadUrl, idx) => {
                      const isActive = (activeSpreadImage || currentAlbum.cover) === spreadUrl;
                      return (
                        <button
                          key={spreadUrl + idx}
                          type="button"
                          onClick={() => handleSelectSpread(spreadUrl)}
                          className={`relative shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                            isActive
                              ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 scale-105'
                              : 'border-transparent opacity-65 hover:opacity-100 hover:border-white/30'
                          }`}
                          title={`View Spread ${idx + 1}`}
                          aria-label={`View Spread ${idx + 1}`}
                        >
                          <img
                            src={spreadUrl}
                            alt={`${currentAlbum.title} spread ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-[#D4AF37]/10" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center gap-3 border-t border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
                <a
                  href="#booking"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f27] text-black text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span>Order Custom Album</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => downloadAlbumMedia(currentAlbum, activeSpreadImage)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                  title="Download selected spread image"
                  aria-label="Download selected spread image"
                >
                  <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Download Spread</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Collection Volumes Row: Clicking any card updates the featured view above */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Browse Album Volumes ({allAlbums.length})
            </span>
            <span className="text-[11px] text-neutral-400">
              Select any album to explore its handcrafted spreads
            </span>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-6 scrollbar-none snap-x"
          >
            {allAlbums.map((album) => {
              const isSelected = album.id === currentAlbum.id;
              return (
                <div
                  key={album.id}
                  onClick={() => handleSelectAlbum(album)}
                  className={`shrink-0 w-80 sm:w-[380px] snap-start group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/20 shadow-xl shadow-[#D4AF37]/10 scale-[1.01]'
                      : 'border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 hover:border-[#D4AF37]/60 hover:scale-[1.01]'
                  } bg-neutral-900`}
                >
                  <div className="aspect-[16/9] w-full overflow-hidden relative bg-black/40">
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Active pill badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
                        Active Preview
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                        {album.previewImages && album.previewImages.length > 0
                          ? `${album.previewImages.length} Spreads`
                          : 'Full Spread'}
                      </span>
                      <span className="text-[10px] text-neutral-300">
                        {album.photosCount} Pages
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#141414] dark:bg-[#141414] light:bg-white flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-0.5 truncate">
                        {album.tag || album.badge || 'Wedding Spread'}
                      </span>
                      <h4 className="font-serif text-base text-white dark:text-white light:text-neutral-900 font-medium truncate">
                        {album.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadAlbumMedia(album);
                      }}
                      className="p-2 rounded-lg bg-neutral-800/80 hover:bg-[#D4AF37] text-neutral-300 hover:text-black transition-colors shrink-0"
                      title="Download album cover"
                      aria-label={`Download ${album.title} cover`}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
