export type AdminRole = 'superadmin' | 'editor';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: AdminRole;
  full_name: string;
  is_active: boolean;
  created_at: string;
  last_login?: string | null;
}

export interface DashboardStats {
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    estimated_revenue: number;
  };
  messages: {
    total: number;
    unread: number;
  };
  content: {
    portfolio: number;
    albums: number;
    reels: number;
    packages: number;
    testimonials: number;
  };
  recent_bookings: BookingRecord[];
  recent_contacts: ContactMessageRecord[];
  recent_activity: ActivityLogRecord[];
  monthly_bookings: Array<{ month: string; count: number }>;
}

export interface BookingRecord {
  id: number;
  booking_id: string;
  full_name: string;
  phone: string;
  package_tier: string;
  event_date: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageRecord {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  is_read: number | boolean;
  internal_notes?: string;
  created_at: string;
}

export interface PortfolioAdminItem {
  id: string;
  title: string;
  category: string;
  image: string;
  thumbnail: string;
  location: string;
  date: string;
  aspect: 'vertical' | 'horizontal' | 'square';
  tags?: string;
  alt_text?: string;
  is_featured: number | boolean;
  order_index: number;
  created_at: string;
}

export interface AlbumAdminItem {
  id: string;
  title: string;
  subtitle?: string;
  photos_count: number;
  badge_or_tag?: string;
  cover: string;
  preview_images: string[];
  is_featured: number | boolean;
  is_visible: number | boolean;
  order_index: number;
  created_at: string;
}

export interface ReelAdminItem {
  id: string;
  shortcode?: string;
  url?: string;
  embed_url?: string;
  video_url?: string;
  cover?: string;
  title: string;
  category: string;
  duration?: string;
  is_visible: number | boolean;
  order_index: number;
  created_at: string;
}

export interface PackageAdminItem {
  id: string;
  name: string;
  tagline: string;
  price: string;
  price_num: number;
  priceNum?: number;
  popular: boolean;
  features: string[];
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface TestimonialAdminItem {
  id: string;
  name: string;
  event: string;
  rating: number;
  quote: string;
  avatar: string;
  is_approved: number | boolean;
  order_index: number;
  created_at: string;
}

export interface ActivityLogRecord {
  id: number;
  admin_username: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

