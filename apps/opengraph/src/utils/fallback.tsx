import { getCloudflareContext } from '@opennextjs/cloudflare';

export const WIDTH_OPENGRAPH_IMAGE = 1200;
export const HEIGHT_OPENGRAPH_IMAGE = 630;

const FALLBACK_IMAGE_PATH = '/media/system/opengraph/gallery-full-logo.png';
const MINIMUM_FALLBACK_IMAGE_BYTES = 4_096;

export const fallbackImageResponse = async () => {
  const assets = getCloudflareContext().env.ASSETS;
  if (!assets) {
    throw new Error('Cloudflare ASSETS binding is unavailable for the OpenGraph fallback');
  }

  const assetUrl = new URL(FALLBACK_IMAGE_PATH, 'https://assets.local');
  const assetResponse = await assets.fetch(assetUrl);
  if (!assetResponse.ok) {
    throw new Error(
      `Unable to load bundled OpenGraph fallback ${FALLBACK_IMAGE_PATH}: ` +
        `${assetResponse.status} ${assetResponse.statusText}`
    );
  }

  const body = await assetResponse.arrayBuffer();
  if (body.byteLength < MINIMUM_FALLBACK_IMAGE_BYTES) {
    throw new Error(
      `Bundled OpenGraph fallback ${FALLBACK_IMAGE_PATH} is unexpectedly small ` +
        `(${body.byteLength} bytes)`
    );
  }

  return new Response(body, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'image/png',
      'X-Gallery-OpenGraph-Fallback': 'true',
    },
  });
};
