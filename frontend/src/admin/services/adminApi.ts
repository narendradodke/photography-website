import axios, { type AxiosProgressEvent } from 'axios';
import type {
  AdminUser,
  DashboardStats,
  PortfolioAdminItem,
  AlbumAdminItem,
  ReelAdminItem,
  PackageAdminItem,
  TestimonialAdminItem,
  BookingRecord,
  ContactMessageRecord,
  ActivityLogRecord,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor to attach bearer token
adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lensframe_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401s
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      if (!window.location.pathname.includes('/admin/login')) {
        localStorage.removeItem('lensframe_admin_token');
        localStorage.removeItem('lensframe_admin_user');
        window.location.href = '/admin/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth APIs ---
export async function loginAdmin(username: string, password: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await adminApiClient.post('/auth/login', { username, password });
  return res.data;
}

export async function getAdminProfile(): Promise<AdminUser> {
  const res = await adminApiClient.get<AdminUser>('/auth/me');
  return res.data;
}

export async function changeAdminPassword(current_password: string, new_password: string): Promise<{ success: boolean; message: string }> {
  const res = await adminApiClient.post('/auth/change-password', { current_password, new_password });
  return res.data;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await adminApiClient.post('/auth/logout');
  } catch {
    // Ignore error during logout
  } finally {
    localStorage.removeItem('lensframe_admin_token');
    localStorage.removeItem('lensframe_admin_user');
  }
}

// --- Dashboard ---
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await adminApiClient.get<DashboardStats>('/admin/dashboard/stats');
  return res.data;
}

export async function getActivityLogs(limit = 30): Promise<ActivityLogRecord[]> {
  const res = await adminApiClient.get<ActivityLogRecord[]>(`/admin/activity?limit=${limit}`);
  return res.data;
}

// --- Portfolio ---
export async function getAdminPortfolio(
  category?: string,
  search?: string,
  page = 1,
  pageSize = 24
): Promise<{ items: PortfolioAdminItem[]; total: number; page: number; page_size: number }> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());

  const res = await adminApiClient.get(`/admin/portfolio?${params.toString()}`);
  return res.data;
}

export async function createPortfolioItem(data: Partial<PortfolioAdminItem>): Promise<{ success: boolean; id: string }> {
  const res = await adminApiClient.post('/admin/portfolio', data);
  return res.data;
}

export async function updatePortfolioItem(id: string, data: Partial<PortfolioAdminItem>): Promise<{ success: boolean }> {
  const res = await adminApiClient.put(`/admin/portfolio/${id}`, data);
  return res.data;
}

export async function deletePortfolioItem(id: string): Promise<{ success: boolean }> {
  const res = await adminApiClient.delete(`/admin/portfolio/${id}`);
  return res.data;
}

export async function reorderPortfolio(orderedIds: string[]): Promise<{ success: boolean }> {
  const res = await adminApiClient.post('/admin/portfolio/reorder', { ordered_ids: orderedIds });
  return res.data;
}

// --- Albums ---
export async function getAdminAlbums(): Promise<AlbumAdminItem[]> {
  const res = await adminApiClient.get<AlbumAdminItem[]>('/admin/albums');
  return res.data;
}

export async function createAlbum(data: Partial<AlbumAdminItem>): Promise<{ success: boolean; id: string }> {
  const res = await adminApiClient.post('/admin/albums', data);
  return res.data;
}

export async function updateAlbum(id: string, data: Partial<AlbumAdminItem>): Promise<{ success: boolean }> {
  const res = await adminApiClient.put(`/admin/albums/${id}`, data);
  return res.data;
}

export async function deleteAlbum(id: string): Promise<{ success: boolean }> {
  const res = await adminApiClient.delete(`/admin/albums/${id}`);
  return res.data;
}

// --- Reels ---
export async function getAdminReels(): Promise<ReelAdminItem[]> {
  const res = await adminApiClient.get<ReelAdminItem[]>('/admin/reels');
  return res.data;
}

export async function createReel(data: Partial<ReelAdminItem>): Promise<{ success: boolean; id: string }> {
  const res = await adminApiClient.post('/admin/reels', data);
  return res.data;
}

export async function updateReel(id: string, data: Partial<ReelAdminItem>): Promise<{ success: boolean }> {
  const res = await adminApiClient.put(`/admin/reels/${id}`, data);
  return res.data;
}

export async function deleteReel(id: string): Promise<{ success: boolean }> {
  const res = await adminApiClient.delete(`/admin/reels/${id}`);
  return res.data;
}

// --- Packages ---
export async function getAdminPackages(): Promise<PackageAdminItem[]> {
  const res = await adminApiClient.get<PackageAdminItem[]>('/admin/packages');
  return res.data;
}

export async function createPackage(data: Partial<PackageAdminItem>): Promise<{ success: boolean; id: string }> {
  const res = await adminApiClient.post('/admin/packages', data);
  return res.data;
}

export async function updatePackage(id: string, data: Partial<PackageAdminItem>): Promise<{ success: boolean }> {
  const res = await adminApiClient.put(`/admin/packages/${id}`, data);
  return res.data;
}

export async function deletePackage(id: string): Promise<{ success: boolean }> {
  const res = await adminApiClient.delete(`/admin/packages/${id}`);
  return res.data;
}

// --- Testimonials ---
export async function getAdminTestimonials(): Promise<TestimonialAdminItem[]> {
  const res = await adminApiClient.get<TestimonialAdminItem[]>('/admin/testimonials');
  return res.data;
}

export async function createTestimonial(data: Partial<TestimonialAdminItem>): Promise<{ success: boolean; id: string }> {
  const res = await adminApiClient.post('/admin/testimonials', data);
  return res.data;
}

export async function updateTestimonial(id: string, data: Partial<TestimonialAdminItem>): Promise<{ success: boolean }> {
  const res = await adminApiClient.put(`/admin/testimonials/${id}`, data);
  return res.data;
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean }> {
  const res = await adminApiClient.delete(`/admin/testimonials/${id}`);
  return res.data;
}

// --- Bookings ---
export async function getAdminBookings(
  status?: string,
  search?: string,
  page = 1,
  pageSize = 20
): Promise<{ items: BookingRecord[]; total: number; page: number; page_size: number }> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (search) params.append('search', search);
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());

  const res = await adminApiClient.get(`/admin/bookings?${params.toString()}`);
  return res.data;
}

export async function getBookingDetail(bookingId: string): Promise<BookingRecord> {
  const res = await adminApiClient.get<BookingRecord>(`/admin/bookings/${bookingId}`);
  return res.data;
}

export async function updateBookingDetail(
  bookingId: string,
  data: { status?: string; internal_notes?: string; event_date?: string; package_tier?: string; phone?: string; full_name?: string }
): Promise<{ success: boolean }> {
  const res = await adminApiClient.put(`/admin/bookings/${bookingId}`, data);
  return res.data;
}

export async function deleteBooking(bookingId: string): Promise<{ success: boolean }> {
  const res = await adminApiClient.delete(`/admin/bookings/${bookingId}`);
  return res.data;
}

export async function downloadBookingsCsv(): Promise<Blob> {
  const res = await adminApiClient.get('/admin/bookings/export/csv', {
    responseType: 'blob',
  });
  return res.data;
}

// --- Contacts ---
export async function getAdminContacts(
  status?: string,
  search?: string,
  page = 1,
  pageSize = 20
): Promise<{ items: ContactMessageRecord[]; total: number; page: number; page_size: number }> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (search) params.append('search', search);
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());

  const res = await adminApiClient.get(`/admin/contacts?${params.toString()}`);
  return res.data;
}

export async function getContactDetail(contactId: number): Promise<ContactMessageRecord> {
  const res = await adminApiClient.get<ContactMessageRecord>(`/admin/contacts/${contactId}`);
  return res.data;
}

export async function updateContactDetail(
  contactId: number,
  data: { status?: string; is_read?: boolean; internal_notes?: string }
): Promise<{ success: boolean }> {
  const res = await adminApiClient.put(`/admin/contacts/${contactId}`, data);
  return res.data;
}

export async function deleteContactMessage(contactId: number): Promise<{ success: boolean }> {
  const res = await adminApiClient.delete(`/admin/contacts/${contactId}`);
  return res.data;
}

// --- Users ---
export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await adminApiClient.get<AdminUser[]>('/admin/users');
  return res.data;
}

export async function createAdminUser(data: {
  username: string;
  email: string;
  password: string;
  role: 'superadmin' | 'editor';
  full_name?: string;
}): Promise<AdminUser> {
  const res = await adminApiClient.post<AdminUser>('/admin/users', data);
  return res.data;
}

export async function updateAdminUser(
  userId: number,
  data: { email?: string; role?: string; full_name?: string; is_active?: boolean }
): Promise<{ success: boolean }> {
  const res = await adminApiClient.put(`/admin/users/${userId}`, data);
  return res.data;
}

export async function deleteAdminUser(userId: number): Promise<{ success: boolean }> {
  const res = await adminApiClient.delete(`/admin/users/${userId}`);
  return res.data;
}

// --- Settings ---
export async function getWebsiteSettings(category?: string): Promise<Record<string, string>> {
  const url = category ? `/admin/settings?category=${category}` : '/admin/settings';
  const res = await adminApiClient.get<Record<string, string>>(url);
  return res.data;
}

export async function updateWebsiteSettings(
  category: string,
  settings: Record<string, string>
): Promise<{ success: boolean }> {
  const res = await adminApiClient.put('/admin/settings', { category, settings });
  return res.data;
}

// --- Media Upload ---
export async function uploadMedia(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; filename: string; size: number; is_image: boolean; is_video: boolean }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await adminApiClient.post('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return res.data;
}

