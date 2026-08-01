import { getReachableImageUrls } from '../src/fetch';

describe('getReachableImageUrls', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('checks Gallery-owned GCS media through the Gallery CDN', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as Response);
    const gcsUrl = 'https://storage.googleapis.com/gallery-prod-token-media/token-image';
    const cdnUrl = 'https://cdn.gallery.so/media/token-image';

    await expect(getReachableImageUrls([gcsUrl], 1)).resolves.toEqual([cdnUrl]);
    expect(fetchMock).toHaveBeenCalledWith(cdnUrl, { method: 'HEAD' });
  });

  it('leaves external media URLs unchanged', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as Response);
    const externalUrl = 'https://example.com/token-image.png';

    await expect(getReachableImageUrls([externalUrl], 1)).resolves.toEqual([externalUrl]);
    expect(fetchMock).toHaveBeenCalledWith(externalUrl, { method: 'HEAD' });
  });
});
