import dynamic from 'next/dynamic';

import type { CmsTypes } from '~/scenes/ContentPages/cms_types';
import { fetchSanityContent } from '~/utils/sanity';

const LandingPageRoute = dynamic(() => import('~/scenes/LandingPage/LandingPageRoute'), {
  ssr: false,
});

type Props = {
  pageContent: CmsTypes.LandingPage;
};

export default function Index({ pageContent }: Props) {
  return <LandingPageRoute pageContent={pageContent} />;
}

const queryString = `*[_type == "landingPage"]{
  ...,
  "highlight1": highlight1->{
    heading,
    headingFont,
    body,
    media {
      mediaType,
      image{
        asset->{
          url
        },
        alt
      },
      video{
        asset->{
          url
        }
      }
    },
    orientation
  },
  "miniFeatureHighlights": miniFeatureHighlights[]->{
    heading,
    headingFont,
    orientation,
    body,
    externalLink,
    media{
      mediaType,
      image{
        asset->{
          url
        },
        alt
      },
      video{
        asset->{
          url
        }
      }
    }
  },
  "testimonials": testimonials[]->{
    pfp{
      asset->{
        url
      }
    },
    username,
    handle,
    date,
    platformIcon,
    caption
  },
  "featuredProfiles": featuredProfiles[]->{
    coverImages[]{
      asset->{
        url
      },
      alt
    },
    pfp{
      asset->{
        url
      },
      alt
    },
    username,
    bio,
    profileType
  }
}`;

export const getServerSideProps = async () => {
  const content = await fetchSanityContent(queryString);

  return {
    props: {
      pageContent: content[0],
    },
  };
};
