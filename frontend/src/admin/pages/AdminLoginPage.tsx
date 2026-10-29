import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAdminAuthStore } from '../store/authStore';
import { SITE_NAME, PHOTOGRAPHER_NAME, TAGLINE } from '../../utils/constants';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(username.trim(), password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background Subtle Gradient & Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#070707] to-[#070707] pointer-events-none"></div>

      {/* Decorative Gold Glow Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 mb-4 shadow-xl shadow-[#D4AF37]/10">
            <Camera className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-1">
            {SITE_NAME}
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            {PHOTOGRAPHER_NAME} · Admin Workspace
          </p>
          <p className="text-xs text-neutral-500 mt-2 tracking-wide font-sans">
            {TAGLINE}
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#121212] border border-neutral-800 rounded shadow-2xl p-8 backdrop-blur-md relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/50 rounded text-red-200 text-xs leading-relaxed">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                Administrator Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#181818] border border-neutral-700 text-white placeholder-neutral-600 text-sm pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                Secure Key / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181818] border border-neutral-700 text-white placeholder-neutral-600 text-sm pl-10 pr-10 py-3 rounded focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 p-0.5"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In To Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center gap-3 text-[11px] text-neutral-500">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <p className="leading-tight">
              Authorized access only. All administrative logins and modifications are cryptographically audited.
            </p>
          </div>
        </div>

        {/* Back to Public Website */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-neutral-400 hover:text-[#D4AF37] transition-colors uppercase tracking-widest inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Portfolio</span>
          </a>
        </div>
      </div>
    </div>
  );
};

