import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  Send,
  Eye,
} from 'lucide-react';
import {
  getAdminContacts,
  updateContactDetail,
  deleteContactMessage,
} from '../services/adminApi';
import type { ContactMessageRecord } from '../types';
import { DataTable, type Column } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { FormModal } from '../components/FormModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { useAdminAuthStore } from '../store/authStore';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Messages' },
  { id: 'new', label: 'Unread / New' },
  { id: 'replied', label: 'Replied' },
];

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  // Selected Message
  const [selectedMsg, setSelectedMsg] = useState<ContactMessageRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessageRecord | null>(null);

  // Detail edits
  const [internalNotes, setInternalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useAdminAuthStore();

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminContacts(status, search, page, pageSize);
      setMessages(res.items);
      setTotal(res.total);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Load Failed',
        message: err?.response?.data?.detail || 'Could not load enquiries.',
      });
    } finally {
      setLoading(false);
    }
  }, [status, search, page, pageSize, addToast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const openDetailModal = async (msg: ContactMessageRecord) => {
    setSelectedMsg(msg);
    setInternalNotes(msg.internal_notes || '');
    setIsDetailOpen(true);

    // Auto mark as read if unread
    if (!msg.is_read) {
      try {
        await updateContactDetail(msg.id, { is_read: true, status: 'read' });
        // Update local list
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: 1, status: 'read' } : m))
        );
      } catch {
        // Ignore read update errors
      }
    }
  };

  const handleSaveNotes = async (newStatus?: string) => {
    if (!selectedMsg) return;
    setIsSaving(true);
    try {
      const targetStatus = newStatus || selectedMsg.status;
      await updateContactDetail(selectedMsg.id, {
        internal_notes: internalNotes,
        status: targetStatus,
      });
      addToast({ type: 'success', title: 'Saved', message: 'Message notes and status updated.' });
      setIsDetailOpen(false);
      loadMessages();
    } catch {
      addToast({ type: 'error', title: 'Update Failed', message: 'Could not update message.' });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteContactMessage(deleteTarget.id);
      addToast({ type: 'success', title: 'Deleted', message: 'Enquiry removed.' });
      setDeleteTarget(null);
      if (selectedMsg?.id === deleteTarget.id) {
        setIsDetailOpen(false);
      }
      loadMessages();
    } catch {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Could not delete message.' });
    }
  };

  const columns: Column<ContactMessageRecord>[] = [
    {
      header: 'Sender',
      render: (m) => (
        <div className="flex items-center gap-2.5">
          {!m.is_read ? (
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" title="Unread"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-transparent shrink-0"></span>
          )}
          <div>
            <span className={`block font-medium ${!m.is_read ? 'text-white font-semibold' : 'text-neutral-300'}`}>
              {m.name}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">{m.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Message Preview',
      render: (m) => (
        <p className="text-xs text-neutral-300 line-clamp-1 max-w-md">
          {m.message}
        </p>
      ),
    },
    {
      header: 'Status',
      render: (m) => (
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
            m.status === 'replied'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : !m.is_read
              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
          }`}
        >
          {m.status === 'replied' ? 'Replied' : !m.is_read ? 'New / Unread' : 'Read'}
        </span>
      ),
    },
    {
      header: 'Received',
      render: (m) => (
        <span className="text-[11px] text-neutral-500 font-mono">
          {new Date(m.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (m) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openDetailModal(m)}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            title="Read message"
            aria-label="Read message"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(m)}
            className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-red-950/20 transition-colors"
            title="Delete enquiry"
            aria-label="Delete message"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
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
          placeholder="Search sender, email, inquiry content..."
          className="w-full sm:max-w-xs"
        />

        <div className="text-xs text-neutral-400 font-mono">
          Total Inquiries: <b className="text-white">{total}</b>
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

      {/* Messages Data Table */}
      <DataTable
        columns={columns}
        data={messages}
        keyExtractor={(m) => m.id}
        isLoading={loading}
        emptyMessage={
          search
            ? `No messages match search "${search}".`
            : 'No customer messages in this inbox category.'
        }
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(total / pageSize) || 1,
          totalItems: total,
          pageSize: pageSize,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Message Detail Modal */}
      {selectedMsg && (
        <FormModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Inquiry from ${selectedMsg.name}`}
          subtitle={`Sent on ${new Date(selectedMsg.created_at).toLocaleString()}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Sender Bio & Email Action */}
            <div className="p-4 rounded bg-[#181818] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-widest block font-semibold mb-1">
                  Contact Address
                </span>
                <span className="font-mono text-sm text-[#D4AF37]">{selectedMsg.email}</span>
              </div>

              <a
                href={`mailto:${selectedMsg.email}?subject=${encodeURIComponent(
                  'LensFrame Photography · Follow-up on your inquiry'
                )}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-2">
                Client Inquiry Content:
              </span>
              <div className="p-4 rounded bg-black/60 border border-neutral-800 text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedMsg.message}
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Internal Studio Response Notes
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="e.g. Sent brochure and pricing sheet; phone call scheduled for tomorrow 4 PM..."
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedMsg)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveNotes('replied')}
                  className="px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  Mark as Replied
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveNotes()}
                  className="px-5 py-2 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  Save Notes
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
        title="Delete Customer Message?"
        message={`Are you sure you want to delete message from "${deleteTarget?.name}"?`}
        confirmLabel="Delete Message"
        isDangerous={true}
      />
    </div>
  );
};
