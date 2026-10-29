import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  EyeOff,
  Layers,
} from 'lucide-react';
import {
  getAdminAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from '../services/adminApi';
import type { AlbumAdminItem } from '../types';
import { FormModal } from '../components/FormModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { MediaPreviewModal } from '../components/MediaPreviewModal';
import { ImageUploader } from '../components/ImageUploader';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useAdminAuthStore } from '../store/authStore';

export const AlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<AlbumAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<AlbumAdminItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AlbumAdminItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; title: string } | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formPhotosCount, setFormPhotosCount] = useState<number>(45);
  const [formBadge, setFormBadge] = useState('Handcrafted Album Spread');
  const [formCover, setFormCover] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useAdminAuthStore();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminAlbums();
      setAlbums(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to retrieve album collections.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAlbum(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormPhotosCount(50);
    setFormBadge('Handcrafted Album Spread');
    setFormCover('');
    setFormFeatured(false);
    setFormVisible(true);
    setIsFormOpen(true);
  };

  const openEditModal = (alb: AlbumAdminItem) => {
    setEditingAlbum(alb);
    setFormTitle(alb.title);
    setFormSubtitle(alb.subtitle || '');
    setFormPhotosCount(alb.photos_count || 40);
    setFormBadge(alb.badge_or_tag || 'Spread');
    setFormCover(alb.cover);
    setFormFeatured(!!alb.is_featured);
    setFormVisible(!!alb.is_visible);
    setIsFormOpen(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openCreateModal();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCover.trim()) {
      addToast({ type: 'error', title: 'Cover Required', message: 'Please upload or provide an album cover image.' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAlbum) {
        await updateAlbum(editingAlbum.id, {
          title: formTitle,
          subtitle: formSubtitle,
          photos_count: formPhotosCount,
          badge_or_tag: formBadge,
          cover: formCover,
          is_featured: formFeatured,
          is_visible: formVisible,
        });
        addToast({ type: 'success', title: 'Album Updated', message: 'Album details saved successfully.' });
      } else {
        await createAlbum({
          title: formTitle,
          subtitle: formSubtitle,
          photos_count: formPhotosCount,
          badge_or_tag: formBadge,
          cover: formCover,
          is_featured: formFeatured,
          is_visible: formVisible,
        });
        addToast({ type: 'success', title: 'Album Created', message: 'New album spread added to the catalog.' });
      }
      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err?.response?.data?.detail || 'Failed to save album.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVisibility = async (alb: AlbumAdminItem) => {
    const nextState = !alb.is_visible;
    try {
      await updateAlbum(alb.id, { is_visible: nextState });
      addToast({
        type: 'info',
        title: 'Visibility Changed',
        message: `Album "${alb.title}" is now ${nextState ? 'visible' : 'hidden'}.`,
      });
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Update Failed', message: 'Could not change visibility.' });
    }
  };

  const setAsFeatured = async (alb: AlbumAdminItem) => {
    try {
      await updateAlbum(alb.id, { is_featured: true });
      addToast({
        type: 'success',
        title: 'Featured Album Set',
        message: `"${alb.title}" is now showcased as the hero album spread.`,
      });
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Update Failed', message: 'Could not set as featured.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAlbum(deleteTarget.id);
      addToast({ type: 'success', title: 'Album Deleted', message: 'Album spread removed.' });
      setDeleteTarget(null);
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Could not delete album.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Handcrafted Albums Catalog</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage high-end physical album spreads displayed on the public website.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/15"
        >
          <Plus className="w-4 h-4" />
          <span>New Album Spread</span>
        </button>
      </div>

      {loading ? (
        <CardSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : albums.length === 0 ? (
        <EmptyState
          title="No Albums Created"
          description="Start building your handcrafted album catalog by creating your first showcase."
          actionLabel="Create Album"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((alb) => {
            const isFeatured = Boolean(alb.is_featured);
            const isVisible = Boolean(alb.is_visible);

            return (
              <div
                key={alb.id}
                className={`bg-[#141414] border rounded overflow-hidden flex flex-col transition-all duration-300 shadow-xl group ${
                  isFeatured
                    ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30'
                    : 'border-neutral-800 hover:border-[#D4AF37]/50'
                }`}
              >
                {/* Cover Asset Preview */}
                <div
                  onClick={() => setPreviewMedia({ url: alb.cover, title: alb.title })}
                  className="relative aspect-[16/10] bg-neutral-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={alb.cover}
                    alt={alb.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {isFeatured && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#D4AF37] text-black shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Public Showcase Hero</span>
                      </span>
                    )}
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40">
                      {alb.badge_or_tag || 'Spread'}
                    </span>
                  </div>

                  {!isVisible && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                      <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold flex items-center gap-1.5">
                        <EyeOff className="w-4 h-4 text-amber-400" />
                        <span>Draft / Hidden</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#D4AF37] font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{alb.photos_count} Curated Photos</span>
                      </span>
                      <span className="text-neutral-500 font-mono text-[10px]">{alb.id}</span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {alb.title}
                    </h4>

                    {alb.subtitle && (
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {alb.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {!isFeatured && (
                        <button
                          onClick={() => setAsFeatured(alb)}
                          className="text-[11px] text-neutral-400 hover:text-[#D4AF37] transition-colors"
                          title="Set as featured hero album"
                        >
                          Feature
                        </button>
                      )}
                      <button
                        onClick={() => toggleVisibility(alb)}
                        className={`text-[11px] transition-colors ${
                          isVisible ? 'text-neutral-400 hover:text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {isVisible ? 'Hide' : 'Publish'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(alb)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                        title="Edit album"
                        aria-label="Edit album"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(alb)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-red-950/20 transition-colors"
                        title="Delete album"
                        aria-label="Delete album"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
        title={editingAlbum ? 'Edit Handcrafted Album' : 'Create New Album Spread'}
        subtitle="Manage public album cover, details, and features"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Album Title *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Royal Mandap & Grand Vows"
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
              placeholder="Handcrafted with gold foiling and archival fine-art paper..."
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Photos Count
              </label>
              <input
                type="number"
                min={1}
                value={formPhotosCount}
                onChange={(e) => setFormPhotosCount(parseInt(e.target.value) || 0)}
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Badge / Tag
              </label>
              <input
                type="text"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                placeholder="e.g. Traditional Wedding Spread"
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Cover Uploader */}
          <ImageUploader
            currentUrl={formCover}
            onUploadSuccess={(url) => setFormCover(url)}
            acceptType="image"
            label="Album Cover Photo *"
          />

          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="album_featured"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <label htmlFor="album_featured" className="text-xs text-neutral-300 font-medium cursor-pointer">
                Set as Featured Main Album (Promoted at top of public albums section)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="album_visible"
                checked={formVisible}
                onChange={(e) => setFormVisible(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <label htmlFor="album_visible" className="text-xs text-neutral-300 font-medium cursor-pointer">
                Visible on Public Website
              </label>
            </div>
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
              {isSubmitting ? 'Saving...' : editingAlbum ? 'Save Changes' : 'Create Album'}
            </button>
          </div>
        </form>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Album?"
        message={`Are you sure you want to remove album "${deleteTarget?.title}"?`}
        confirmLabel="Delete Album"
        isDangerous={true}
      />

      {/* Media Preview */}
      {previewMedia && (
        <MediaPreviewModal
          isOpen={!!previewMedia}
          onClose={() => setPreviewMedia(null)}
          url={previewMedia.url}
          title={previewMedia.title}
        />
      )}
    </div>
  );
};
