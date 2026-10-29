import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { MobileMenu } from './components/layout/MobileMenu';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
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

// Code-split / Lazy-loaded Admin Console (reduces public website bundle size)
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const ProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute').then(m => ({ default: m.ProtectedRoute })));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout').then(m => ({ default: m.AdminLayout })));
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const PortfolioPage = lazy(() => import('./admin/pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const AlbumsPage = lazy(() => import('./admin/pages/AlbumsPage').then(m => ({ default: m.AlbumsPage })));
const ReelsPage = lazy(() => import('./admin/pages/ReelsPage').then(m => ({ default: m.ReelsPage })));
const PackagesPage = lazy(() => import('./admin/pages/PackagesPage').then(m => ({ default: m.PackagesPage })));
const TestimonialsPage = lazy(() => import('./admin/pages/TestimonialsPage').then(m => ({ default: m.TestimonialsPage })));
const BookingsPage = lazy(() => import('./admin/pages/BookingsPage').then(m => ({ default: m.BookingsPage })));
const MessagesPage = lazy(() => import('./admin/pages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const UsersPage = lazy(() => import('./admin/pages/UsersPage').then(m => ({ default: m.UsersPage })));
const SettingsPage = lazy(() => import('./admin/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const AdminLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center gap-3">
    <div className="w-9 h-9 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-mono">Loading Admin Portal</span>
  </div>
);

const PublicWebsite: React.FC = () => {
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

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicWebsite />} />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLoginPage />
            </Suspense>
          }
        />

        {/* Protected Admin Console */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProtectedRoute />
            </Suspense>
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="reels" element={<ReelsPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
