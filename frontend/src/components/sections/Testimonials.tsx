import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { getTestimonials } from '../../services/portfolioService';
import type { TestimonialItem } from '../../types/portfolio';
import { fadeUp } from '../../utils/animations';

export const Testimonials: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    getTestimonials().then(setItems);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-[#0E0E0E] dark:bg-[#0E0E0E] light:bg-[#FFFFFF] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          tag="Kind Words"
          title="Stories From Our Couples"
          highlightWord="Couples"
          subtitle="Real reviews and authentic memories from couples and families who trusted us with their once-in-a-lifetime moments."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative p-8 bg-[#141414] dark:bg-[#141414] light:bg-[#F8F8F8] border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-[#D4AF37]/30 mb-2" />

                <p className="text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 italic leading-relaxed mb-6 font-light">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40"
                />
                <div>
                  <h4 className="font-serif text-sm font-medium text-white dark:text-white light:text-neutral-900">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#D4AF37]">{item.event}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
