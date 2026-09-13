export interface PortfolioItem {
  id: string;
  title: string;
  category: 'weddings' | 'portraits' | 'travel' | 'events';
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
  photosCount: number;
  tag: string;
  cover: string;
}

export interface AlbumsData {
  featured: AlbumFeatured;
  carousel: AlbumItem[];
}

export interface ReelItem {
  id: string;
  title: string;
  duration: string;
  photosCount: number;
  videoUrl: string;
  cover: string;
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
