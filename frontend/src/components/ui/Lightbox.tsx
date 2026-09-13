import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const Lightbox: React.FC = () => {
  const { lightbox, closeLightbox, nextLightbox, prevLightbox, openLightbox } = useUIStore();
  const { isOpen, currentIndex, items } = lightbox;

  const currentItem = items[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    },
    [isOpen, closeLightbox, nextLightbox, prevLightbox]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 animate-fade-in">
      {/* Top action bar */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        <span className="text-xs tracking-widest text-neutral-400">
          {currentIndex + 1} / {items.length}
        </span>
        <button
          onClick={closeLightbox}
          className="p-2.5 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white transition-colors duration-200"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={prevLightbox}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white border border-white/10 transition-all duration-200 z-30"
        aria-label="Previous Image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextLightbox}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white border border-white/10 transition-all duration-200 z-30"
        aria-label="Next Image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Content Modal */}
      <div className="max-w-6xl w-full h-[85vh] flex flex-col lg:flex-row bg-[#111111] border border-white/10 overflow-hidden shadow-2xl">
        {/* Left / Center: Big Image */}
        <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden p-2 sm:p-4">
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="max-h-full max-w-full object-contain select-none"
          />
        </div>

        {/* Right side: Editorial details & thumbnails */}
        <div className="w-full lg:w-80 bg-[#161616] p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              {currentItem.category}
            </span>
            <h3 className="font-serif text-2xl text-white mt-1 mb-3">{currentItem.title}</h3>
            
            <div className="flex flex-col gap-2 text-xs text-neutral-400 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{currentItem.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{currentItem.date}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail list */}
          <div className="mt-6">
            <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Thumbnails</h4>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => openLightbox(items, idx)}
                  className={`relative shrink-0 w-14 h-14 overflow-hidden border transition-all duration-200 ${
                    idx === currentIndex ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
