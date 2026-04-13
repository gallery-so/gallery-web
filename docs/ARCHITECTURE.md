# Architecture

High-level overview of the Gallery frontend codebase.

## Monorepo Structure

```
gallery-frontend/
├── apps/
│   ├── web/          # Next.js + Relay (gallery.so)
│   └── mobile/       # React Native/Expo + Relay (iOS & Android)
├── packages/
│   ├── shared/       # Shared code (hooks, utils, Relay fragments)
│   └── frames-dls/   # Farcaster Frames design system
├── schema.graphql    # GraphQL schema (fetched from backend)
├── relay.config.js   # Relay compiler config (multi-project)
└── .moon/            # Moon monorepo config
```

**Workspaces:** Managed by Yarn 3.4.1 workspaces. Each app and package has its own `package.json`.

**Monorepo tool:** [Moon](https://moonrepo.dev). All commands follow the format `moon run {project}:{task}`. Each workspace has a `moon.yml` listing available tasks.

## Build System

### Common Commands

| Command | Description |
|---------|-------------|
| `moon run web:dev` | Start web app (http://localhost:3000) |
| `moon run mobile:ios` | Start iOS simulator |
| `moon run mobile:android` | Start Android emulator |
| `moon run web:relay-watch` | Relay compiler in watch mode |
| `moon run shared:codegen-watch` | Shared package codegen (run as separate process) |
| `moon run web:test` | Run web unit tests |
| `moon run web:lint` | Lint web |
| `moon run web:typecheck` | Type-check web |
| `yarn fetch-schema` | Pull GraphQL schema from production |
| `yarn fetch-schema-dev` | Pull GraphQL schema from development |

### Build Order

The shared package must be built before web or mobile type-checking:

```bash
npx tsc --project packages/shared/tsconfig.json
```

Moon caches types at `.moon/cache/types/`. If you add new files to `packages/shared`, rebuild the shared package first.

### Global Tasks

Defined in `.moon/tasks.yml`, available to all workspaces:

- `prettier` / `prettier-fix` - Code formatting
- `lint` / `lint-fix` - ESLint
- `typecheck` - TypeScript build

## GraphQL & Relay

**Schema:** `schema.graphql` at repo root. Fetched from the backend gateway via `yarn fetch-schema` (production) or `yarn fetch-schema-dev` (development).

**Relay compiler:** Configured in `relay.config.js` with three projects:

| Project | Source | Output | APQ |
|---------|--------|--------|-----|
| web | `apps/web` | `apps/web/__generated__/relay/` | Enabled (SHA256) |
| mobile | `apps/mobile` | `apps/mobile/__generated__/relay/` | Disabled |
| shared | `packages/shared` | `packages/shared/__generated__/relay/` | N/A |

The shared package fragments are available to both web and mobile projects.

**Generated files:** All `__generated__/` directories are gitignored. Run the Relay compiler after pulling changes:

```bash
npx relay-compiler --project web relay.config.js
```

**Custom scalars:** `Email`, `Address`, and `DBID` all map to `string`.

## Authentication

The app supports multiple auth methods via [Privy](https://www.privy.io/):

| Method | Web Package | Mobile Package |
|--------|-------------|----------------|
| Email (2FA) | `@privy-io/react-auth` | `@privy-io/expo` |
| Magic Link | `magic-sdk` | `@magic-sdk/react-native-expo` |
| WalletConnect | `@walletconnect/*` | `@walletconnect/modal-react-native` |
| Farcaster | `@farcaster/auth-kit` | `@farcaster/auth-kit` |
| Coinbase Wallet | via RainbowKit | `@coinbase/wallet-mobile-sdk` |
| EOA Wallets | `@rainbow-me/rainbowkit` | Native wallet connectors |

**Blockchain libraries:**
- Web uses `ethers@5.x` and `viem@2.x`
- Mobile uses `ethers@6.x` and `viem@1.x`
- Tezos support via `@taquito/taquito` (web only)

## Feature Flags

Feature flags are defined in two places:

### Static Flags (pre-auth contexts)

Location: `packages/shared/src/utils/featureFlags.ts`

Used in login screens, onboarding routing, and other places where no Relay `queryRef` is available.

```typescript
export const STATIC_FEATURE_FLAGS = {
  SHOW_EMAIL_ONBOARDING: false,
  SHOW_SOCIAL_CONNECTIONS: false,
} as const;
```

### Relay-Based Flags (authenticated contexts)

Locations:
- Web: `apps/web/src/utils/graphql/isFeatureEnabled.tsx`
- Mobile: `apps/mobile/src/utils/isFeatureEnabled.tsx`

These require a Relay `queryRef` and support ADMIN role overrides (admins see all features regardless of flag values).

## Environment Setup

### Web

Copy the sample env file:

```bash
cp apps/web/.env.sample apps/web/.env
```

Key variables include API endpoints, auth provider keys (Privy, WalletConnect, Magic Link), Ethereum RPC (Infura), contract addresses, analytics (Mixpanel), error tracking (Sentry), and CMS (Sanity).

See `apps/web/.env.sample` for the complete list with descriptions.

### Mobile

Environment files are in `apps/mobile/env/`:

- `.env.dev` - Development API endpoints
- `.env.prod` - Production endpoints
- `.env.secret` - Local-only secrets (Privy app ID, Sentry auth token)

See `apps/mobile/README.md` for full setup instructions including Xcode 16.4 requirements.

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

| Workflow | File | Trigger | Description |
|----------|------|---------|-------------|
| Web E2E | `web.e2e.yml` | PR | Cypress E2E tests via Docker |
| Web Unit | `web.unit.yml` | PR | Jest unit tests |
| Repo Lint | `repo-lint.yml` | PR | ESLint across all workspaces |
| Repo Typecheck | `repo-typecheck.yml` | PR | TypeScript type-checking |
| Mobile Build | `mobile-build.yml` | Manual/PR | EAS Build for iOS and Android |
| Mobile Release | `mobile-release.yml` | Manual | EAS Submit to app stores |
| Bundle Diff | `web.bundle-diff.yml` | PR | Bundle size comparison |
| Screenshots | `web.screenshots.yml` | PR | Visual regression screenshots |
| Link Artifacts | `web.link-artifacts.yml` | PR | Link build artifacts to PRs |
| Labeler | `labeler.yml` | PR | Auto-label PRs by file paths |
