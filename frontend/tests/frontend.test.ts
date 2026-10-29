import test from 'node:test';
import assert from 'node:assert';
import { downloadReelVideo, downloadPortfolioPhoto, downloadAlbumMedia } from '../src/utils/downloadHelper.ts';
import albumsData from '../src/data/albums.json' with { type: 'json' };
import portfolioData from '../src/data/portfolio.json' with { type: 'json' };
import reelsData from '../src/data/reels.json' with { type: 'json' };

// Mock browser globals for node testing environment
let lastCreatedAnchor: { href: string; download: string } | null = null;
let lastOpenedUrl: string | null = null;

if (typeof window === 'undefined') {
  (globalThis as any).window = {
    open: (url: string) => { lastOpenedUrl = url; },
    URL: {
      createObjectURL: () => 'blob:mock-url-123',
      revokeObjectURL: () => {}
    }
  };
  (globalThis as any).document = {
    body: {
      appendChild: () => {},
      removeChild: () => {}
    },
    createElement: () => {
      const anchor = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: () => {
          lastCreatedAnchor = { href: anchor.href, download: anchor.download };
        }
      };
      return anchor;
    }
  };
}

// 1. Reel Download Tests
test('downloadReelVideo: external Instagram reel is not falsely reported as downloaded', async () => {
  lastOpenedUrl = null;
  const externalReel = {
    id: 'reel-test-ext',
    title: 'Ext Reel',
    url: 'https://www.instagram.com/reel/example123/',
    videoUrl: ''
  };

  const result = await downloadReelVideo(externalReel);
  assert.strictEqual(result.success, false, 'External reel must not report success: true');
  assert.strictEqual(result.isExternal, true, 'External reel must be marked as isExternal');
  assert.strictEqual(lastOpenedUrl, 'https://www.instagram.com/reel/example123/');
  assert.match(result.message || '', /Instagram/i);
});

test('downloadReelVideo: reel with no video and no link returns failure', async () => {
  const missingReel = {
    id: 'reel-test-missing',
    title: 'Missing Reel',
    videoUrl: ''
  };

  const result = await downloadReelVideo(missingReel);
  assert.strictEqual(result.success, false);
  assert.match(result.message || '', /No video file available/i);
});

test('downloadReelVideo: local reel video triggers download correctly', async () => {
  lastCreatedAnchor = null;
  // Mock fetch for local fallback
  (globalThis as any).fetch = async (_url: string) => ({
    ok: true,
    status: 200,
    blob: async () => ({ size: 1024, type: 'video/mp4' })
  });

  const localReel = {
    id: 'reel-1',
    title: 'Royal Heritage Nuptials',
    videoUrl: '/videos/reels/reel-1.mp4'
  };

  const result = await downloadReelVideo(localReel);
  assert.strictEqual(result.success, true);
  assert.ok(lastCreatedAnchor);
  assert.strictEqual(lastCreatedAnchor.download, 'lensframe-reel-royal-heritage-nuptials.mp4');
});

// 2. Portfolio Photo Download Tests
test('downloadPortfolioPhoto: handles empty media gracefully', async () => {
  const emptyItem = {
    id: 'port-empty',
    title: 'Empty Photo',
    image: ''
  };

  const result = await downloadPortfolioPhoto(emptyItem);
  assert.strictEqual(result.success, false);
});

test('downloadPortfolioPhoto: triggers download with clean sanitized filename', async () => {
  lastCreatedAnchor = null;
  (globalThis as any).fetch = async () => ({
    ok: true,
    status: 200,
    blob: async () => ({ size: 2048, type: 'image/webp' })
  });

  const photo = {
    id: 'port-insta-1',
    title: 'Mehndi Tales & Bridal Grace!',
    image: '/images/portfolio/insta-1.webp'
  };

  const result = await downloadPortfolioPhoto(photo);
  assert.strictEqual(result.success, true);
  assert.ok(lastCreatedAnchor);
  assert.strictEqual(lastCreatedAnchor.download, 'lensframe-portfolio-mehndi-tales-bridal-grace.webp');
});

// 3. Album Media Download Tests
test('downloadAlbumMedia: handles empty cover gracefully', async () => {
  const emptyAlbum = {
    id: 'album-empty',
    title: 'Empty Album',
    cover: ''
  };

  const result = await downloadAlbumMedia(emptyAlbum);
  assert.strictEqual(result.success, false);
});

test('downloadAlbumMedia: triggers spread download with sanitized filename', async () => {
  lastCreatedAnchor = null;
  (globalThis as any).fetch = async () => ({
    ok: true,
    status: 200,
    blob: async () => ({ size: 4096, type: 'image/jpeg' })
  });

  const album = {
    id: 'album-1',
    title: 'Royal Heritage & Red Lehenga',
    cover: '/images/albums/album-1.jpg'
  };

  const result = await downloadAlbumMedia(album, '/images/albums/album-7.jpg');
  assert.strictEqual(result.success, true);
  assert.ok(lastCreatedAnchor);
  assert.strictEqual(lastCreatedAnchor.download, 'lensframe-album-spread-royal-heritage-red-lehenga.jpg');
});

// 4. Data Consistency & Contract Tests
test('Data Contract: albums.json contains featured and carousel with valid previewImages', () => {
  assert.ok(albumsData.featured);
  assert.ok(albumsData.featured.id);
  assert.ok(albumsData.featured.cover);
  assert.ok(Array.isArray(albumsData.featured.previewImages));
  assert.ok(albumsData.featured.previewImages.length > 0);

  assert.ok(Array.isArray(albumsData.carousel));
  assert.ok(albumsData.carousel.length > 0);
  for (const alb of albumsData.carousel) {
    assert.ok(alb.id);
    assert.ok(alb.title);
    assert.ok(alb.cover);
    assert.ok(Array.isArray((alb as any).previewImages));
  }
});

test('Data Contract: portfolio.json contains valid items with image and title', () => {
  assert.ok(Array.isArray(portfolioData));
  assert.ok(portfolioData.length >= 30);
  for (const item of portfolioData) {
    assert.ok(item.id);
    assert.ok(item.title);
    assert.ok(item.category);
    assert.ok(item.image);
  }
});

test('Data Contract: reels.json contains valid reels with title and category', () => {
  assert.ok(Array.isArray(reelsData));
  assert.ok(reelsData.length >= 7);
  for (const reel of reelsData) {
    assert.ok(reel.id);
    assert.ok(reel.title);
    assert.ok(reel.category);
  }
});

// 5. Booking & Contact Form Validation Logic
test('Form Validation: validates phone and email formatting correctly', () => {
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^(\+?\d{1,4}[\s-]?)?\(?\d{2,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}$/.test(phone.trim());

  assert.strictEqual(isValidEmail('arjun@lensframe.com'), true);
  assert.strictEqual(isValidEmail('invalid-email'), false);
  assert.strictEqual(isValidEmail('test@domain'), false);

  assert.strictEqual(isValidPhone('+91 98765 43210'), true);
  assert.strictEqual(isValidPhone('9876543210'), true);
  assert.strictEqual(isValidPhone('abc123'), false);
});
