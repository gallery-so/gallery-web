import { defineCloudflareConfig } from '@opennextjs/cloudflare';

const config = defineCloudflareConfig();

// Privy's ofetch dependency is traced using its Node.js export. Matching that
// condition during bundling avoids selecting untraced workerd-only files.
config.cloudflare = {
  ...config.cloudflare,
  useWorkerdCondition: false,
};

export default config;
