import { defineCloudflareConfig } from '@opennextjs/cloudflare';

const config = defineCloudflareConfig();

// Keep the surrounding Next server bundle on its Node export condition. The
// image renderer imports its Worker entrypoint explicitly, while other web
// dependencies do not all ship their advertised workerd export files.
config.cloudflare = {
  ...config.cloudflare,
  useWorkerdCondition: false,
};

export default config;
