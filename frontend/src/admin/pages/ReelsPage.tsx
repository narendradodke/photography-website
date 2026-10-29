import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  EyeOff,
  Video,
  Clock,
} from 'lucide-react';
import {
  getAdminReels,
  createReel,
  updateReel,
  deleteReel,
} from '../services/adminApi';
import type { ReelAdminItem } from '../types';
import { FormModal } from '../components/FormModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { MediaPreviewModal } from '../components/MediaPreviewModal';
import { ImageUploader } from '../components/ImageUploader';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useAdminAuthStore } from '../store/authStore';

export const ReelsPage: React.FC = () => {
  const [reels, setReels] = useState<ReelAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<ReelAdminItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReelAdminItem | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string } | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Weddings');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formCover, setFormCover] = useState('');
  const [formShortcode, setFormShortcode] = useState('');
  const [formDuration, setFormDuration] = useState('0:45');
  const [formVisible, setFormVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useAdminAuthStore();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminReels();
      setReels(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to retrieve cinematics and reels.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingReel(null);
    setFormTitle('');
    setFormCategory('Weddings');
    setFormVideoUrl('');
    setFormCover('');
    setFormShortcode('');
    setFormDuration('0:45');
    setFormVisible(true);
    setIsFormOpen(true);
  };

  const openEditModal = (reel: ReelAdminItem) => {
    setEditingReel(reel);
    setFormTitle(reel.title);
    setFormCategory(reel.category);
    setFormVideoUrl(reel.video_url || '');
    setFormCover(reel.cover || '');
    setFormShortcode(reel.shortcode || '');
    setFormDuration(reel.duration || '0:45');
    setFormVisible(!!reel.is_visible);
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
    setIsSubmitting(true);
    try {
      const embedUrl = formShortcode
        ? `https://www.instagram.com/reel/${formShortcode}/embed/`
        : '';
      const url = formShortcode
        ? `https://www.instagram.com/reel/${formShortcode}/`
        : '';

      if (editingReel) {
        await updateReel(editingReel.id, {
          title: formTitle,
          category: formCategory,
          video_url: formVideoUrl,
          cover: formCover,
          shortcode: formShortcode,
          embed_url: embedUrl,
          url: url,
          duration: formDuration,
          is_visible: formVisible,
        });
        addToast({ type: 'success', title: 'Reel Updated', message: 'Video details saved.' });
      } else {
        await createReel({
          title: formTitle,
          category: formCategory,
          video_url: formVideoUrl,
          cover: formCover,
          shortcode: formShortcode,
          embed_url: embedUrl,
          url: url,
          duration: formDuration,
          is_visible: formVisible,
        });
        addToast({ type: 'success', title: 'Reel Created', message: 'New cinematic reel published.' });
      }
      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err?.response?.data?.detail || 'Failed to save video reel.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVisibility = async (reel: ReelAdminItem) => {
    const nextState = !reel.is_visible;
    try {
      await updateReel(reel.id, { is_visible: nextState });
      addToast({
        type: 'info',
        title: 'Visibility Changed',
        message: `Reel "${reel.title}" is now ${nextState ? 'visible' : 'hidden'}.`,
      });
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Update Failed', message: 'Could not update visibility.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteReel(deleteTarget.id);
      addToast({ type: 'success', title: 'Reel Deleted', message: 'Video removed from gallery.' });
      setDeleteTarget(null);
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Could not delete reel.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Cinematics & Video Reels</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage high-energy portrait reels and wedding teaser clips.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/15"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Reel</span>
        </button>
      </div>

      {loading ? (
        <CardSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : reels.length === 0 ? (
        <EmptyState
          title="No Video Reels"
          description="Upload mp4 reels or configure Instagram shortcodes for cinematic showcases."
          actionLabel="Add Reel"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {reels.map((reel) => {
            const isVisible = Boolean(reel.is_visible);

            return (
              <div
                key={reel.id}
                className="bg-[#141414] border border-neutral-800 rounded overflow-hidden flex flex-col group hover:border-[#D4AF37]/50 transition-all duration-300 shadow-lg"
              >
                {/* Video / Reel Preview Thumbnail Card */}
                <div
                  onClick={() => {
                    if (reel.video_url) {
                      setPreviewVideo({ url: reel.video_url, title: reel.title });
                    } else if (reel.url) {
                      window.open(reel.url, '_blank');
                    }
                  }}
                  className="relative aspect-[9/16] bg-neutral-900 overflow-hidden cursor-pointer flex items-center justify-center"
                >
                  {reel.video_url ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video
                        src={`${reel.video_url}#t=0.001`}
                        poster={reel.cover || reel.video_url.replace(/\.mp4$/i, '-poster.jpg')}
                        preload="metadata"
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-black/70 border border-[#D4AF37]/60 text-[#D4AF37] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                          <Play className="w-4 h-4 ml-0.5 fill-current" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-500">
                      <Video className="w-10 h-10 text-[#D4AF37] mb-2" />
                      <span className="text-xs uppercase tracking-wider">Instagram Reel</span>
                      <span className="text-[10px] text-neutral-600 font-mono mt-1">{reel.shortcode}</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40">
                      {reel.category}
                    </span>
                  </div>

                  {reel.duration && (
                    <div className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded bg-black/80 text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{reel.duration}</span>
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3.5 rounded-full bg-[#D4AF37] text-black shadow-xl scale-95 group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {!isVisible && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                      <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold flex items-center gap-1.5">
                        <EyeOff className="w-4 h-4 text-amber-400" />
                        <span>Hidden</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {reel.title}
                    </h4>
                    <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">{reel.id}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleVisibility(reel)}
                      className={`text-[11px] ${
                        isVisible ? 'text-neutral-400 hover:text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {isVisible ? 'Hide' : 'Publish'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(reel)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                        title="Edit reel"
                        aria-label="Edit reel"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(reel)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-red-950/20 transition-colors"
                        title="Delete reel"
                        aria-label="Delete reel"
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
        title={editingReel ? 'Edit Video Reel' : 'Add New Video Reel'}
        subtitle="Upload mp4 file or link Instagram shortcode"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Reel Title *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Pure Joy & Candid Vows"
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Weddings">Weddings</option>
                <option value="Bridal">Bridal</option>
                <option value="Ceremony">Ceremony</option>
                <option value="Festivities">Festivities</option>
                <option value="Portraits">Portraits</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Duration (MM:SS)
              </label>
              <input
                type="text"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                placeholder="0:45"
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Video Uploader */}
          <ImageUploader
            currentUrl={formVideoUrl}
            onUploadSuccess={(url) => setFormVideoUrl(url)}
            acceptType="video"
            label="Video File Asset (MP4/WebM)"
          />

          {/* Cover / Poster Uploader */}
          <ImageUploader
            currentUrl={formCover}
            onUploadSuccess={(url) => setFormCover(url)}
            label="Custom Poster Thumbnail (Optional)"
          />

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Instagram Reel Shortcode (Optional)
            </label>
            <input
              type="text"
              value={formShortcode}
              onChange={(e) => setFormShortcode(e.target.value)}
              placeholder="e.g. DZgrPl8Cotn"
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Found at the end of the Instagram URL: instagram.com/reel/<b>DZgrPl8Cotn</b>/
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formVisible}
                onChange={(e) => setFormVisible(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <span className="text-xs text-neutral-300 font-medium">
                Visible on Public Website
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
              {isSubmitting ? 'Saving...' : editingReel ? 'Save Changes' : 'Create Reel'}
            </button>
          </div>
        </form>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Reel?"
        message={`Are you sure you want to remove reel "${deleteTarget?.title}"?`}
        confirmLabel="Delete Reel"
        isDangerous={true}
      />

      {/* Video Preview */}
      {previewVideo && (
        <MediaPreviewModal
          isOpen={!!previewVideo}
          onClose={() => setPreviewVideo(null)}
          url={previewVideo.url}
          title={previewVideo.title}
          isVideo={true}
        />
      )}
    </div>
  );
};
