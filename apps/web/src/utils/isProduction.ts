export default function isProduction() {
  return process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production';
}
