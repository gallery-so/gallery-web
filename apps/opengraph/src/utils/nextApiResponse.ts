import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { fallbackImageResponse } from './fallback';

type WebResponseHandler = (req: NextApiRequest) => Response | Promise<Response>;

const RENDER_TIMEOUT_MS = 45_000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('OpenGraph render timed out')), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function renderResponse(handler: WebResponseHandler, req: NextApiRequest) {
  const response = await handler(req);
  if (!response.ok) {
    throw new Error(`OpenGraph renderer returned ${response.status}`);
  }

  const body = await response.arrayBuffer();
  if (body.byteLength === 0) {
    throw new Error('OpenGraph renderer returned an empty response');
  }

  return { response, body };
}

function sendResponse(
  res: NextApiResponse,
  { response, body }: Awaited<ReturnType<typeof renderResponse>>
) {
  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.send(Buffer.from(body));
}

export function toNextApiHandler(handler: WebResponseHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      sendResponse(res, await withTimeout(renderResponse(handler, req), RENDER_TIMEOUT_MS));
    } catch (error) {
      if (req.method === 'GET') {
        console.error('Failed to serialize OpenGraph image response', {
          error,
          path: req.url,
        });

        const fallback = await withTimeout(
          renderResponse(() => fallbackImageResponse(), req),
          RENDER_TIMEOUT_MS
        );
        sendResponse(res, fallback);
        return;
      }

      throw error;
    }
  };
}
