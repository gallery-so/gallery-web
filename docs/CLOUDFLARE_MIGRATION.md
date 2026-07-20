# Cloudflare frontend migration

## Objective

Move the `gallery.so` web frontend from Vercel to Cloudflare Workers while preserving the
existing API, CDN, analytics, email, and other non-frontend DNS services.

## Current checkpoint

- The web app is upgraded to Next.js 15 and builds with OpenNext for Cloudflare Workers.
- The Worker runtime passes local and isolated remote SSR, redirect, and immutable-static-cache
  smoke tests.
- Public subrequests are forced through Cloudflare's public routing path so SSR can reach the
  existing Cloudflare-routed `api.gallery.so` backend without Worker-to-Worker recursion.
- Browser GraphQL traffic uses a narrow same-origin `/glry/*` Worker proxy to the existing API.
  This preserves the API's production-only CORS policy while allowing isolated preview testing.
- The public maintenance-status Sanity query uses a same-origin read-only proxy for the same
  reason; server-side CMS reads continue to call Sanity directly.
- Production-mode smoke tests pass for `/`, `/robin`, and `/maintenance` against the live API on
  the isolated `workers.dev` preview.
- The browser-only application providers are loaded outside the server render path. This preserves
  the existing client-only rendering behavior, cuts the shared first-load shell from roughly
  1.11 MB to 90.5 kB, and keeps dynamic routes within the Worker CPU budget.
- Dynamic HTML is never retained by the edge between deployments; versioned JavaScript, CSS, and
  image assets keep their immutable cache policy.
- The app accepts deployment-neutral environment variables while retaining Vercel fallbacks.
- The production API, analytics proxy, Sanity project, Privy application, and public analytics
  configuration were verified against the currently deployed web bundle.
- No production DNS or nameserver changes have been made yet.
- React Doctor reports no diagnostics in the migration's changed source files. The repository's
  older full-codebase diagnostics are pre-existing and outside this infrastructure migration.
- Cloudflare CLI authorization and an isolated Worker deployment under the `rokim8@gmail.com`
  account are complete.

## Cutover gates

1. Verify the landing page, a real profile, redirects, metadata, images, and browser console.
2. Connect the GitHub repository and confirm automatic preview and `main` deployments.
3. Export and reproduce every current DNS record in Cloudflare.
4. Bind `gallery.so` and `www.gallery.so` to the Worker without changing `api`, `cdn`,
   `analytics`, mail, verification, or other service records.
5. Switch authoritative nameservers only after record-by-record verification.
6. Run production smoke tests and keep the Vercel project intact for rollback.

## Rollback

Until the observation window ends, rollback consists of restoring the previous Vercel apex and
`www` routing (or the previous authoritative nameservers). Do not remove the Vercel project or
its domain configuration during this window.
