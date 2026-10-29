/**
 * LensFrame Media Download Helper
 * Facilitates high-resolution photo, reel video, and album spread downloads.
 * Prioritizes FastAPI secure download endpoints, with client-side blob download fallback.
 */

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_URL) || 'http://localhost:8000';

export interface DownloadResult {
  success: boolean;
  message?: string;
  isExternal?: boolean;
}

function sanitizeFilename(title: string, prefix: string, defaultExt: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'media';
  return `lensframe-${prefix}-${slug}${defaultExt}`;
}

async function triggerDirectDownload(url: string, filename: string): Promise<boolean> {
  if (!url || !url.trim()) {
    return false;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Never report success on HTTP 404, 403, 500, etc.
      return false;
    }
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(objectUrl);
    return true;
  } catch {
    // If blob fetch fails due to CORS on a local relative path
    if (url.startsWith('/') && !url.startsWith('//')) {
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export async function downloadPortfolioPhoto(item: {
  id: string;
  title: string;
  image: string;
}): Promise<DownloadResult> {
  if (!item || !item.image) {
    return { success: false, message: 'Photo media not available.' };
  }

  const ext = item.image.endsWith('.webp') ? '.webp' : item.image.endsWith('.png') ? '.png' : '.jpg';
  const filename = sanitizeFilename(item.title, 'portfolio', ext);
  const backendUrl = `${API_BASE}/api/download/portfolio/${item.id}`;

  try {
    const res = await fetch(backendUrl, { method: 'HEAD' });
    if (res.ok) {
      const ok = await triggerDirectDownload(backendUrl, filename);
      if (ok) return { success: true, message: 'Photo downloaded successfully.' };
    }
  } catch {
    // Backend offline, fallback to static image asset
  }

  const staticOk = await triggerDirectDownload(item.image, filename);
  if (staticOk) {
    return { success: true, message: 'Photo downloaded successfully.' };
  }
  return { success: false, message: 'Failed to download high-resolution photo.' };
}

export async function downloadReelVideo(reel: {
  id: string;
  title: string;
  videoUrl?: string;
  video_url?: string;
  url?: string;
}): Promise<DownloadResult> {
  const rawVideo = reel.videoUrl || reel.video_url || '';
  const videoSrc = rawVideo.trim();

  // Check if this reel is external-only or an Instagram link
  const isExternalUrl = videoSrc.startsWith('http://') || videoSrc.startsWith('https://');
  const isInstagram = videoSrc.includes('instagram.com') || (!videoSrc && Boolean(reel.url));

  if (!videoSrc || isInstagram || isExternalUrl) {
    const externalLink = reel.url || (isExternalUrl ? videoSrc : '');
    if (externalLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer');
      return {
        success: false,
        isExternal: true,
        message: 'This reel is hosted on Instagram. Opened external reel in new tab.',
      };
    }
    return {
      success: false,
      message: 'No video file available for this reel.',
    };
  }

  const filename = sanitizeFilename(reel.title, 'reel', '.mp4');
  const backendUrl = `${API_BASE}/api/download/reel/${reel.id}`;

  try {
    const res = await fetch(backendUrl, { method: 'HEAD' });
    if (res.ok) {
      const ok = await triggerDirectDownload(backendUrl, filename);
      if (ok) {
        return { success: true, message: 'Reel video downloaded successfully.' };
      }
      return { success: false, message: 'Failed to stream video file.' };
    } else if (res.status === 404) {
      return { success: false, message: 'Video file is not available on server.' };
    }
  } catch {
    // Backend offline, fallback to static video path directly
  }

  // Fallback to local static video file
  const fallbackOk = await triggerDirectDownload(videoSrc, filename);
  if (fallbackOk) {
    return { success: true, message: 'Reel video downloaded successfully.' };
  }
  return { success: false, message: 'Video file could not be retrieved.' };
}

export async function downloadAlbumMedia(
  album: { id: string; title: string; cover: string },
  imageUrl?: string
): Promise<DownloadResult> {
  const targetImg = imageUrl || album.cover;
  if (!targetImg) {
    return { success: false, message: 'Album spread image not available.' };
  }

  const ext = targetImg.endsWith('.png') ? '.png' : targetImg.endsWith('.webp') ? '.webp' : '.jpg';
  const filename = sanitizeFilename(album.title, 'album-spread', ext);

  const query = imageUrl ? `?image_url=${encodeURIComponent(imageUrl)}` : '';
  const backendUrl = `${API_BASE}/api/download/album/${album.id}${query}`;

  try {
    const res = await fetch(backendUrl, { method: 'HEAD' });
    if (res.ok) {
      const ok = await triggerDirectDownload(backendUrl, filename);
      if (ok) return { success: true, message: 'Album spread downloaded successfully.' };
    }
  } catch {
    // Fallback to direct static path
  }

  const staticOk = await triggerDirectDownload(targetImg, filename);
  if (staticOk) {
    return { success: true, message: 'Album spread downloaded successfully.' };
  }
  return { success: false, message: 'Failed to download album spread.' };
}
