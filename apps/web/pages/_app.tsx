import 'src/scenes/WelcomeAnimation/intro.css';
import 'src/index.css';
import 'react-loading-skeleton/dist/skeleton.css';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { ComponentType, FC } from 'react';
import { useEffect } from 'react';
import type { PreloadedQuery } from 'react-relay';

import type { PreloadQueryFn } from '~/types/PageComponentPreloadQuery';
import isProduction from '~/utils/isProduction';
import welcomeDoormat from '~/utils/welcomeDoormat';

type NameOrProperty =
  | { name: string; property?: undefined }
  | { name?: undefined; property: string };
type MetaTag = NameOrProperty & {
  content: string;
};

export type MetaTagProps = {
  metaTags?: MetaTag[] | null;
};

export type PageComponent = ComponentType<
  MetaTagProps & { preloadedQuery?: PreloadedQuery<never> | null }
> & {
  preloadQuery?: PreloadQueryFn<never>;
};

type PageProps = MetaTagProps & { preloadedQuery: null | PreloadedQuery<never> };
export type GalleryAppProps = {
  Component: PageComponent;
  pageProps: PageProps;
};

const ClientApp = dynamic(() => import('~/components/ClientApp'), { ssr: false });

const App: FC<GalleryAppProps> = (props) => {
  useEffect(() => {
    if (isProduction()) welcomeDoormat();
  }, []);

  return (
    <>
      <Head>
        <title>Gallery</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        {props.pageProps.metaTags?.length ? (
          props.pageProps.metaTags.map((metaTag) => (
            <meta key={metaTag.name ?? metaTag.property} {...metaTag} />
          ))
        ) : (
          <>
            <meta name="description" content="Show your collection to the world." />

            <meta property="og:type" content="website" />
            <meta property="og:title" content="Gallery" />
            <meta property="og:description" content="Show your collection to the world." />

            <meta
              property="og:image"
              content="https://storage.googleapis.com/gallery-prod-assets/gallery_full_logo_v2.1.png"
            />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@gallery" />
          </>
        )}
      </Head>
      <div suppressHydrationWarning>
        <ClientApp {...props} />
      </div>
    </>
  );
};

export default App;
