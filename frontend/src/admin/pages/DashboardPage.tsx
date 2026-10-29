import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Mail,
  Image as ImageIcon,
  BookOpen,
  Film,
  Package,
  TrendingUp,
  CheckCircle,
  Plus,
  ArrowUpRight,
  Download,
  Activity,
} from 'lucide-react';
import { getDashboardStats, downloadBookingsCsv } from '../services/adminApi';
import type { DashboardStats } from '../types';
import { DashboardStatCard } from '../components/DashboardStatCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { useAdminAuthStore } from '../store/authStore';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useAdminAuthStore();

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Unable to retrieve dashboard telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleExportCsv = async () => {
    setDownloadingCsv(true);
    try {
      const blob = await downloadBookingsCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lensframe_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast({
        type: 'success',
        title: 'Export Complete',
        message: 'Bookings CSV file downloaded successfully.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Could not export bookings data.',
      });
    } finally {
      setDownloadingCsv(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <CardSkeleton count={4} />
        <CardSkeleton count={3} />
      </div>
    );
  }

  if (error || !stats) {
    return <ErrorState message={error || 'Failed to load dashboard data'} onRetry={loadStats} />;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#141414] via-[#161616] to-[#121212] border border-neutral-800 rounded">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            LensFrame Studio Intelligence
          </span>
          <h2 className="font-serif text-2xl font-bold text-white mt-1">
            Studio Overview & Performance
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time synchronization across public gallery, bookings, and customer inquiries.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/admin/portfolio?action=add')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/15"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photo</span>
          </button>
          <button
            onClick={() => navigate('/admin/albums?action=add')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs uppercase tracking-wider transition-colors border border-neutral-700"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>New Album</span>
          </button>
          <button
            onClick={() => navigate('/admin/reels?action=add')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs uppercase tracking-wider transition-colors border border-neutral-700"
          >
            <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Add Reel</span>
          </button>
          <button
            onClick={handleExportCsv}
            disabled={downloadingCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs transition-colors border border-neutral-800"
            title="Download CSV of all client bookings"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Total Bookings"
          value={stats.bookings.total}
          subtitle={`${stats.bookings.pending} awaiting confirmation`}
          icon={CalendarCheck}
          badge={stats.bookings.pending > 0 ? `${stats.bookings.pending} Pending` : 'All Clear'}
          badgeColor={stats.bookings.pending > 0 ? 'amber' : 'emerald'}
          onClick={() => navigate('/admin/bookings')}
        />
        <DashboardStatCard
          title="Confirmed Shoots"
          value={stats.bookings.confirmed}
          subtitle={`${stats.bookings.completed} shoots completed`}
          icon={CheckCircle}
          badge="Active"
          badgeColor="emerald"
          onClick={() => navigate('/admin/bookings?status=confirmed')}
        />
        <DashboardStatCard
          title="Client Inquiries"
          value={stats.messages.total}
          subtitle={`${stats.messages.unread} unread messages`}
          icon={Mail}
          badge={stats.messages.unread > 0 ? `${stats.messages.unread} Unread` : 'Zero Unread'}
          badgeColor={stats.messages.unread > 0 ? 'gold' : 'neutral'}
          onClick={() => navigate('/admin/messages')}
        />
        <DashboardStatCard
          title="Estimated Value"
          value={stats.bookings.estimated_revenue ? `₹${stats.bookings.estimated_revenue.toLocaleString('en-IN')}` : '₹0'}
          subtitle="From confirmed & completed packages"
          icon={TrendingUp}
          badge="Verified"
          badgeColor="gold"
          onClick={() => navigate('/admin/bookings')}
        />
      </div>

      {/* Content Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => navigate('/admin/portfolio')}
          className="p-4 bg-[#141414] border border-neutral-800 rounded hover:border-[#D4AF37]/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>Portfolio</span>
          </div>
          <span className="font-serif text-2xl font-bold text-white">{stats.content.portfolio}</span>
          <span className="text-[10px] text-neutral-500 block uppercase tracking-wider mt-1">Photos Published</span>
        </div>

        <div
          onClick={() => navigate('/admin/albums')}
          className="p-4 bg-[#141414] border border-neutral-800 rounded hover:border-[#D4AF37]/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>Albums</span>
          </div>
          <span className="font-serif text-2xl font-bold text-white">{stats.content.albums}</span>
          <span className="text-[10px] text-neutral-500 block uppercase tracking-wider mt-1">Curated Spreads</span>
        </div>

        <div
          onClick={() => navigate('/admin/reels')}
          className="p-4 bg-[#141414] border border-neutral-800 rounded hover:border-[#D4AF37]/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <Film className="w-4 h-4 text-[#D4AF37]" />
            <span>Reels</span>
          </div>
          <span className="font-serif text-2xl font-bold text-white">{stats.content.reels}</span>
          <span className="text-[10px] text-neutral-500 block uppercase tracking-wider mt-1">Short Films</span>
        </div>

        <div
          onClick={() => navigate('/admin/packages')}
          className="p-4 bg-[#141414] border border-neutral-800 rounded hover:border-[#D4AF37]/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>Packages</span>
          </div>
          <span className="font-serif text-2xl font-bold text-white">{stats.content.packages}</span>
          <span className="text-[10px] text-neutral-500 block uppercase tracking-wider mt-1">Pricing Tiers</span>
        </div>

        <div
          onClick={() => navigate('/admin/testimonials')}
          className="p-4 bg-[#141414] border border-neutral-800 rounded hover:border-[#D4AF37]/50 cursor-pointer transition-colors col-span-2 sm:col-span-1"
        >
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
            <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>Memoirs</span>
          </div>
          <span className="font-serif text-2xl font-bold text-white">{stats.content.testimonials}</span>
          <span className="text-[10px] text-neutral-500 block uppercase tracking-wider mt-1">Client Reviews</span>
        </div>
      </div>

      {/* Main Two-Column Split: Recent Bookings & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8/12): Recent Bookings */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-lg font-bold text-white">Recent Client Bookings</h3>
            </div>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#141414] border border-neutral-800 rounded overflow-hidden">
            {stats.recent_bookings.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500 uppercase tracking-widest">
                No bookings recorded yet
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {stats.recent_bookings.map((b) => (
                  <div
                    key={b.booking_id}
                    onClick={() => navigate(`/admin/bookings?id=${b.booking_id}`)}
                    className="p-4 hover:bg-neutral-850/40 cursor-pointer transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#D4AF37] font-semibold">{b.booking_id}</span>
                        <span className="text-xs font-medium text-white truncate">{b.full_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                        <span>{b.package_tier}</span>
                        <span>•</span>
                        <span>Date: {b.event_date}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : b.status === 'completed'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : b.status === 'cancelled'
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5/12): Recent Messages & Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Messages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-bold text-white">Latest Inquiries</h3>
              </div>
              <button
                onClick={() => navigate('/admin/messages')}
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Inbox</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#141414] border border-neutral-800 rounded divide-y divide-neutral-800">
              {stats.recent_contacts.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500 uppercase tracking-widest">
                  No inquiries received
                </div>
              ) : (
                stats.recent_contacts.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate('/admin/messages')}
                    className="p-3.5 hover:bg-neutral-850/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{c.name}</span>
                      {!c.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" title="Unread"></span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {c.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Audit Activity Stream */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="font-serif text-sm font-bold text-white">Recent Admin Activity</h4>
            </div>

            <div className="bg-[#141414] border border-neutral-800 rounded p-4 divide-y divide-neutral-800/60 max-h-56 overflow-y-auto">
              {stats.recent_activity.length === 0 ? (
                <p className="text-xs text-neutral-500">No activity logged yet.</p>
              ) : (
                stats.recent_activity.slice(0, 5).map((log) => (
                  <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="font-medium text-[#D4AF37]">{log.admin_username}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-neutral-300 mt-0.5 text-[11px] truncate">{log.details || log.action}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
