export function getBaseUrl(): string {
  const environment = process.env.NEXT_PUBLIC_DEPLOY_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV;

  if (environment === 'production') {
    return 'https://gallery.so';
  } else if (environment === 'development') {
    return `https://gallery-dev.vercel.app`;
  } else if (environment === 'preview') {
    const deploymentUrl = process.env.NEXT_PUBLIC_DEPLOY_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

    if (deploymentUrl) {
      return `https://${deploymentUrl}`;
    }
  }

  // Otherwise, we're probably running locally?
  return 'http://localhost:3000';
}
