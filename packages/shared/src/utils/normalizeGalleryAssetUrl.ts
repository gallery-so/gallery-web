const GALLERY_CDN_ORIGIN = 'https://cdn.gallery.so';

const GCS_BUCKET_TO_CDN_PREFIX: Record<string, string> = {
  'token-media': 'media',
  'gallery-prod-token-media': 'media',
  'token-content': 'content',
  'gallery-prod-token-content': 'content',
};

/**
 * Route Gallery-owned GCS asset URLs through the R2-backed Gallery CDN.
 * External NFT media URLs are returned unchanged.
 */
export function normalizeGalleryAssetUrl(url: string | null): string | null {
  if (!url) {
    return url;
  }

  const match = url.match(/^https:\/\/storage\.googleapis\.com\/([^/]+)\/(.+)$/);
  if (!match) {
    return url;
  }

  const [, bucket, objectPath] = match;
  const cdnPrefix = GCS_BUCKET_TO_CDN_PREFIX[bucket];
  if (!cdnPrefix) {
    return url;
  }

  return `${GALLERY_CDN_ORIGIN}/${cdnPrefix}/${objectPath}`;
}
