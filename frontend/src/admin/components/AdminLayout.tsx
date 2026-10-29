import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ToastContainer } from './ToastContainer';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/admin') return { title: 'Studio Intelligence & Analytics', subtitle: 'Live overview and studio KPIs' };
    if (path.startsWith('/admin/bookings')) return { title: 'Reservation & Client Bookings', subtitle: 'Manage client shoots & status' };
    if (path.startsWith('/admin/messages')) return { title: 'Enquiries & Messages', subtitle: 'Customer communications inbox' };
    if (path.startsWith('/admin/portfolio')) return { title: 'Curated Portfolio Gallery', subtitle: 'Organize high-res visual memoirs' };
    if (path.startsWith('/admin/albums')) return { title: 'Handcrafted Albums', subtitle: 'Manage luxury wedding spreads' };
    if (path.startsWith('/admin/reels')) return { title: 'Cinematics & Video Reels', subtitle: 'Instagram reels & short films' };
    if (path.startsWith('/admin/packages')) return { title: 'Investment & Packages', subtitle: 'Pricing tiers and deliverables' };
    if (path.startsWith('/admin/testimonials')) return { title: 'Client Reviews & Memoirs', subtitle: 'Verify and publish couple reviews' };
    if (path.startsWith('/admin/users')) return { title: 'Administrator Accounts', subtitle: 'Role-based access management' };
    if (path.startsWith('/admin/settings')) return { title: 'Website Global Settings', subtitle: 'Brand, SEO, social & security configuration' };
    return { title: 'Admin Workspace', subtitle: 'LensFrame Photography Management' };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating System Toasts */}
      <ToastContainer />
    </div>
  );
};

