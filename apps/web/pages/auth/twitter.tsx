import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import TwitterAuth from '~/components/Auth/TwitterAuth';
import { IS_READ_ONLY_MODE } from '~/constants/readOnlyMode';
import { HomeNavbar } from '~/contexts/globalLayout/GlobalNavbar/HomeNavbar/HomeNavbar';
import { twitterQuery } from '~/generated/twitterQuery.graphql';
import GalleryRedirect from '~/scenes/_Router/GalleryRedirect';
import GalleryRoute from '~/scenes/_Router/GalleryRoute';
import { STATIC_FEATURE_FLAGS } from '~/shared/utils/featureFlags';

export default function Twitter() {
  // Redirect before rendering TwitterAuth to prevent the connectSocialAccount
  // mutation from firing in useEffect when the feature is disabled
  if (IS_READ_ONLY_MODE || !STATIC_FEATURE_FLAGS.SHOW_SOCIAL_CONNECTIONS) {
    return <GalleryRedirect to={{ pathname: '/' }} />;
  }

  return <TwitterInner />;
}

function TwitterInner() {
  const query = useLazyLoadQuery<twitterQuery>(
    graphql`
      query twitterQuery {
        ...HomeNavbarFragment
        ...TwitterAuthQueryFragment
        viewer {
          ... on Viewer {
            user {
              id
            }
          }
        }
      }
    `,
    {}
  );

  const isAuthenticated = Boolean(query.viewer?.user?.id);

  if (!isAuthenticated) {
    return <GalleryRedirect to={{ pathname: '/' }} />;
  }

  return (
    <GalleryRoute
      element={<TwitterAuth queryRef={query} />}
      navbar={<HomeNavbar queryRef={query} />}
    />
  );
}
