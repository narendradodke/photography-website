import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { getPackages } from '../../services/portfolioService';
import type { PackageItem } from '../../types/portfolio';
import { useUIStore } from '../../store/uiStore';
import { fadeUp } from '../../utils/animations';

export const Packages: React.FC = () => {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const { setSelectedPackageId } = useUIStore();

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  const handleSelect = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const bookingElem = document.getElementById('booking');
    if (bookingElem) {
      bookingElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="packages" className="py-24 lg:py-32 bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#F8F8F8] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          tag="Investment"
          title="Curated Photography Packages"
          highlightWord="Packages"
          subtitle="Transparent investments designed to preserve your most cherished milestones with artistic integrity and precision."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`
                relative flex flex-col justify-between p-8 sm:p-10 transition-all duration-300
                bg-[#141414] dark:bg-[#141414] light:bg-white
                ${
                  pkg.popular
                    ? 'border-2 border-[#D4AF37] gold-glow lg:-translate-y-3'
                    : 'border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 hover:border-[#D4AF37]/50'
                }
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-black" />
                  <span>Most Popular Choice</span>
                </div>
              )}

              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-2">
                  {pkg.name} Package
                </div>
                <h3 className="font-serif text-4xl text-white dark:text-white light:text-neutral-900 font-normal mb-2">
                  {pkg.price}
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-8 leading-relaxed">
                  {pkg.tagline}
                </p>

                <div className="w-full h-px bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-200 mb-6"></div>

                <ul className="space-y-3.5 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                      <div className="mt-0.5 p-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelect(pkg.id)}
                className={`
                  w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    pkg.popular
                      ? 'bg-[#D4AF37] hover:bg-[#E6C558] text-black shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02]'
                      : 'border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'
                  }
                `}
              >
                <span>Book This Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
