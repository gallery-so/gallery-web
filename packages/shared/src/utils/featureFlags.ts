// Static feature flags for pre-auth contexts where no Relay queryRef is available.
// For authenticated contexts with admin overrides, use isFeatureEnabled() instead.
export const STATIC_FEATURE_FLAGS = {
  SHOW_SOCIAL_CONNECTIONS: false,
} as const;
