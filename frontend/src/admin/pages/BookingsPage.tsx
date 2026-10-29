import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Download,
  Eye,
  Trash2,
  Phone,
  Calendar,
  Package,
  User,
} from 'lucide-react';
import {
  getAdminBookings,
  getBookingDetail,
  updateBookingDetail,
  deleteBooking,
  downloadBookingsCsv,
} from '../services/adminApi';
import type { BookingRecord } from '../types';
import { DataTable, type Column } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { FormModal } from '../components/FormModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { useAdminAuthStore } from '../store/authStore';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Bookings' },
  { id: 'pending', label: 'Pending Review' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [search, setSearch] = useState('');

  // Selected Booking Drawer/Modal
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BookingRecord | null>(null);

  // Editable details inside drawer
  const [editStatus, setEditStatus] = useState<string>('pending');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { user, addToast } = useAdminAuthStore();

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminBookings(status, search, page, pageSize);
      setBookings(res.items);
      setTotal(res.total);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Load Failed',
        message: err?.response?.data?.detail || 'Could not load bookings list.',
      });
    } finally {
      setLoading(false);
    }
  }, [status, search, page, pageSize, addToast]);

  const openDetailModal = (b: BookingRecord) => {
    setSelectedBooking(b);
    setEditStatus(b.status);
    setEditNotes(b.internal_notes || '');
    setIsDetailOpen(true);
  };

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Check if ?id=BK-XXXX was provided in URL query to open modal directly
  useEffect(() => {
    const directId = searchParams.get('id');
    if (directId) {
      getBookingDetail(directId)
        .then((b) => {
          openDetailModal(b);
          searchParams.delete('id');
          setSearchParams(searchParams, { replace: true });
        })
        .catch(() => {});
    }
  }, [searchParams, setSearchParams]);

  const handleSaveDetail = async () => {
    if (!selectedBooking) return;
    setIsSaving(true);
    try {
      await updateBookingDetail(selectedBooking.booking_id, {
        status: editStatus,
        internal_notes: editNotes,
      });
      addToast({
        type: 'success',
        title: 'Booking Updated',
        message: `Booking ${selectedBooking.booking_id} status updated to ${editStatus}.`,
      });
      setIsDetailOpen(false);
      loadBookings();
    } catch {
      addToast({ type: 'error', title: 'Update Failed', message: 'Could not update booking.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
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
      addToast({ type: 'success', title: 'Exported', message: 'Bookings CSV file exported successfully.' });
    } catch {
      addToast({ type: 'error', title: 'Export Failed', message: 'Could not export CSV file.' });
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBooking(deleteTarget.booking_id);
      addToast({ type: 'success', title: 'Booking Removed', message: 'Booking record deleted.' });
      setDeleteTarget(null);
      if (selectedBooking?.booking_id === deleteTarget.booking_id) {
        setIsDetailOpen(false);
      }
      loadBookings();
    } catch {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Failed to delete booking.' });
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'confirmed':
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
            Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Pending
          </span>
        );
    }
  };

  const columns: Column<BookingRecord>[] = [
    {
      header: 'Booking ID',
      render: (b) => (
        <span className="font-mono text-[#D4AF37] font-semibold tracking-wide">
          {b.booking_id}
        </span>
      ),
    },
    {
      header: 'Client Name',
      render: (b) => (
        <div>
          <span className="font-medium text-white block">{b.full_name}</span>
          <span className="text-[11px] text-neutral-400 font-mono">{b.phone}</span>
        </div>
      ),
    },
    {
      header: 'Package',
      render: (b) => (
        <span className="capitalize text-neutral-200 font-medium">{b.package_tier}</span>
      ),
    },
    {
      header: 'Event Date',
      render: (b) => (
        <div className="flex items-center gap-1.5 text-neutral-300">
          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{b.event_date}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (b) => getStatusBadge(b.status),
    },
    {
      header: 'Submitted',
      render: (b) => (
        <span className="text-[11px] text-neutral-500 font-mono">
          {new Date(b.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (b) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openDetailModal(b)}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            title="View & manage booking details"
            aria-label="View booking"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {user?.role === 'superadmin' && (
            <button
              onClick={() => setDeleteTarget(b)}
              className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-red-950/20 transition-colors"
              title="Delete booking record"
              aria-label="Delete booking"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by ID, name, phone, package..."
          className="w-full sm:max-w-xs"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold uppercase tracking-wider transition-colors border border-neutral-800 shadow-md"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{isExporting ? 'Exporting...' : 'Export Bookings CSV'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <FilterPanel
        options={STATUS_FILTERS}
        activeId={status}
        onSelect={(stId) => {
          setStatus(stId);
          setPage(1);
        }}
      />

      {/* Bookings Data Table */}
      <DataTable
        columns={columns}
        data={bookings}
        keyExtractor={(b) => b.booking_id}
        isLoading={loading}
        emptyMessage={
          search
            ? `No bookings match search "${search}".`
            : 'No client reservations found in this category.'
        }
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(total / pageSize) || 1,
          totalItems: total,
          pageSize: pageSize,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <FormModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Booking ${selectedBooking.booking_id}`}
          subtitle={`Submitted on ${new Date(selectedBooking.created_at).toLocaleString()}`}
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Client Summary Box */}
            <div className="p-4 rounded bg-[#181818] border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-serif text-base font-bold text-white">
                    {selectedBooking.full_name}
                  </span>
                </div>
                {getStatusBadge(selectedBooking.status)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <a
                    href={`tel:${selectedBooking.phone.replace(/\s+/g, '')}`}
                    className="hover:underline text-white font-mono"
                  >
                    {selectedBooking.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Event Date: <b className="text-white">{selectedBooking.event_date}</b></span>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Package Tier: <b className="text-white capitalize">{selectedBooking.package_tier}</b></span>
                </div>
              </div>

              {selectedBooking.message && (
                <div className="pt-2 border-t border-neutral-800">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
                    Client's Special Notes / Venue Details:
                  </span>
                  <p className="text-xs text-neutral-300 italic bg-black/40 p-3 rounded leading-relaxed">
                    "{selectedBooking.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Status Update Control */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Update Booking Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="pending">Pending Review</option>
                <option value="confirmed">Confirmed (Advance / Deposit Received)</option>
                <option value="completed">Completed (Shoot & Delivery Done)</option>
                <option value="cancelled">Cancelled (Declined or Withdrawn)</option>
              </select>
            </div>

            {/* Internal Admin Notes */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Internal Studio Notes (Private to Administrators)
              </label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="e.g. Lead photographer assigned; advance 50% paid via UPI; final deliverable promised by Dec 25..."
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              {user?.role === 'superadmin' ? (
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selectedBooking)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              ) : (
                <div></div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2.5 rounded text-xs uppercase tracking-wider text-neutral-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveDetail}
                  className="px-5 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Updates'}
                </button>
              </div>
            </div>
          </div>
        </FormModal>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Booking Record?"
        message={`Are you sure you want to permanently delete booking "${deleteTarget?.booking_id}" for ${deleteTarget?.full_name}?`}
        confirmLabel="Delete Booking"
        isDangerous={true}
      />
    </div>
  );
};
