export function getBaseUrl(): string {
  const environment = process.env.NEXT_PUBLIC_DEPLOY_ENV;

  if (environment === 'production') {
    return 'https://gallery.so';
  }

  if (environment === 'development' || environment === 'preview') {
    const deploymentUrl = process.env.NEXT_PUBLIC_DEPLOY_URL;

    if (deploymentUrl) {
      return deploymentUrl.startsWith('http') ? deploymentUrl : `https://${deploymentUrl}`;
    }
  }

  // Otherwise, we're probably running locally?
  return 'http://localhost:3000';
}
