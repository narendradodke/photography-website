import React, { useState } from 'react';
import { Camera, ArrowRight, CheckCircle2 } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TwitterIcon } from '../ui/SocialIcons';
import { NAV_LINKS, SITE_NAME, TAGLINE, SOCIAL_LINKS } from '../../utils/constants';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#080808] dark:bg-[#080808] light:bg-[#EEEEEE] border-t border-neutral-800 dark:border-neutral-800 light:border-neutral-300 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-neutral-800 dark:border-neutral-800 light:border-neutral-300">
          {/* Brand Col */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full border border-[#D4AF37]/50">
                <Camera className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <span className="font-serif text-2xl font-bold text-white dark:text-white light:text-neutral-900">
                {SITE_NAME}
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-medium mb-4">
              {TAGLINE}
            </p>
            <p className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed mb-6">
              Capturing eternal emotions, intimate silhouettes, and high-fashion editorial weddings across India and exotic destinations worldwide.
            </p>
            <div className="flex items-center gap-3 text-neutral-400">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all" aria-label="Instagram">
                <InstagramIcon size={16} />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all" aria-label="YouTube">
                <YoutubeIcon size={16} />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all" aria-label="Facebook">
                <FacebookIcon size={16} />
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all" aria-label="Twitter">
                <TwitterIcon size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-6">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
              <li>Wedding Photography</li>
              <li>Editorial & Fine Art Portraits</li>
              <li>Cinematic Films & Teasers</li>
              <li>Pre-Wedding Destination Shoots</li>
              <li>Handcrafted Fine-Art Albums</li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
              Exclusive Journal
            </h4>
            <p className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-4">
              Subscribe to receive private photography journals, season discounts, and behind-the-scenes stories.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[#D4AF37] text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#181818] dark:bg-[#181818] light:bg-white text-xs px-4 py-3 border border-[#333333] dark:border-[#333333] light:border-neutral-400 text-white dark:text-white light:text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="bg-[#D4AF37] text-black px-4 py-3 hover:bg-[#E6C558] transition-colors shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} {SITE_NAME} — Arjun Sharma. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-neutral-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-neutral-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
