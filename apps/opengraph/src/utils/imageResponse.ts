import { ImageResponse as WorkerImageResponse } from 'cf-workers-og/workerd';
import type { ImageResponseOptions } from 'cf-workers-og/workerd';
import type { ReactNode } from 'react';

const RENDER_LOCK_POLL_INTERVAL_MS = 25;
const MAX_RENDER_LOCK_WAIT_MS = 15_000;

let renderInProgress = false;

async function acquireRenderLock() {
  const deadline = Date.now() + MAX_RENDER_LOCK_WAIT_MS;

  while (renderInProgress) {
    if (Date.now() >= deadline) {
      throw new Error('OpenGraph renderer is busy');
    }

    await new Promise<void>((resolve) => setTimeout(resolve, RENDER_LOCK_POLL_INTERVAL_MS));
  }

  renderInProgress = true;
}

function releaseRenderLock() {
  renderInProgress = false;
}

export const ImageResponse = {
  async create(element: ReactNode, options?: ImageResponseOptions) {
    await acquireRenderLock();

    try {
      return await WorkerImageResponse.create(element, options);
    } finally {
      releaseRenderLock();
    }
  },
};
