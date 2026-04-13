# Known Issues & Technical Debt

Last updated: 2026-02-06.

## Critical

- **Environment setup required** - Several auth and RPC integrations depend on local environment configuration. Expect to provide your own provider credentials before running production-like builds.

## Major Areas

### NFT Detail & Preview (GAL-4229)

10+ TODOs across `NftDetailPage/` and `NftPreview/`. The error boundaries and asset rendering pipeline need simplification. There's also a hack for videos returned by OpenSea as images (`NftDetailImage.tsx:33`) that should be removed after migrating off OS.

### Gallery Editor

- Web: Error toast silenced pending granular server responses (`GalleryEditorContext.tsx:533`), non-square image handling, smooth scaling for drag-and-drop
- Mobile: Missing support for moving rows between sections and items between rows (`GalleryEditorContext.tsx:306,321`)

### Onboarding

- Multisync is too slow for the onboarding flow (`OnboardingUsernameScreen.tsx:152`)
- Multi-chain sync not yet supported (`OnboardingAddUsernamePage.tsx:174`)
- Auth redirect doesn't remember user's intended destination (`GalleryAuthenticatedRoute.tsx:8`)

### Post Composer

Multiple fallback values defined but never used in `PostComposerContext.tsx` (tokenId, contract, collection/token titles, image_url). Chain-specific autosync not implemented.

### Analytics Prop-Drilling

15+ components across web and mobile have `TODO analytics prop drill` comments. The analytics tracking pattern needs a centralized approach instead of manual prop-drilling through ProfilePicture, Select, ButtonChip, Markdown, UserFollowCard, etc.

### Dark Mode (Web)

`IconContainer.tsx` has 5 temporary dark mode workarounds. Needs proper refactoring with official dark mode support.

### Error Handling Gaps

Several API hooks are missing error handling: `useSetSpamPreference`, `useUpdateNft`, `useRemoveWallet`, `useMintContractWithQuantity`. Comments and mentions are missing from optimistic responses in `useCommentOnFeedEvent` and `useCommentOnPost`.

Run `grep -rn "TODO\|FIXME\|HACK\|XXX" apps/ packages/ --include="*.ts" --include="*.tsx"` for the full list.
