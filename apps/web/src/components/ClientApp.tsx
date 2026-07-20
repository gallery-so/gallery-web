import { Analytics } from '@vercel/analytics/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import GoogleAnalytics from '~/components/GoogleAnalytics';
import AppProvider from '~/contexts/AppProvider';
import GlobalLayoutContext from '~/contexts/globalLayout/GlobalLayoutContext';
import { createRelayEnvironmentFromRecords } from '~/contexts/relay/RelayProvider';
import { RelayResetContext } from '~/contexts/RelayResetContext';
import type { GalleryAppProps } from '~/pages/_app';

export default function ClientApp({ Component, pageProps }: GalleryAppProps) {
  const [relayEnvironment, setRelayEnvironment] = useState(() =>
    createRelayEnvironmentFromRecords({})
  );
  const router = useRouter();

  const componentPreloadedQuery = Component?.preloadQuery?.({
    relayEnvironment,
    query: router.query,
  });
  const globalLayoutContextPreloadedQuery = GlobalLayoutContext.preloadQuery?.({
    relayEnvironment,
    query: router.query,
  });

  if (!globalLayoutContextPreloadedQuery) {
    throw new Error('Preloaded Queries were not returned from preloadQuery function');
  }

  const resetRelayEnvironment = useCallback(() => {
    setRelayEnvironment(createRelayEnvironmentFromRecords({}));
  }, []);

  useEffect(
    function reloadPageWhenNavigatingInAndOutOfBase() {
      let lastRoute = window.location.pathname;

      function handleRouteChange(url: string) {
        if (lastRoute === '/base' || url === '/base') {
          window.location.href = url;
        }

        lastRoute = url;
      }

      router.events.on('routeChangeStart', handleRouteChange);
      return () => router.events.off('routeChangeStart', handleRouteChange);
    },
    [router.events]
  );

  const isVercelAnalyticsEnabled = false;

  return (
    <RelayResetContext.Provider value={resetRelayEnvironment}>
      <AppProvider
        relayEnvironment={relayEnvironment}
        globalLayoutContextPreloadedQuery={globalLayoutContextPreloadedQuery}
      >
        <GoogleAnalytics />
        {isVercelAnalyticsEnabled && (
          <Analytics
            beforeSend={(event) => {
              return event;
            }}
          />
        )}
        <Component {...pageProps} preloadedQuery={componentPreloadedQuery} />
      </AppProvider>
    </RelayResetContext.Provider>
  );
}
