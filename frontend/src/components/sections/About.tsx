import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Camera, HeartHandshake } from 'lucide-react';
import { fadeUp } from '../../utils/animations';

const skills = [
  { name: 'Photography', percent: 95 },
  { name: 'Photo Editing', percent: 90 },
  { name: 'Video Editing', percent: 85 },
  { name: 'Creative Direction', percent: 80 },
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#F8F8F8] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story, Bio, Stats, Signature */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="lg:col-span-7"
          >
            {/* Tag */}
            <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              About Me
            </span>

            {/* Heading */}
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white dark:text-white light:text-neutral-900 leading-tight mb-2">
              Hi, I'm <span className="text-[#D4AF37] italic">Arjun Sharma</span>
            </h2>
            <h3 className="text-lg text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-light mb-6 tracking-wide">
              Photographer & Visual Storyteller
            </h3>

            {/* Bio Paragraph */}
            <p className="text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed text-sm sm:text-base mb-8">
              Based in Indore and travelling across India and abroad, I specialize in documentary-style wedding photography, high-fashion portraits, and landscape compositions. Over the past five years, I have had the privilege to document more than 500 unforgettable love stories, capturing unguarded laughs, quiet tears of joy, and timeless heirloom frames.
            </p>

            {/* Stats Row with icons */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-neutral-800 dark:border-neutral-800 light:border-neutral-300 mb-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                  <Award className="w-4 h-4" />
                  <span className="font-serif text-2xl sm:text-3xl font-bold">5+</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Years Exp.</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                  <HeartHandshake className="w-4 h-4" />
                  <span className="font-serif text-2xl sm:text-3xl font-bold">500+</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Happy Couples</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                  <Camera className="w-4 h-4" />
                  <span className="font-serif text-2xl sm:text-3xl font-bold">1000+</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Photos Taken</span>
              </div>
            </div>

            {/* Signature & Action */}
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Signature</span>
                <span className="font-cursive text-4xl text-[#D4AF37] select-none">
                  Arjun Sharma
                </span>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="#portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  <span>View My Work</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Profile Image + Skills Progress Bars */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            {/* Image frame */}
            <div className="relative group mx-auto max-w-md w-full">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/30 to-transparent rounded-2xl blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative rounded-2xl overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85"
                  alt="Arjun Sharma Portrait"
                  className="w-full h-[420px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-serif text-base font-medium">Arjun Sharma</h4>
                    <p className="text-[11px] text-[#D4AF37] uppercase tracking-wider">Lead Photographer</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills progress bars */}
            <div className="bg-[#141414] dark:bg-[#141414] light:bg-white p-6 rounded-xl border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 shadow-md">
              <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-4">
                Core Expertise & Craft
              </h4>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs font-medium mb-1.5 text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                      <span>{skill.name}</span>
                      <span className="text-[#D4AF37]">{skill.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E6C558] rounded-full transition-all duration-1000"
                        style={{ width: `${skill.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
