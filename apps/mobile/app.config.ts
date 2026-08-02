import * as dotenv from 'dotenv';
import { ConfigContext, ExpoConfig } from 'expo/config';
import * as fs from 'fs';
import * as path from 'path';

import { EnvironmentSchema } from './env/env';

// TODO: fix zod return type later
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readEnvironmentFromFile(file: string, schema: any) {
  const object = dotenv.parse(fs.readFileSync(file, 'utf-8'));

  const result = schema.safeParse(object);

  if (result.success === true) {
    return result.data;
  } else if (result.success === false) {
    throw new Error(`Could not validate your ${file}:\n\n${result.error.message}`);
  }
}

const environmentVariablePath = path.join(
  __dirname,
  `./env/.env.${process.env.EXPO_PUBLIC_ENV ?? 'prod'}`
);

const environmentVariables = readEnvironmentFromFile(environmentVariablePath, EnvironmentSchema);

const commitHash = process.env.EAS_BUILD_GIT_COMMIT_HASH;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  scheme: 'gallerylabs',
  name: 'Gallery Labs',
  slug: 'gallery-mobile',
  privacy: 'unlisted',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  version: '1.0.63',
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    config: {
      usesNonExemptEncryption: false,
    },
    supportsTablet: false,
    bundleIdentifier: 'com.usegallery.gallery',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
      dark: {
        backgroundColor: '#000000',
        image: './assets/splash-dark.png',
      },
    },
  },
  android: {
    blockedPermissions: ['android.permission.RECORD_AUDIO'],
    package: 'com.usegalleryandroid.gallery',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
      dark: {
        backgroundColor: '#000000',
        image: './assets/splash-dark.png',
      },
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    ...environmentVariables,
    commitHash,
  },
  plugins: [
    'expo-barcode-scanner',
    'expo-font',
    'expo-secure-store',
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
        },
      },
    ],
  ],
});
