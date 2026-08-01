# Gallery OpenGraph

Dynamic social-preview images for Gallery profiles, galleries, collections,
communities, posts, and NFTs.

This app was imported from [`gallery-so/opengraph`](https://github.com/gallery-so/opengraph)
at commit `e9c5bbb47ca59d3ddffc76e67228725d6c7cc971`. The standalone repository retains
the earlier file history.

## Monorepo ownership

The Worker is a Yarn workspace and Moon project named `opengraph`. It remains a
separate Cloudflare Worker from `apps/web`; moving the source into this monorepo
does not combine the `gallery.so` and `og.gallery.so` runtimes.

The renderer's four fonts come from `packages/shared/src/fonts`. The build copies
them into the Worker's static asset bundle. Its 1200×630 fallback PNG is generated
from `apps/web/public/icons/logo-large-2.svg`, while the runtime fallback embeds
the same wordmark so it remains visible even when another render fails.

No OpenGraph system asset is read from the private `gallery-token-media` R2 bucket.
Do not modify user-token R2 objects while maintaining this app.

## Development

From the repository root:

```bash
yarn install --immutable
node_modules/.bin/moon run opengraph:dev
```

Build and preview in the same Workers runtime used in production:

```bash
yarn workspace opengraph cf:build
yarn workspace opengraph preview
```

The integration tests expect the built Worker on port 3000:

```bash
yarn workspace opengraph cf:build
yarn workspace opengraph exec wrangler dev --port 3000
yarn workspace opengraph test --runInBand
```

The test suite verifies all five generated renderer assets, decodes output PNGs
to reject blank images, and confirms real and nonexistent profiles differ.

## Renderer memory safety

The renderer uses `cf-workers-og`, whose Worker entrypoint initializes Yoga and
Resvg once per isolate and explicitly frees completed PNG renderers. Rendering
is serialized within each isolate so concurrent image-heavy requests stay below
Cloudflare's memory limit; requests that cannot acquire the renderer promptly
degrade to the bundled static fallback instead of returning a 503. Keep all
image routes on the shared wrapper in `src/utils/imageResponse.ts`; do not import
the renderer directly or replace it with `workers-og@0.0.27`.

## Hosting

Production runs as the dedicated `gallery-opengraph` Cloudflare Worker at
`https://og.gallery.so`. Configure its Git integration against
`gallery-so/gallery-web` with the repository root as the working directory:

- Build command: `yarn workspace opengraph cf:build`
- Deploy command: `yarn workspace opengraph cf:deploy`

Keep the existing `og.gallery.so` custom domain and Worker name. Reconnect the
Git integration only when this monorepo change is ready to replace the standalone
repository as the deployment source.

After deployment, use cache-busted URLs to verify a real profile, a real post,
and a nonexistent entity. Confirm the real previews are visible and do not match
the branded fallback bytes.
