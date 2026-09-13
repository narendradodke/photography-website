import { create } from 'zustand';
import type { PortfolioItem } from '../types/portfolio';

interface UIState {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  lightbox: {
    isOpen: boolean;
    currentIndex: number;
    items: PortfolioItem[];
  };
  openLightbox: (items: PortfolioItem[], index: number) => void;
  closeLightbox: () => void;
  nextLightbox: () => void;
  prevLightbox: () => void;

  selectedPackageId: string;
  setSelectedPackageId: (id: string) => void;
}

const getInitialTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('lensframe_theme');
    if (saved === 'light' || saved === 'dark') return saved;
  }
  return 'dark';
};

export const useUIStore = create<UIState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem('lensframe_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    set({ theme });
  },
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },

  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  lightbox: {
    isOpen: false,
    currentIndex: 0,
    items: [],
  },
  openLightbox: (items, index) =>
    set({
      lightbox: {
        isOpen: true,
        currentIndex: index,
        items,
      },
    }),
  closeLightbox: () =>
    set((state) => ({
      lightbox: { ...state.lightbox, isOpen: false },
    })),
  nextLightbox: () =>
    set((state) => {
      const { currentIndex, items } = state.lightbox;
      if (items.length === 0) return state;
      return {
        lightbox: {
          ...state.lightbox,
          currentIndex: (currentIndex + 1) % items.length,
        },
      };
    }),
  prevLightbox: () =>
    set((state) => {
      const { currentIndex, items } = state.lightbox;
      if (items.length === 0) return state;
      return {
        lightbox: {
          ...state.lightbox,
          currentIndex: (currentIndex - 1 + items.length) % items.length,
        },
      };
    }),

  selectedPackageId: 'premium',
  setSelectedPackageId: (id) => set({ selectedPackageId: id }),
}));
