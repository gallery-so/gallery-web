import { normalizeGalleryAssetUrl } from './normalizeGalleryAssetUrl';

describe('normalizeGalleryAssetUrl', () => {
  it.each([
    ['token-media', 'media'],
    ['gallery-prod-token-media', 'media'],
    ['token-content', 'content'],
    ['gallery-prod-token-content', 'content'],
  ])('routes %s through the R2-backed %s CDN path', (bucket, prefix) => {
    expect(
      normalizeGalleryAssetUrl(`https://storage.googleapis.com/${bucket}/nested/image.jpg`)
    ).toBe(`https://cdn.gallery.so/${prefix}/nested/image.jpg`);
  });

  it('preserves an object query string', () => {
    expect(
      normalizeGalleryAssetUrl('https://storage.googleapis.com/token-media/image?generation=123')
    ).toBe('https://cdn.gallery.so/media/image?generation=123');
  });

  it('leaves unrelated URLs unchanged', () => {
    const url = 'https://example.com/image.jpg';
    expect(normalizeGalleryAssetUrl(url)).toBe(url);
  });

  it('leaves unrelated GCS buckets unchanged', () => {
    const url = 'https://storage.googleapis.com/gallery-prod-assets/logo.png';
    expect(normalizeGalleryAssetUrl(url)).toBe(url);
  });

  it('preserves null and empty values', () => {
    expect(normalizeGalleryAssetUrl(null)).toBeNull();
    expect(normalizeGalleryAssetUrl('')).toBe('');
  });
});
