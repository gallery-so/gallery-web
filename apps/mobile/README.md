# Gallery Mobile

React Native app built with Expo (SDK 50), Relay, and Hermes.

## Prerequisites

| Tool      | Version | Notes                                                                                     |
| --------- | ------- | ----------------------------------------------------------------------------------------- |
| Node.js   | 22.23.1 | See `.nvmrc` in repo root                                                                 |
| Yarn      | 3.4.1   | Bundled via `.yarn/releases/`                                                             |
| Xcode     | 16.4    | Download from [Apple Developer](https://developer.apple.com/download/all/?q=Xcode%2016.4) |
| CocoaPods | latest  | `gem install cocoapods`                                                                   |

## First-time setup

```bash
# From the repo root
nvm use
yarn install

# Generate Relay artifacts
moon run mobile:relay-codegen

# Install iOS pods (generated during prebuild, but if needed manually)
moon run mobile:ios-prebuild
```

### Environment variables

Env files live in `apps/mobile/env/`:

- `.env.dev` — dev API endpoints, tokens
- `.env.prod` — production endpoints
- `.env.secret` — local-only secrets (`PRIVY_APP_ID`, `SENTRY_AUTH_TOKEN`)

Copy the secret template and fill in values:

```bash
cp apps/mobile/env/.env.secret.example apps/mobile/env/.env.secret
```

## Running the app

### iOS Simulator

```bash
moon run mobile:ios
```

To run against the dev environment:

```bash
EXPO_PUBLIC_ENV=dev moon run mobile:ios
```

### Android Emulator

```bash
moon run mobile:android
```

### Physical device

```bash
# iOS
moon run mobile:ios-device

# Android
moon run mobile:android-device
```

## Using Xcode 16.4

This codebase requires **Xcode 16.4**. Download it from [Apple Developer Downloads](https://developer.apple.com/download/all/?q=Xcode%2016.4).

If your default Xcode is newer, point `DEVELOPER_DIR` to the 16.4 installation:

```bash
DEVELOPER_DIR="/Users/jakzaizzat/Downloads/Xcode.app/Contents/Developer" moon run mobile:ios
```

If the app doesn't appear in the simulator after building, install and launch it manually:

```bash
xcrun simctl install booted /path/to/DerivedData/GalleryLabs-*/Build/Products/Debug-iphonesimulator/GalleryLabs.app
xcrun simctl launch booted com.usegallery.gallery
```

## Debugging

Press `m` in the shell running the app to open dev tools, then select **Debugger** from the menu (local env only).

## Other commands

| Command                         | Description          |
| ------------------------------- | -------------------- |
| `moon run mobile:relay-codegen` | Run Relay compiler   |
| `moon run mobile:relay-watch`   | Watch mode for Relay |
| `moon run mobile:typecheck`     | Type checking        |
| `moon run mobile:ios-build`     | Local EAS iOS build  |
| `moon run mobile:version-bump`  | Bump app version     |

## GraphQL schema

From the repo root:

```bash
yarn fetch-schema       # production schema
yarn fetch-schema-dev   # dev schema
```

## Troubleshooting

**Pod install fails**: Delete `ios/Pods` and `ios/Podfile.lock`, then run `moon run mobile:ios-prebuild` again.

**Stale build cache**: Clear DerivedData:

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/GalleryLabs-*
```

**Metro bundler issues**:

```bash
watchman watch-del-all
yarn start --reset-cache
```
