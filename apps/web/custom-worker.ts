// @ts-expect-error OpenNext generates this module during the Cloudflare build.
import openNextWorker from './.open-next/worker.js';

const API_ORIGIN = 'https://api.gallery.so';
const SANITY_QUERY_URL = 'https://i8s3oao1.api.sanity.io/v1/data/query/production';

const preventStaleHtml = (response: Response) => {
  if (!response.headers.get('content-type')?.includes('text/html')) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('cache-control', 'private, no-cache, no-store, max-age=0, must-revalidate');
  headers.set('cdn-cache-control', 'no-store');
  headers.set('cloudflare-cdn-cache-control', 'no-store');

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
};

const worker = {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/glry/')) {
      const upstreamUrl = new URL(`${url.pathname}${url.search}`, API_ORIGIN);
      return fetch(new Request(upstreamUrl, request));
    }

    if (url.pathname === '/__sanity/query') {
      if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      const upstreamUrl = new URL(SANITY_QUERY_URL);
      upstreamUrl.search = url.search;
      return fetch(upstreamUrl);
    }

    return preventStaleHtml(await openNextWorker.fetch(request, env, ctx));
  },
};

export default worker;

// @ts-expect-error OpenNext generates these exports during the Cloudflare build.
export { DOQueueHandler, DOShardedTagCache } from './.open-next/worker.js';
