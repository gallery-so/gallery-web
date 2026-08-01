import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const FONT_FILENAMES = [
  'ABCDiatype-Regular.ttf',
  'ABCDiatype-Bold.ttf',
  'GT-Alpina-Standard-Light.ttf',
  'GT-Alpina-Standard-Light-Italic.ttf',
];

const appDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryDirectory = path.resolve(appDirectory, '../..');
const sharedFontDirectory = path.join(repositoryDirectory, 'packages/shared/src/fonts');
const generatedAssetDirectory = path.join(appDirectory, 'public/media/system/opengraph');
const generatedFontDirectory = path.join(generatedAssetDirectory, 'fonts');
const galleryWordmarkPath = path.join(
  repositoryDirectory,
  'apps/web/public/icons/logo-large-2.svg'
);

await mkdir(generatedFontDirectory, { recursive: true });

await Promise.all(
  FONT_FILENAMES.map(async (filename) => {
    const source = path.join(sharedFontDirectory, filename);
    const destination = path.join(generatedFontDirectory, filename);
    const sourceStats = await stat(source);

    if (sourceStats.size === 0) {
      throw new Error(`Required OpenGraph font is empty: ${source}`);
    }

    await copyFile(source, destination);
  })
);

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: '#ffffff',
  },
})
  .composite([
    {
      input: await sharp(galleryWordmarkPath).resize({ width: 632 }).png().toBuffer(),
      gravity: 'centre',
    },
  ])
  .png()
  .toFile(path.join(generatedAssetDirectory, 'gallery-full-logo.png'));
