import axios from 'axios';
import { PNG } from 'pngjs';

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3000';

const REAL_PROFILE_PATH = '/api/og/user/oneJPEGman';
const REAL_POST_PATH = '/api/og/post/2URgUSeRBxWYnaT27EaUQZeSy5j';
const MISSING_PROFILE_PATH = '/api/og/user/does-not-exist-codex';

jest.setTimeout(60_000);

let requestSequence = 0;

function cacheBust(path: string) {
  const separator = path.includes('?') ? '&' : '?';
  requestSequence += 1;
  return `${path}${separator}__og_test=${Date.now()}-${requestSequence}`;
}

async function fetchBinary(path: string) {
  const response = await axios.get<ArrayBuffer>(`${BASE_URL}${cacheBust(path)}`, {
    responseType: 'arraybuffer',
    timeout: 55_000,
  });

  return { response, body: Buffer.from(response.data) };
}

function expectVisibleOpenGraphPng(body: Buffer) {
  expect(body.subarray(1, 4).toString()).toBe('PNG');

  const png = PNG.sync.read(body as unknown as Parameters<typeof PNG.sync.read>[0]);
  expect(png.width).toBe(1200);
  expect(png.height).toBe(630);

  let visiblePixels = 0;
  const visibleColors = new Set<number>();

  for (let index = 0; index < png.data.length; index += 4) {
    const alpha = png.data[index + 3];
    if (alpha === 0) continue;

    visiblePixels++;
    visibleColors.add((png.data[index] << 16) | (png.data[index + 1] << 8) | png.data[index + 2]);
  }

  expect(visiblePixels).toBeGreaterThan(png.width * png.height * 0.5);
  expect(visibleColors.size).toBeGreaterThan(1);
}

function expectProfileArtworkPng(body: Buffer) {
  const png = PNG.sync.read(body as unknown as Parameters<typeof PNG.sync.read>[0]);
  let colorfulPixels = 0;

  for (let y = 150; y < 450; y++) {
    for (let x = 50; x < 1_150; x++) {
      const index = (y * png.width + x) * 4;
      const red = png.data[index];
      const green = png.data[index + 1];
      const blue = png.data[index + 2];
      const colorSpread = Math.max(red, green, blue) - Math.min(red, green, blue);

      if (png.data[index + 3] > 0 && colorSpread > 25) {
        colorfulPixels++;
      }
    }
  }

  expect(colorfulPixels).toBeGreaterThan(10_000);
}

describe('Cloudflare Worker integration', () => {
  it.each([
    ['fallback logo', '/media/system/opengraph/gallery-full-logo.png', 'image/png'],
    ['ABCDiatype Regular', '/media/system/opengraph/fonts/ABCDiatype-Regular.ttf', 'font/ttf'],
    ['ABCDiatype Bold', '/media/system/opengraph/fonts/ABCDiatype-Bold.ttf', 'font/ttf'],
    ['GT Alpina Light', '/media/system/opengraph/fonts/GT-Alpina-Standard-Light.ttf', 'font/ttf'],
    [
      'GT Alpina Light Italic',
      '/media/system/opengraph/fonts/GT-Alpina-Standard-Light-Italic.ttf',
      'font/ttf',
    ],
  ])('serves the bundled %s asset', async (_name, path, contentType) => {
    const { response, body } = await fetchBinary(path);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain(contentType);
    expect(body.byteLength).toBeGreaterThan(4_096);
  });

  it.each([
    ['profile', REAL_PROFILE_PATH, false],
    ['post', REAL_POST_PATH, false],
    ['collection', '/api/og/collection/2QzRSthNb6PAZmnSnRvPAea9LPX', false],
    ['fallback', MISSING_PROFILE_PATH, true],
  ])('returns a visible PNG for a %s preview', async (_name, path, isFallback) => {
    const { response, body } = await fetchBinary(path);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('image/png');
    expect(response.headers['x-gallery-opengraph-fallback'] === 'true').toBe(isFallback);
    expectVisibleOpenGraphPng(body);
  });

  it('renders real and nonexistent profiles differently', async () => {
    const [{ body: realProfile }, { body: missingProfile }] = await Promise.all([
      fetchBinary(REAL_PROFILE_PATH),
      fetchBinary(MISSING_PROFILE_PATH),
    ]);

    expect(realProfile.toString('base64')).not.toBe(missingProfile.toString('base64'));
  });

  it('renders gallery artwork in a profile preview', async () => {
    const { body } = await fetchBinary(REAL_PROFILE_PATH);

    expectProfileArtworkPng(body);
  });

  it('serializes overlapping profile renders without degrading them', async () => {
    const cacheBust = Date.now();
    const previews = await Promise.all([
      fetchBinary(`${REAL_PROFILE_PATH}?stress=${cacheBust}-1`),
      fetchBinary(`${REAL_PROFILE_PATH}?stress=${cacheBust}-2`),
    ]);

    for (const { response, body } of previews) {
      expect(response.status).toBe(200);
      expect(response.headers['x-gallery-opengraph-fallback']).not.toBe('true');
      expectVisibleOpenGraphPng(body);
    }
  });

  it.each([
    ['profile', '/api/og/user/dcinvestor/fcframe'],
    ['collection', '/api/og/collection/2QzRSthNb6PAZmnSnRvPAea9LPX/fcframe'],
    ['community', '/api/og/community/Base/0x0e76013ff360eea66b19e5dce6e0c697036bc2c0/fcframe'],
  ])('returns Farcaster metadata for a %s interaction', async (_name, path) => {
    const response = await axios.post(
      `${BASE_URL}${path}`,
      { untrustedData: { buttonIndex: 1 } },
      { timeout: 30_000 }
    );

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html');
    expect(response.data).toMatch(/<meta property="fc:frame" content="vNext"\s*\/>/);
    expect(response.data).toMatch(/<meta property="fc:frame:image" content="[^"]+"\s*\/>/);
    expect(response.data).toMatch(/position=1/);
  });
});
