export interface PortfolioItem {
  id: string;
  title: string;
  category: 'weddings' | 'haldi' | 'mehndi' | 'baby-shoot' | string;
  image: string;
  thumbnail: string;
  location: string;
  date: string;
  aspect?: 'vertical' | 'horizontal' | 'square';
}

export interface AlbumFeatured {
  id: string;
  title: string;
  subtitle: string;
  photosCount: number;
  badge: string;
  cover: string;
  previewImages: string[];
}

export interface AlbumItem {
  id: string;
  title: string;
  subtitle?: string;
  photosCount: number;
  tag: string;
  badge?: string;
  cover: string;
  previewImages?: string[];
  isFeatured?: boolean;
}

export interface AlbumsData {
  featured: AlbumFeatured;
  carousel: AlbumItem[];
  albums?: AlbumItem[];
}

export interface ReelItem {
  id: string;
  shortcode: string;
  url: string;
  embedUrl: string;
  embed_url?: string;
  title: string;
  category: string;
  duration?: string;
  photosCount?: number;
  videoUrl?: string;
  video_url?: string;
  cover?: string;
}


export interface PackageItem {
  id: string;
  name: string;
  tagline: string;
  price: string;
  priceNum: number;
  popular: boolean;
  features: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  event: string;
  rating: number;
  quote: string;
  avatar: string;
}
