import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { NextApiRequest } from 'next';

import { getAbsoluteRequestUrl } from './request';

const FONT_PATH = '/media/system/opengraph/fonts';
const MINIMUM_FONT_BYTES = 1_024;

const fontCache = new Map<string, Promise<ArrayBuffer>>();

async function fetchFont(req: NextApiRequest, name: string): Promise<ArrayBuffer> {
  const requestPath = getAbsoluteRequestUrl(req).pathname;
  const assetUrl = new URL(`${FONT_PATH}/${name}`, 'https://assets.local');
  const cacheKey = assetUrl.pathname;
  const cachedFont = fontCache.get(cacheKey);

  if (cachedFont) {
    return cachedFont;
  }

  const fontPromise = (async () => {
    let response: Response;

    try {
      const assets = getCloudflareContext().env.ASSETS;
      if (!assets) {
        throw new Error('Cloudflare ASSETS binding is unavailable');
      }

      response = await assets.fetch(assetUrl);
    } catch (error) {
      throw new Error(
        `Unable to load bundled OpenGraph font ${name} while rendering ${requestPath}: ` +
          String(error)
      );
    }

    if (!response.ok) {
      throw new Error(
        `Unable to load bundled OpenGraph font ${name} (${assetUrl.pathname}) while rendering ` +
          `${requestPath}: ${response.status} ${response.statusText}`
      );
    }

    const fontData = await response.arrayBuffer();
    if (fontData.byteLength < MINIMUM_FONT_BYTES) {
      throw new Error(
        `Bundled OpenGraph font ${name} (${assetUrl.pathname}) is unexpectedly small ` +
          `(${fontData.byteLength} bytes)`
      );
    }

    return fontData;
  })();

  fontCache.set(cacheKey, fontPromise);

  try {
    return await fontPromise;
  } catch (error) {
    fontCache.delete(cacheKey);
    throw error;
  }
}

export const ABCDiatypeRegular = (req: NextApiRequest) => fetchFont(req, 'ABCDiatype-Regular.ttf');
export const ABCDiatypeBold = (req: NextApiRequest) => fetchFont(req, 'ABCDiatype-Bold.ttf');
export const alpinaLight = (req: NextApiRequest) => fetchFont(req, 'GT-Alpina-Standard-Light.ttf');
export const alpinaLightItalic = (req: NextApiRequest) =>
  fetchFont(req, 'GT-Alpina-Standard-Light-Italic.ttf');
