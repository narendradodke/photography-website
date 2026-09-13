import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { MobileMenu } from './components/layout/MobileMenu';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Portfolio } from './components/sections/Portfolio';
import { Albums } from './components/sections/Albums';
import { Reels } from './components/sections/Reels';
import { Packages } from './components/sections/Packages';
import { Booking } from './components/sections/Booking';
import { Contact } from './components/sections/Contact';
import { Testimonials } from './components/sections/Testimonials';
import { Lightbox } from './components/ui/Lightbox';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { useTheme } from './hooks/useTheme';

export const App: React.FC = () => {
  // Ensure theme is active
  useTheme();

  return (
    <div className="min-h-screen bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#F8F8F8] text-white dark:text-white light:text-neutral-900 selection:bg-[#D4AF37] selection:text-black font-sans transition-colors duration-300">
      {/* Navigation Bar */}
      <Navbar />

      {/* Mobile Drawer */}
      <MobileMenu />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <About />
        <Portfolio />
        <Albums />
        <Reels />
        <Packages />
        <Booking />
        <Testimonials />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Lightbox Modal */}
      <Lightbox />

      {/* Floating Theme Toggle (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <ThemeToggle className="shadow-2xl hover:shadow-[#D4AF37]/30 scale-110" />
      </div>
    </div>
  );
};

export default App;
