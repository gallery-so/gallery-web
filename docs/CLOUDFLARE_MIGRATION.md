# Cloudflare frontend migration

## Objective

Move the `gallery.so` web frontend from Vercel to Cloudflare Workers while preserving the
existing API, CDN, analytics, email, and other non-frontend DNS services.

## Current checkpoint (2026-07-20)

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
- The GitHub repository is connected to the Cloudflare Worker. Pushes to `main` build and deploy
  with `yarn workspace web cf:build` and `yarn workspace web cf:deploy`; non-production branch
  deployments are disabled.
- The final `main` build (`e1b5649`) completed successfully in Cloudflare, including dependency
  cache upload. The isolated Worker serves the landing page and the live API-backed `/robin`
  profile correctly.
- The inactive Cloudflare zone contains 41 audited records: 39 DNS-only records preserving the
  existing email and service hostnames, plus Worker custom-domain records for `gallery.so` and
  `www.gallery.so`. The staged set was compared record-by-record with the live Vercel-hosted zone.
- The apex is configured to serve the Worker. `www.gallery.so` is configured to return a permanent
  redirect to the apex while preserving the path and query string, matching the existing public
  behavior.
- Production traffic is still served by Vercel because the registrar continues to delegate to
  `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. The only remaining cutover action is to replace
  those at Namecheap with `arya.ns.cloudflare.com` and `josh.ns.cloudflare.com`.
- React Doctor reports no diagnostics in the migration's changed source files. The repository's
  older full-codebase diagnostics are pre-existing and outside this infrastructure migration.
- Cloudflare CLI authorization and an isolated Worker deployment under the `rokim8@gmail.com`
  account are complete.

## Cutover gates

1. [x] Verify the landing page, a real profile, redirects, metadata, images, and browser console.
2. [x] Connect the GitHub repository and confirm automatic `main` deployments.
3. [x] Export and reproduce every current DNS record in Cloudflare.
4. [x] Bind `gallery.so` and `www.gallery.so` to the Worker without changing `api`, `cdn`,
       `analytics`, mail, verification, or other service records.
5. [ ] At Namecheap, switch authoritative nameservers to `arya.ns.cloudflare.com` and
       `josh.ns.cloudflare.com`.
6. [ ] Confirm public resolvers return the two Cloudflare nameservers and the Cloudflare zone is
       active.
7. [ ] Run the production checks below and keep the Vercel project intact for rollback.

## Production verification

After the nameserver change has propagated:

1. Confirm `gallery.so` returns HTTP 200 from Cloudflare.
2. Confirm `www.gallery.so/<path>?<query>` returns HTTP 308 to
   `gallery.so/<path>?<query>` without dropping the path or query string.
3. Load the landing page, `/robin`, and `/maintenance` in a browser. Confirm profile data and
   images load, navigation works, and there are no new console errors.
4. Confirm the browser's GraphQL and maintenance-status requests use the same-origin Worker
   proxies successfully.
5. Compare public MX, TXT, CAA, and the preserved service CNAMEs against the pre-cutover export.
   Pay particular attention to `api`, `cdn`, `assets`, `analytics`, and the Google Workspace MX
   records.
6. Push a harmless follow-up commit to `main` only if another deploy is already warranted; verify
   that the connected Cloudflare build completes and the Worker version advances.

## Observation window

- Retain the Vercel project and domain configuration unchanged for at least seven days after the
  cutover.
- Check the main site and a real profile after cutover, again after roughly one hour, and daily
  during the observation window.
- Do not remove Vercel until Cloudflare request/error telemetry and the preserved DNS services
  remain healthy for the entire window.

## Rollback

Until the observation window ends, the primary rollback is to restore the Namecheap delegation to
`ns1.vercel-dns.com` and `ns2.vercel-dns.com`. Vercel still contains the working application and
domain configuration, so no rebuild is required. Expect DNS caches to make both cutover and
rollback gradual rather than instantaneous.

After restoring the Vercel nameservers, verify the apex and `/robin` again and confirm that `www`
returns its existing redirect to the apex. Leave the Cloudflare zone and Worker in place while the
rollback propagates; deleting either would make recovery harder and provides no immediate benefit.
