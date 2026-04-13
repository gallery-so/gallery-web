/**
 * /home used to serve the curated "For You" / "Trending" feed.
 * Now redirects to /latest permanently.
 */
export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/latest',
      permanent: true,
    },
  };
};

export default function Home() {
  return null;
}
