# Cloudflare frontend migration

## Objective

Move the `gallery.so` web frontend from Vercel to Cloudflare Workers while preserving the
existing API, CDN, analytics, email, and other non-frontend DNS services.

## Current checkpoint

- The web app is upgraded to Next.js 15 and builds with OpenNext for Cloudflare Workers.
- The Worker runtime passes local SSR, redirect, and immutable-static-cache smoke tests.
- Public subrequests are forced through Cloudflare's public routing path so SSR can reach the
  existing Cloudflare-routed `api.gallery.so` backend without Worker-to-Worker recursion.
- Production-mode smoke tests pass for `/`, `/robin`, and `/maintenance` against the live API.
- The app accepts deployment-neutral environment variables while retaining Vercel fallbacks.
- The production API, analytics proxy, Sanity project, Privy application, and public analytics
  configuration were verified against the currently deployed web bundle.
- No production DNS or nameserver changes have been made yet.
- React Doctor reports no diagnostics in the migration's changed source files. The repository's
  older full-codebase diagnostics are pre-existing and outside this infrastructure migration.
- Cloudflare CLI authorization for the `rokim8@gmail.com` account is the current deployment gate.

## Cutover gates

1. Deploy an isolated `workers.dev` preview with the production public configuration.
2. Verify the landing page, a real profile, redirects, metadata, images, and browser console.
3. Connect the GitHub repository and confirm automatic preview and `main` deployments.
4. Export and reproduce every current DNS record in Cloudflare.
5. Bind `gallery.so` and `www.gallery.so` to the Worker without changing `api`, `cdn`,
   `analytics`, mail, verification, or other service records.
6. Switch authoritative nameservers only after record-by-record verification.
7. Run production smoke tests and keep the Vercel project intact for rollback.

## Rollback

Until the observation window ends, rollback consists of restoring the previous Vercel apex and
`www` routing (or the previous authoritative nameservers). Do not remove the Vercel project or
its domain configuration during this window.
