export default function isProduction() {
  return (
    (process.env.NEXT_PUBLIC_DEPLOY_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV) === 'production'
  );
}
