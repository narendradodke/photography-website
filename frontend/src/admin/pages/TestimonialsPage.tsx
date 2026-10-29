import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  Quote,
} from 'lucide-react';
import {
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../services/adminApi';
import type { TestimonialAdminItem } from '../types';
import { FormModal } from '../components/FormModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { ImageUploader } from '../components/ImageUploader';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useAdminAuthStore } from '../store/authStore';

export const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestimonialAdminItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialAdminItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEvent, setFormEvent] = useState('Udaipur Destination Wedding');
  const [formRating, setFormRating] = useState(5);
  const [formQuote, setFormQuote] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formApproved, setFormApproved] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useAdminAuthStore();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to retrieve client reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  const openCreateModal = () => {
    setEditingTest(null);
    setFormName('');
    setFormEvent('Destination Wedding');
    setFormRating(5);
    setFormQuote('');
    setFormAvatar('/images/portfolio/insta-1.webp');
    setFormApproved(true);
    setIsFormOpen(true);
  };

  const openEditModal = (t: TestimonialAdminItem) => {
    setEditingTest(t);
    setFormName(t.name);
    setFormEvent(t.event);
    setFormRating(t.rating || 5);
    setFormQuote(t.quote);
    setFormAvatar(t.avatar);
    setFormApproved(!!t.is_approved);
    setIsFormOpen(true);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openCreateModal();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTest) {
        await updateTestimonial(editingTest.id, {
          name: formName,
          event: formEvent,
          rating: formRating,
          quote: formQuote,
          avatar: formAvatar,
          is_approved: formApproved,
        });
        addToast({ type: 'success', title: 'Review Updated', message: 'Testimonial updated successfully.' });
      } else {
        await createTestimonial({
          name: formName,
          event: formEvent,
          rating: formRating,
          quote: formQuote,
          avatar: formAvatar,
          is_approved: formApproved,
        });
        addToast({ type: 'success', title: 'Review Published', message: 'Client review added.' });
      }
      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err?.response?.data?.detail || 'Failed to save review.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleApproval = async (t: TestimonialAdminItem) => {
    const nextState = !t.is_approved;
    try {
      await updateTestimonial(t.id, { is_approved: nextState });
      addToast({
        type: 'info',
        title: 'Review Status Changed',
        message: `Review by "${t.name}" is now ${nextState ? 'approved for website display' : 'unapproved (hidden)'}.`,
      });
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Update Failed', message: 'Could not change review status.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTestimonial(deleteTarget.id);
      addToast({ type: 'success', title: 'Review Removed', message: 'Testimonial deleted.' });
      setDeleteTarget(null);
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Could not delete review.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Client Memoirs & Testimonials</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Authenticate and curate heartfelt memoirs shared by wedding couples and portrait clients.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/15"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Review</span>
        </button>
      </div>

      {loading ? (
        <CardSkeleton count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : testimonials.length === 0 ? (
        <EmptyState
          title="No Testimonials"
          description="Add client reviews to highlight couples' experiences on the public site."
          actionLabel="Add Review"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => {
            const isApproved = Boolean(t.is_approved);

            return (
              <div
                key={t.id}
                className={`bg-[#141414] border rounded p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group ${
                  isApproved
                    ? 'border-neutral-800 hover:border-[#D4AF37]/50'
                    : 'border-amber-900/40 bg-amber-950/10'
                }`}
              >
                <div>
                  {/* Top Bar with rating stars & status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (t.rating || 5) ? 'fill-current text-[#D4AF37]' : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => toggleApproval(t)}
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                        isApproved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                      title="Click to toggle public approval"
                    >
                      {isApproved ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Approved</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Pending Approval</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="w-6 h-6 text-[#D4AF37]/20 absolute -top-2 -left-1" />
                    <p className="text-xs text-neutral-300 leading-relaxed italic pl-4">
                      "{t.quote}"
                    </p>
                  </div>
                </div>

                {/* Client Profile Footer */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30"
                    />
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-white leading-tight">
                        {t.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{t.event}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                      title="Edit review"
                      aria-label="Edit review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(t)}
                      className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-red-950/20 transition-colors"
                      title="Delete review"
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingTest ? 'Edit Client Review' : 'Add Client Review'}
        subtitle="Manage client memoir and testimonial quote"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Client / Couple Names *
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Pooja & Rohan Mehra"
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Event / Occasion *
              </label>
              <input
                type="text"
                required
                value={formEvent}
                onChange={(e) => setFormEvent(e.target.value)}
                placeholder="e.g. Udaipur Destination Wedding"
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Rating Stars (1 - 5)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormRating(star)}
                  className="p-1 text-[#D4AF37]"
                  aria-label={`${star} Stars`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= formRating ? 'fill-current text-[#D4AF37]' : 'text-neutral-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-neutral-400 ml-2 font-mono">{formRating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Client Testimonial Quote *
            </label>
            <textarea
              rows={4}
              required
              value={formQuote}
              onChange={(e) => setFormQuote(e.target.value)}
              placeholder="Arjun captured emotions we didn't even realize were happening..."
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>

          {/* Avatar Uploader */}
          <ImageUploader
            currentUrl={formAvatar}
            onUploadSuccess={(url) => setFormAvatar(url)}
            acceptType="image"
            label="Client Portrait / Avatar Photo"
          />

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formApproved}
                onChange={(e) => setFormApproved(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <span className="text-xs text-neutral-300 font-medium">
                Approved (Publish on public website immediately)
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2.5 rounded text-xs uppercase tracking-wider text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingTest ? 'Save Changes' : 'Publish Review'}
            </button>
          </div>
        </form>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Review?"
        message={`Are you sure you want to remove the review from "${deleteTarget?.name}"?`}
        confirmLabel="Delete Review"
        isDangerous={true}
      />
    </div>
  );
};
