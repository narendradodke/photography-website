import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Share2,
  Image as ImageIcon,
  Search,
  Mail,
  Shield,
  Save,
  KeyRound,
} from 'lucide-react';
import {
  getWebsiteSettings,
  updateWebsiteSettings,
  changeAdminPassword,
} from '../services/adminApi';
import { useAdminAuthStore } from '../store/authStore';

type SettingsTab = 'general' | 'social' | 'gallery' | 'seo' | 'email' | 'security';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { addToast } = useAdminAuthStore();

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWebsiteSettings();
      setSettings(data);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Settings Error',
        message: err?.response?.data?.detail || 'Failed to retrieve website settings.',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveTab = async (category: string, keys: string[]) => {
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {};
      keys.forEach((k) => {
        if (settings[k] !== undefined) {
          payload[k] = settings[k];
        }
      });
      await updateWebsiteSettings(category, payload);
      addToast({
        type: 'success',
        title: 'Settings Saved',
        message: `${category.toUpperCase()} website preferences have been updated.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err?.response?.data?.detail || 'Failed to update settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      addToast({
        type: 'success',
        title: 'Security Updated',
        message: 'Your administrator password has been updated.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err?.response?.data?.detail || 'Failed to update password.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: Array<{ id: SettingsTab; label: string; icon: any }> = [
    { id: 'general', label: 'General & Studio', icon: Globe },
    { id: 'social', label: 'Social Channels', icon: Share2 },
    { id: 'gallery', label: 'Gallery Options', icon: ImageIcon },
    { id: 'seo', label: 'Search & SEO', icon: Search },
    { id: 'email', label: 'Notification Mail', icon: Mail },
    { id: 'security', label: 'Security & Access', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h3 className="font-serif text-lg font-bold text-white">Website & Studio Settings</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure live public information, social links, SEO tags, and security preferences.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#D4AF37] text-black font-semibold shadow-md shadow-[#D4AF37]/15'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Forms Card */}
      <div className="bg-[#141414] border border-neutral-800 rounded p-6 sm:p-8 max-w-4xl shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-500 uppercase tracking-widest">
            Loading studio configuration...
          </div>
        ) : (
          <>
            {/* 1. GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h4 className="font-serif text-base font-bold text-white">General Studio Details</h4>
                  <p className="text-xs text-neutral-400">Website identity and primary contact points.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Website Name
                    </label>
                    <input
                      type="text"
                      value={settings.site_name || 'LensFrame'}
                      onChange={(e) => handleChange('site_name', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Photographer Name
                    </label>
                    <input
                      type="text"
                      value={settings.photographer_name || 'Arjun Sharma'}
                      onChange={(e) => handleChange('photographer_name', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline || 'Capture · Create · Forever'}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Direct Telephone
                    </label>
                    <input
                      type="text"
                      value={settings.phone || '+91 98765 43210'}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Inquiry Email
                    </label>
                    <input
                      type="email"
                      value={settings.email || 'arjun@lensframe.com'}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Studio Location
                    </label>
                    <input
                      type="text"
                      value={settings.location || 'Indore, Madhya Pradesh'}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      value={settings.hours || 'Mon - Sun, 9:00 AM - 8:00 PM'}
                      onChange={(e) => handleChange('hours', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                    Studio Bio / Editorial Statement
                  </label>
                  <textarea
                    rows={3}
                    value={settings.bio || ''}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() =>
                      handleSaveTab('general', [
                        'site_name',
                        'photographer_name',
                        'tagline',
                        'phone',
                        'email',
                        'hours',
                        'location',
                        'availability',
                        'bio',
                      ])
                    }
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save General Settings'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. SOCIAL TAB */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h4 className="font-serif text-base font-bold text-white">Social Media Links</h4>
                  <p className="text-xs text-neutral-400">Live URLs linked in navbar and footer icons.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={settings.instagram || 'https://instagram.com'}
                      onChange={(e) => handleChange('instagram', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      YouTube Channel URL
                    </label>
                    <input
                      type="url"
                      value={settings.youtube || 'https://youtube.com'}
                      onChange={(e) => handleChange('youtube', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={settings.facebook || 'https://facebook.com'}
                      onChange={(e) => handleChange('facebook', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      WhatsApp Quick Link or Number
                    </label>
                    <input
                      type="text"
                      value={settings.whatsapp || '+919876543210'}
                      onChange={(e) => handleChange('whatsapp', e.target.value)}
                      placeholder="+919876543210"
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() =>
                      handleSaveTab('social', ['instagram', 'youtube', 'facebook', 'twitter', 'whatsapp'])
                    }
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Social Channels'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h4 className="font-serif text-base font-bold text-white">Gallery Display Options</h4>
                  <p className="text-xs text-neutral-400">Settings controlling public photo gallery presentation.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Default Gallery Category
                    </label>
                    <select
                      value={settings.default_category || 'all'}
                      onChange={(e) => handleChange('default_category', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="all">All Work</option>
                      <option value="weddings">Weddings</option>
                      <option value="haldi">Haldi</option>
                      <option value="mehndi">Mehndi</option>
                      <option value="baby-shoot">Baby Shoot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Items Display Limit
                    </label>
                    <input
                      type="number"
                      value={settings.items_per_page || '24'}
                      onChange={(e) => handleChange('items_per_page', e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enable_lightbox === 'true'}
                      onChange={(e) => handleChange('enable_lightbox', e.target.checked ? 'true' : 'false')}
                      className="w-4 h-4 accent-[#D4AF37] rounded"
                    />
                    <span className="text-xs text-neutral-300 font-medium">
                      Enable Full-Screen High-Resolution Lightbox Modal
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() =>
                      handleSaveTab('gallery', ['default_category', 'items_per_page', 'enable_lightbox'])
                    }
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Gallery Preferences'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. SEO TAB */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h4 className="font-serif text-base font-bold text-white">Search Engine Optimization (SEO)</h4>
                  <p className="text-xs text-neutral-400">Metadata for search engines, Google indexing, and Open Graph previews.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                    Meta Page Title
                  </label>
                  <input
                    type="text"
                    value={settings.meta_title || 'LensFrame — Arjun Sharma Photography'}
                    onChange={(e) => handleChange('meta_title', e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.meta_description || ''}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                    SEO Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={settings.meta_keywords || ''}
                    onChange={(e) => handleChange('meta_keywords', e.target.value)}
                    placeholder="wedding photographer, destination wedding, indore, rajasthan"
                    className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                    Open Graph Share Image URL
                  </label>
                  <input
                    type="text"
                    value={settings.og_image || '/images/portfolio/insta-2.webp'}
                    onChange={(e) => handleChange('og_image', e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() =>
                      handleSaveTab('seo', ['meta_title', 'meta_description', 'meta_keywords', 'og_image'])
                    }
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save SEO Settings'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 5. EMAIL TAB */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h4 className="font-serif text-base font-bold text-white">Email & Notification Alerts</h4>
                  <p className="text-xs text-neutral-400">Settings for alerts when bookings or inquiries arrive.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                    Studio Notification Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.notify_email || 'arjun@lensframe.com'}
                    onChange={(e) => handleChange('notify_email', e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.send_admin_alert === 'true'}
                      onChange={(e) => handleChange('send_admin_alert', e.target.checked ? 'true' : 'false')}
                      className="w-4 h-4 accent-[#D4AF37] rounded"
                    />
                    <span className="text-xs text-neutral-300 font-medium">
                      Notify Studio Administrator on new customer inquiry
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.send_customer_confirmation === 'true'}
                      onChange={(e) =>
                        handleChange('send_customer_confirmation', e.target.checked ? 'true' : 'false')
                      }
                      className="w-4 h-4 accent-[#D4AF37] rounded"
                    />
                    <span className="text-xs text-neutral-300 font-medium">
                      Send automated confirmation acknowledgment to client upon booking submission
                    </span>
                  </label>
                </div>

                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400">
                  <span className="font-semibold text-[#D4AF37] block mb-1">Server Mail Server (SMTP) Status:</span>
                  SMTP credentials are secure and configured via environment variables on the backend. No passwords or API keys are exposed to the browser.
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() =>
                      handleSaveTab('email', ['notify_email', 'send_admin_alert', 'send_customer_confirmation'])
                    }
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Notification Preferences'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 6. SECURITY TAB */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h4 className="font-serif text-base font-bold text-white">Security & Password Rotation</h4>
                  <p className="text-xs text-neutral-400">Update your administrator account password.</p>
                </div>

                {passwordError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-200 text-xs rounded">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      New Password * (Min 8 Characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/20 disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isSaving ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
