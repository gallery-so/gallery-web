import { Suspense } from 'react';
import { useFragment, useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import { LandingPageRouteQuery } from '~/generated/LandingPageRouteQuery.graphql';
import { LandingPageRouteRedirectFragment$key } from '~/generated/LandingPageRouteRedirectFragment.graphql';
import GalleryRedirect from '~/scenes/_Router/GalleryRedirect';
import GalleryRoute from '~/scenes/_Router/GalleryRoute';
import type { CmsTypes } from '~/scenes/ContentPages/cms_types';

import LandingPageScene from './LandingPage';

type LandingPageSceneWithRedirectProps = {
  queryRef: LandingPageRouteRedirectFragment$key;
  pageContent: CmsTypes.LandingPage;
};

function LandingPageSceneWithRedirect({
  queryRef,
  pageContent,
}: LandingPageSceneWithRedirectProps) {
  const query = useFragment(
    graphql`
      fragment LandingPageRouteRedirectFragment on Query {
        viewer {
          ... on Viewer {
            __typename
          }
        }
      }
    `,
    queryRef
  );

  if (query.viewer?.__typename === 'Viewer') {
    return <GalleryRedirect to={{ pathname: '/latest' }} />;
  }

  return <LandingPageScene pageContent={pageContent} />;
}

type Props = {
  pageContent: CmsTypes.LandingPage;
};

export default function LandingPageRoute({ pageContent }: Props) {
  const query = useLazyLoadQuery<LandingPageRouteQuery>(
    graphql`
      query LandingPageRouteQuery {
        ...LandingPageRouteRedirectFragment
      }
    `,
    {}
  );

  return (
    <GalleryRoute
      element={
        <Suspense fallback={<LandingPageScene pageContent={pageContent} />}>
          <LandingPageSceneWithRedirect queryRef={query} pageContent={pageContent} />
        </Suspense>
      }
      navbar={false}
      footerTheme="dark"
    />
  );
}
