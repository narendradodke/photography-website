import { apiClient } from './api';
import portfolioData from '../data/portfolio.json';
import albumsData from '../data/albums.json';
import reelsData from '../data/reels.json';
import packagesData from '../data/packages.json';
import testimonialsData from '../data/testimonials.json';
import type { PortfolioItem, AlbumsData, ReelItem, PackageItem, TestimonialItem } from '../types/portfolio';

export async function getPortfolio(category?: string): Promise<PortfolioItem[]> {
  try {
    const url = category && category !== 'all' ? `/portfolio?category=${category}` : '/portfolio';
    const res = await apiClient.get<PortfolioItem[]>(url);
    return res.data;
  } catch {
    if (category && category !== 'all') {
      return (portfolioData as PortfolioItem[]).filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    return portfolioData as PortfolioItem[];
  }
}

export async function getAlbums(): Promise<AlbumsData> {
  try {
    const res = await apiClient.get<AlbumsData>('/albums');
    return res.data;
  } catch {
    return albumsData as AlbumsData;
  }
}

export async function getReels(): Promise<ReelItem[]> {
  try {
    const res = await apiClient.get<ReelItem[]>('/reels');
    return res.data;
  } catch {
    return reelsData as ReelItem[];
  }
}

export async function getPackages(): Promise<PackageItem[]> {
  try {
    const res = await apiClient.get<PackageItem[]>('/packages');
    return res.data;
  } catch {
    return packagesData as PackageItem[];
  }
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const res = await apiClient.get<TestimonialItem[]>('/testimonials');
    return res.data;
  } catch {
    return testimonialsData as TestimonialItem[];
  }
}
