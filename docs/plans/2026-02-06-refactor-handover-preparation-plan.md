---
title: Handover Preparation
type: refactor
date: 2026-02-06
---

# Handover Preparation

## Overview

Prepare the gallery-frontend repo for potential team handover by cleaning up stale branches, consolidating known issues, documenting architecture, and listing key third-party dependencies.

## Tasks

### Task 1: Delete Stale Remote Branches

Delete remote branches not updated since August 2025 or earlier.

**Steps:**

1. List all remote branches with last commit date:
   ```bash
   git for-each-ref --sort=committerdate refs/remotes/origin --format='%(committerdate:short) %(refname:short)'
   ```
2. Identify branches with last commit before 2025-09-01
3. Exclude `origin/main` and any actively used branches
4. Delete stale remotes:
   ```bash
   git push origin --delete <branch-name>
   ```
5. Run `git remote prune origin` to clean up local tracking refs

**Expected:** ~50 stale branches removed.

---

### Task 2: Write `docs/ARCHITECTURE.md`

High-level architecture overview for new team onboarding.

**Sections:**

1. **Monorepo Structure** - Workspace layout (`apps/web`, `apps/mobile`, `packages/shared`, `packages/frames-dls`), Moon build tool, Yarn 3.4.1 workspaces
2. **Build System** - Moon commands, how to run web/mobile, shared package build order (`npx tsc --project packages/shared/tsconfig.json` must run first)
3. **GraphQL & Relay** - Schema location (`schema.graphql`), Relay compiler config (`relay.config.js`), auto-persisted queries (web only), `__generated__` directories
4. **Authentication** - Magic Link, WalletConnect, Farcaster, and wallet EOA flows
5. **Feature Flags** - Static flags in `packages/shared/src/utils/featureFlags.ts` for pre-auth, Relay-based flags in app-specific `isFeatureEnabled.tsx` for authenticated contexts
6. **Environment Setup** - Reference to `.env.sample` (web) and `env/` directory (mobile), how to fetch schema
7. **CI/CD** - GitHub Actions workflows overview, what each workflow does

**Style:** Match existing README.md tone - practical, direct, includes commands in code blocks. Assume intermediate developer knowledge.

**Source files to reference:**
- `README.md` (root)
- `apps/mobile/README.md`
- `relay.config.js`
- `packages/shared/src/utils/featureFlags.ts`
- `apps/web/src/utils/graphql/isFeatureEnabled.tsx`
- `apps/mobile/src/utils/isFeatureEnabled.tsx`
- `.moon/tasks.yml`
- `.github/workflows/`

---

### Task 3: Write `docs/KNOWN-ISSUES.md`

Consolidate all TODOs, FIXMEs, and known bugs from the codebase into a single tracking document.

**Steps:**

1. Scan codebase for `TODO`, `FIXME`, `HACK`, `XXX` comments
2. Group by area: Web, Mobile, Shared, GraphQL/Relay
3. Prioritize: Critical (crashes/data loss), Important (functionality gaps), Low (cleanup/nice-to-have)
4. Include file path and brief description for each

**Sections:**

1. **Critical Issues** - Things that crash or lose data (e.g., `NotificationList.tsx` crashes if no email, onboarding screens throw on missing email)
2. **Web TODOs** - Grouped by feature area (NftDetail, Onboarding, Community, Gallery Editor, etc.)
3. **Mobile TODOs** - Grouped by feature area (Onboarding, Gallery Editor, Analytics, etc.)
4. **Technical Debt** - Credential rotation, deprecated patterns, cleanup tasks
5. **Referenced Tickets** - Any TODOs that reference Jira/GitHub issue numbers (e.g., GAL-3898)

**Format:** Table with columns: Priority | Area | File | Description

---

### Task 4: Write `docs/DEPENDENCIES.md`

Document key third-party services that require ongoing subscriptions, API keys, or maintenance.

**Sections:**

1. **Authentication Services**
   - Magic Link (`@magic-sdk/react-native-expo`) - Legacy mobile auth provider
   - WalletConnect - Multi-chain wallet connections
   - Farcaster (`@farcaster/auth-kit`) - Social login

2. **Analytics & Monitoring**
   - Mixpanel (`mixpanel-browser`, `mixpanel-react-native`) - Event tracking
   - Sentry (`@sentry/nextjs`, `@sentry/react-native`) - Error monitoring
   - Vercel Analytics (`@vercel/analytics`) - Web analytics

3. **APIs & Content**
   - OpenSea API - NFT metadata
   - Sanity CMS - Content management (announcements, portable text)
   - Infura - Ethereum RPC provider
   - Formspree - Contact forms
   - ReCaptcha - Bot protection

4. **Blockchain/Web3**
   - Ethers.js (v5 web, v6 mobile) - Ethereum interaction
   - Viem - Alternative Ethereum library (mobile)
   - Taquito - Tezos support
   - Rainbow Kit - Wallet UI

5. **Mobile Platform**
   - Expo SDK 50 - React Native framework
   - EAS Build - Mobile CI/CD

**For each service include:** Package name, version, what it does, whether it requires a paid subscription or API key, and where the key is configured.

---

## Acceptance Criteria

- [x] Stale remote branches (last commit before Sept 2025) deleted
- [x] `docs/ARCHITECTURE.md` covers monorepo structure, build system, auth, feature flags, GraphQL, CI/CD
- [x] `docs/KNOWN-ISSUES.md` consolidates all TODOs/FIXMEs with file paths and priorities
- [x] `docs/DEPENDENCIES.md` lists all key 3rd party services with subscription/maintenance notes
- [x] All docs match existing README tone (practical, direct, code examples)
- [ ] Changes committed on a feature branch

## Execution Order

Tasks 2, 3, and 4 (documentation) can run in parallel. Task 1 (branch cleanup) is independent and can run anytime.

Recommended: Run Task 1 first (quick, cleans up git state), then Tasks 2-4 in parallel.
