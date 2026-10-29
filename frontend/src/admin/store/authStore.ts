import { create } from 'zustand';
import type { AdminUser, ToastMessage } from '../types';
import { loginAdmin, getAdminProfile, logoutAdmin } from '../services/adminApi';

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  toasts: ToastMessage[];

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearError: () => void;
}

export const useAdminAuthStore = create<AuthState>((set, get) => {
  // Initialize from localStorage
  const savedToken = localStorage.getItem('lensframe_admin_token');
  let savedUser: AdminUser | null = null;
  try {
    const rawUser = localStorage.getItem('lensframe_admin_user');
    if (rawUser) savedUser = JSON.parse(rawUser);
  } catch {
    savedUser = null;
  }

  return {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedToken,
    isLoading: false,
    error: null,
    toasts: [],

    login: async (username: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const { token, admin } = await loginAdmin(username, password);
        localStorage.setItem('lensframe_admin_token', token);
        localStorage.setItem('lensframe_admin_user', JSON.stringify(admin));
        set({
          token,
          user: admin,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        get().addToast({
          type: 'success',
          title: 'Welcome Back',
          message: `Logged in as ${admin.full_name || admin.username}`,
        });
        return true;
      } catch (err: any) {
        let msg = 'Failed to authenticate. Please verify your credentials.';
        if (!err.response) {
          msg = 'Cannot connect to backend server (http://localhost:8000). Please make sure the FastAPI backend is running.';
        } else if (typeof err.response.data?.detail === 'string') {
          msg = err.response.data.detail;
        } else if (Array.isArray(err.response.data?.detail)) {
          msg = err.response.data.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        } else if (typeof err.response.data?.message === 'string') {
          msg = err.response.data.message;
        } else if (typeof err.response.data?.error === 'string') {
          msg = err.response.data.error;
        } else if (err.response.status === 401) {
          msg = 'Invalid username or password. Please verify your credentials.';
        } else if (err.response.status === 429) {
          msg = 'Too many failed login attempts. Please wait 5 minutes before trying again.';
        } else if (err.response.status === 403) {
          msg = 'Access denied. Account disabled or insufficient privileges.';
        }
        set({ error: msg, isLoading: false, isAuthenticated: false, user: null, token: null });
        get().addToast({
          type: 'error',
          title: !err.response ? 'Server Unreachable' : 'Authentication Failed',
          message: msg,
        });
        return false;
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        await logoutAdmin();
      } finally {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        get().addToast({
          type: 'info',
          title: 'Logged Out',
          message: 'You have been securely signed out.',
        });
      }
    },

    checkAuth: async () => {
      const currentToken = localStorage.getItem('lensframe_admin_token');
      if (!currentToken) {
        set({ isAuthenticated: false, user: null, token: null });
        return false;
      }

      set({ isLoading: true });
      try {
        const profile = await getAdminProfile();
        localStorage.setItem('lensframe_admin_user', JSON.stringify(profile));
        set({
          user: profile,
          token: currentToken,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } catch {
        localStorage.removeItem('lensframe_admin_token');
        localStorage.removeItem('lensframe_admin_user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return false;
      }
    },

    addToast: (toast) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { ...toast, id };
      set((state) => ({ toasts: [...state.toasts, newToast] }));

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },

    removeToast: (id) => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },

    clearError: () => set({ error: null }),
  };
});

