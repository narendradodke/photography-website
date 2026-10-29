import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Sparkles,
  Eye,
} from 'lucide-react';
import {
  getAdminPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../services/adminApi';
import type { PortfolioAdminItem } from '../types';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { FormModal } from '../components/FormModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { MediaPreviewModal } from '../components/MediaPreviewModal';
import { ImageUploader } from '../components/ImageUploader';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useAdminAuthStore } from '../store/authStore';

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Categories' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'haldi', label: 'Haldi' },
  { id: 'mehndi', label: 'Mehndi' },
  { id: 'baby-shoot', label: 'Baby Shoot' },
];

export const PortfolioPage: React.FC = () => {
  const [items, setItems] = useState<PortfolioAdminItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  // Modal States
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioAdminItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioAdminItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; title: string } | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('weddings');
  const [formImage, setFormImage] = useState('');
  const [formLocation, setFormLocation] = useState('Indore, MP');
  const [formDate, setFormDate] = useState('2025');
  const [formAspect, setFormAspect] = useState<'vertical' | 'horizontal' | 'square'>('vertical');
  const [formTags, setFormTags] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useAdminAuthStore();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminPortfolio(category, search, page, 24);
      setItems(res.items);
      setTotal(res.total);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to retrieve portfolio gallery items.');
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('weddings');
    setFormImage('');
    setFormLocation('Indore, MP');
    setFormDate('2025');
    setFormAspect('vertical');
    setFormTags('');
    setFormFeatured(false);
    setIsFormOpen(true);
  };

  const openEditModal = (item: PortfolioAdminItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormImage(item.image);
    setFormLocation(item.location);
    setFormDate(item.date);
    setFormAspect(item.aspect || 'vertical');
    setFormTags(item.tags || '');
    setFormFeatured(!!item.is_featured);
    setIsFormOpen(true);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open modal if URL query param ?action=add
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openCreateModal();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImage.trim()) {
      addToast({ type: 'error', title: 'Missing Media', message: 'Please upload an image file or provide a valid image URL.' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updatePortfolioItem(editingItem.id, {
          title: formTitle,
          category: formCategory,
          image: formImage,
          thumbnail: formImage,
          location: formLocation,
          date: formDate,
          aspect: formAspect,
          tags: formTags,
          is_featured: formFeatured,
        });
        addToast({ type: 'success', title: 'Portfolio Updated', message: 'Photo changes have been saved.' });
      } else {
        await createPortfolioItem({
          title: formTitle,
          category: formCategory,
          image: formImage,
          thumbnail: formImage,
          location: formLocation,
          date: formDate,
          aspect: formAspect,
          tags: formTags,
          is_featured: formFeatured,
        });
        addToast({ type: 'success', title: 'Photo Published', message: 'New photo added to the portfolio gallery.' });
      }
      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err?.response?.data?.detail || 'Could not save portfolio item.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePortfolioItem(deleteTarget.id);
      addToast({ type: 'success', title: 'Deleted', message: 'Portfolio item deleted successfully.' });
      setDeleteTarget(null);
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Failed to remove photo.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by title, location, tag..."
          className="w-full sm:max-w-xs"
        />

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
            Total Photos: <b className="text-white">{total}</b>
          </span>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/15"
          >
            <Plus className="w-4 h-4" />
            <span>Add Portfolio Photo</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <FilterPanel
        options={CATEGORY_OPTIONS}
        activeId={category}
        onSelect={(catId) => {
          setCategory(catId);
          setPage(1);
        }}
      />

      {/* Grid Content */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No Portfolio Items"
          description={search ? `No photos match query "${search}".` : 'No photos uploaded in this category yet.'}
          actionLabel="Add Photo Now"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-[#141414] border border-neutral-800 rounded overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col shadow-lg"
            >
              {/* Photo Image Card */}
              <div
                onClick={() => setPreviewMedia({ url: item.image, title: item.title })}
                className="relative aspect-[4/5] bg-neutral-900 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40">
                    {item.category}
                  </span>
                  {Boolean(item.is_featured) && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37] text-black shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                {/* Hover Quick Preview Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-2.5 rounded-full bg-[#D4AF37] text-black">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Metadata & Actions */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1.5">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      <span className="truncate max-w-[100px]">{item.location}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-3 mt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 font-mono capitalize">
                    {item.aspect || 'vertical'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                      title="Edit photo metadata"
                      aria-label="Edit photo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-red-950/20 transition-colors"
                      title="Delete photo"
                      aria-label="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? 'Edit Portfolio Memoir' : 'Add New Portfolio Photo'}
        subtitle="Manage gallery photo metadata and public visibility"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Photo Title *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Royal Heritage Red Lehenga"
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Category *
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="weddings">Weddings</option>
                <option value="haldi">Haldi</option>
                <option value="mehndi">Mehndi</option>
                <option value="baby-shoot">Baby Shoot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Aspect Ratio
              </label>
              <select
                value={formAspect}
                onChange={(e) => setFormAspect(e.target.value as any)}
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="vertical">Vertical (4:5)</option>
                <option value="horizontal">Horizontal (16:9)</option>
                <option value="square">Square (1:1)</option>
              </select>
            </div>
          </div>

          {/* Media Uploader */}
          <ImageUploader
            currentUrl={formImage}
            onUploadSuccess={(url) => setFormImage(url)}
            acceptType="image"
            label="Image Asset *"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="e.g. Udaipur, Rajasthan"
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Date / Year
              </label>
              <input
                type="text"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                placeholder="e.g. Jan 2025"
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              placeholder="e.g. bride, lehenga, heritage, sunset"
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Featured Toggle */}
          <div className="pt-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              checked={formFeatured}
              onChange={(e) => setFormFeatured(e.target.checked)}
              className="w-4 h-4 accent-[#D4AF37] rounded"
            />
            <label htmlFor="is_featured" className="text-xs text-neutral-300 font-medium cursor-pointer">
              Mark as Featured Portfolio Photo (Highlighted across the public site)
            </label>
          </div>

          {/* Submit Actions */}
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
              {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Publish Photo'}
            </button>
          </div>
        </form>
      </FormModal>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Portfolio Item?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This photo will be removed from the public website.`}
        confirmLabel="Delete Photo"
        isDangerous={true}
      />

      {/* Preview Modal */}
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
