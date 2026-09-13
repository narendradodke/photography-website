import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Pill } from '../ui/Pill';
import { getPortfolio } from '../../services/portfolioService';
import type { PortfolioItem } from '../../types/portfolio';
import { useUIStore } from '../../store/uiStore';

const CATEGORIES = [
  { id: 'all', label: 'All Work' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'portraits', label: 'Portraits' },
  { id: 'travel', label: 'Travel' },
  { id: 'events', label: 'Events' },
];

export const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { openLightbox } = useUIStore();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getPortfolio(selectedCategory).then((data) => {
      if (isMounted) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-[#0E0E0E] dark:bg-[#0E0E0E] light:bg-[#FFFFFF] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <SectionHeading
          tag="Portfolio"
          title="Curated Visual Stories"
          highlightWord="Stories"
          subtitle="An intimate visual anthology spanning regal Indian destination weddings, raw evocative portraits, and serene landscapes."
        />

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <Pill
              key={cat.id}
              label={cat.label}
              active={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            />
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => openLightbox(items, index)}
                  className="group relative cursor-pointer overflow-hidden bg-neutral-900 border border-neutral-800 dark:border-neutral-800 light:border-neutral-200"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* Dark & Gold Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                          {item.category}
                        </span>
                        <h4 className="font-serif text-xl text-white font-medium mt-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-full bg-[#D4AF37] text-black shrink-0 hover:scale-110 transition-transform shadow-lg">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};
