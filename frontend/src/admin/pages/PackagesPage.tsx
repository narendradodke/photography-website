import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import {
  getAdminPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from '../services/adminApi';
import type { PackageAdminItem } from '../types';
import { FormModal } from '../components/FormModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useAdminAuthStore } from '../store/authStore';

export const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<PackageAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageAdminItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PackageAdminItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formPriceNum, setFormPriceNum] = useState<number>(25000);
  const [formPopular, setFormPopular] = useState(false);
  const [formActive, setFormActive] = useState(true);
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useAdminAuthStore();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminPackages();
      setPackages(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to retrieve packages.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPkg(null);
    setFormName('');
    setFormTagline('');
    setFormPriceNum(25000);
    setFormPopular(false);
    setFormActive(true);
    setFormFeatures([
      'Full Day Coverage',
      '500+ Edited Photos',
      'High-Resolution Delivery',
      'Online Gallery Access',
    ]);
    setIsFormOpen(true);
  };

  const openEditModal = (pkg: PackageAdminItem) => {
    setEditingPkg(pkg);
    setFormName(pkg.name);
    setFormTagline(pkg.tagline);
    setFormPriceNum(pkg.price_num || pkg.priceNum || 0);
    setFormPopular(!!pkg.popular);
    setFormActive(!!pkg.is_active);
    setFormFeatures([...(pkg.features || [])]);
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

  const addFeature = () => {
    if (newFeatureText.trim()) {
      setFormFeatures([...formFeatures, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const removeFeature = (index: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formFeatures.length === 0) {
      addToast({ type: 'error', title: 'Inclusions Required', message: 'Add at least one package inclusion/feature.' });
      return;
    }

    setIsSubmitting(true);
    const formattedPrice = `₹${formPriceNum.toLocaleString('en-IN')}`;

    try {
      if (editingPkg) {
        await updatePackage(editingPkg.id, {
          name: formName,
          tagline: formTagline,
          price: formattedPrice,
          price_num: formPriceNum,
          popular: formPopular,
          features: formFeatures,
          is_active: formActive,
        });
        addToast({ type: 'success', title: 'Package Updated', message: 'Package pricing updated.' });
      } else {
        await createPackage({
          name: formName,
          tagline: formTagline,
          price: formattedPrice,
          price_num: formPriceNum,
          popular: formPopular,
          features: formFeatures,
          is_active: formActive,
        });
        addToast({ type: 'success', title: 'Package Created', message: 'New package tier published.' });
      }
      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err?.response?.data?.detail || 'Failed to save package.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (pkg: PackageAdminItem) => {
    const nextState = !pkg.is_active;
    try {
      await updatePackage(pkg.id, { is_active: nextState });
      addToast({
        type: 'info',
        title: 'Package Status Changed',
        message: `Package "${pkg.name}" is now ${nextState ? 'active' : 'inactive'}.`,
      });
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Update Failed', message: 'Could not toggle package.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePackage(deleteTarget.id);
      addToast({ type: 'success', title: 'Package Removed', message: 'Package tier deleted.' });
      setDeleteTarget(null);
      loadData();
    } catch {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Could not delete package.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Investment & Photography Packages</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure rates, deliverable inclusions, and featured options on the public booking page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/15"
        >
          <Plus className="w-4 h-4" />
          <span>Add Package Tier</span>
        </button>
      </div>

      {loading ? (
        <CardSkeleton count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : packages.length === 0 ? (
        <EmptyState
          title="No Packages Configured"
          description="Create client pricing packages to enable seamless shoot bookings."
          actionLabel="Create Package"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const isPopular = Boolean(pkg.popular);
            const isActive = Boolean(pkg.is_active);

            return (
              <div
                key={pkg.id}
                className={`bg-[#141414] border rounded-lg p-6 flex flex-col justify-between transition-all duration-300 relative shadow-xl group ${
                  isPopular
                    ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/40 shadow-[#D4AF37]/5'
                    : 'border-neutral-800 hover:border-neutral-700'
                } ${!isActive ? 'opacity-60 bg-neutral-900/50' : ''}`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D4AF37] text-black shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {pkg.name}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 min-h-[32px] leading-relaxed">
                        {pkg.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(pkg)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                        title="Edit package"
                        aria-label="Edit package"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(pkg)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-red-950/20 transition-colors"
                        title="Delete package"
                        aria-label="Delete package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="my-6 pb-6 border-b border-neutral-800">
                    <span className="font-serif text-3xl font-extrabold text-white">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-neutral-500 ml-2">/ event package</span>
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                      Package Deliverables:
                    </span>
                    <ul className="space-y-2">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                          <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Switch */}
                <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-neutral-500 font-mono">{pkg.id}</span>
                  <button
                    onClick={() => toggleActive(pkg)}
                    className={`text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                      isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{isActive ? 'Live on Site' : 'Disabled (Hidden)'}</span>
                  </button>
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
        title={editingPkg ? 'Edit Package Tier' : 'Create Package Tier'}
        subtitle="Specify price, deliverables, and popular highlights"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Package Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Royal Heritage Collection"
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Tagline / Target Audience *
            </label>
            <input
              type="text"
              required
              value={formTagline}
              onChange={(e) => setFormTagline(e.target.value)}
              placeholder="e.g. Best choice for 2-day destination weddings"
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Package Price (₹ INR) *
            </label>
            <input
              type="number"
              min={0}
              required
              value={formPriceNum}
              onChange={(e) => setFormPriceNum(parseInt(e.target.value) || 0)}
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Formatted preview: <b>₹{formPriceNum.toLocaleString('en-IN')}</b>
            </p>
          </div>

          {/* Features Builder */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Included Services & Deliverables *
            </label>
            <div className="flex items-center gap-2 mb-2.5">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="e.g. 8 Hours Full Coverage"
                className="flex-1 bg-[#181818] border border-neutral-700 text-white px-3.5 py-2 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded uppercase tracking-wider"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {formFeatures.map((feat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800 text-xs"
                >
                  <span className="text-neutral-300">{feat}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-neutral-500 hover:text-red-400 p-1"
                    aria-label="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formPopular}
                onChange={(e) => setFormPopular(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <span className="text-xs text-neutral-300 font-medium">
                Mark as "Most Popular" (Highlighted tier)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formActive}
                onChange={(e) => setFormActive(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <span className="text-xs text-neutral-300 font-medium">
                Active on Website (Allow client reservations)
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
              {isSubmitting ? 'Saving...' : editingPkg ? 'Save Changes' : 'Create Package'}
            </button>
          </div>
        </form>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Package Tier?"
        message={`Are you sure you want to remove package "${deleteTarget?.name}"?`}
        confirmLabel="Delete Package"
        isDangerous={true}
      />
    </div>
  );
};
