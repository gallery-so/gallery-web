# Third-Party Dependencies

Key external services and libraries that require ongoing subscriptions, API keys, or maintenance.

## Authentication Services

| Service | Web Package | Mobile Package | Requires API Key | Key Location |
|---------|-------------|----------------|------------------|--------------|
| **Magic Link** | N/A | `@magic-sdk/react-native-expo@^16.0.0` | Yes (Public Key) | `EXPO_PUBLIC_MAGIC_LINK_PUBLIC_KEY` |
| **WalletConnect** | `@walletconnect/walletlink-connector@6.1.9` | `@walletconnect/modal-react-native@^1.0.0-rc.10` | Yes (Project ID) | `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` |
| **Farcaster** | `@farcaster/auth-kit@^0.2.1` | `@farcaster/auth-kit@^0.2.1` | No | N/A |
| **RainbowKit** | `@rainbow-me/rainbowkit@^1.0.5` | N/A | No | Uses WalletConnect Project ID |
| **Coinbase Wallet** | via RainbowKit | `@coinbase/wallet-mobile-sdk@^1.0.13` | No | N/A |

**Notes:**
- Production is read-only and does not expose a supported sign-in flow
- WalletConnect requires a free project ID from cloud.walletconnect.com

## Analytics & Monitoring

| Service | Web Package | Mobile Package | Requires API Key | Key Location |
|---------|-------------|----------------|------------------|--------------|
| **Mixpanel** | `mixpanel-browser@^2.41.0` | `mixpanel-react-native@^3.0.0-beta.2` | Yes (Token) | `NEXT_PUBLIC_MIXPANEL_TOKEN` |

**Notes:**
- Mixpanel mobile SDK is on a beta version

## APIs & Content Services

| Service | Package | Requires API Key | Key Location | Subscription |
|---------|---------|------------------|--------------|-------------|
| **OpenSea API** | Direct HTTP calls | Yes (API Key) | `NEXT_PUBLIC_OPENSEA_API_BASEURL` | Free tier available |
| **Sanity CMS** | `@portabletext/react@^3.0.11` | Yes (Project ID) | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Paid plan for production |
| **Infura** | Used via ethers.js | Yes (API Key) | `NEXT_PUBLIC_INFURA_API_KEY` | Free tier with rate limits |
| **Formspree** | Direct form submission | Yes (Collection ID) | `NEXT_PUBLIC_FORMSPREE_COLLECTION_ID` | Free tier available |
| **Twitter OAuth** | Direct OAuth flow | Yes (OAuth URL) | `NEXT_PUBLIC_TWITTER_OAUTH_URL` | Twitter developer account |

**Notes:**
- OpenSea API is used for NFT metadata fetching
- Sanity CMS manages announcements and content via portable text
- Infura provides Ethereum RPC endpoints

## Blockchain / Web3

| Library | Web Version | Mobile Version | Notes |
|---------|-------------|----------------|-------|
| **ethers.js** | `^5.6.9` | `6.11.1` | Major version difference between web and mobile |
| **viem** | `^2.9.6` | `^1.19.11` | Major version difference between web and mobile |
| **@taquito/taquito** | `17.5.0` | N/A | Tezos blockchain support (web only) |
| **@airgap/beacon-sdk** | `^3.1.3` | N/A | Tezos wallet connection (web only) |

**Notes:**
- Web and mobile use different major versions of ethers.js and viem
- Tezos support is web-only via Taquito and Beacon SDK
- No paid subscriptions required for these libraries

## Mobile Platform

| Service | Package | Notes |
|---------|---------|-------|
| **Expo** | `expo@^50.0.17` | React Native framework, SDK 50 |
| **EAS Build** | Via `eas-cli` | Cloud builds for iOS and Android |
| **EAS Submit** | Via `eas-cli` | App store submissions |
| **React Native** | `react-native@0.73.4` | Core mobile framework |

**Notes:**
- Expo SDK 50 requires Xcode 16.4 for iOS builds
- EAS Build and Submit require an Expo account (paid plan for production builds)
- Mobile builds are configured in `apps/mobile/eas.json`

## Core Framework Dependencies

| Library | Web Version | Mobile Version | Shared Version |
|---------|-------------|----------------|----------------|
| **React** | `^18.2.0` | `^18.2.0` | N/A |
| **Relay** | `^14.1.0` (compiler) | `^14.1.0` (compiler) | N/A |
| **TypeScript** | `^5.2.2` | `^5.2.2` | `^5.2.2` |
| **GraphQL** | `^16.8.1` | `^16.8.1` | `^16.8.1` |

## Key Mobile Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| `@shopify/flash-list` | `1.6.3` | High-performance list rendering |
| `react-native-reanimated` | `^3.8.1` | Animations |
| `@react-navigation/native` | `^6.1.6` | Navigation |
| `react-native-mmkv` | `^2.12.1` | Fast key-value storage |
| `graphql-ws` | `^5.11.3` | GraphQL WebSocket subscriptions |
