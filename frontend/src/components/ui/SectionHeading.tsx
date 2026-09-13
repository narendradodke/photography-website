import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animations';

interface SectionHeadingProps {
  tag?: string;
  title: string;
  highlightWord?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  tag,
  title,
  highlightWord,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignment = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  // Helper to highlight a specific word in the title
  const renderTitle = () => {
    if (!highlightWord) return title;
    const parts = title.split(new RegExp(`(${highlightWord})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={i} className="text-[#D4AF37] italic font-serif">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={`flex flex-col ${alignment} mb-12 sm:mb-16 ${className}`}
    >
      {tag && (
        <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold mb-3 flex items-center gap-2">
          <span className="w-6 h-px bg-[#D4AF37]"></span>
          {tag}
          <span className="w-6 h-px bg-[#D4AF37]"></span>
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-white dark:text-white light:text-neutral-900 leading-tight">
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm sm:text-base text-neutral-400 dark:text-neutral-400 light:text-neutral-600 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
