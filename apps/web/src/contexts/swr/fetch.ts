const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

// Keep production browser traffic same-origin so Cloudflare can proxy it to the
// existing API without exposing preview hostnames through the API's CORS policy.
export const baseurl =
  typeof window !== 'undefined' && configuredBaseUrl === 'https://api.gallery.so'
    ? ''
    : configuredBaseUrl;

export const vanillaFetcher = async (...args: Parameters<typeof fetch>) =>
  fetch(...args).then(async (res) => res.json());
