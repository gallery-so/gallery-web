import { IS_READ_ONLY_MODE } from '~/constants/readOnlyMode';
import GalleryRedirect from '~/scenes/_Router/GalleryRedirect';

export default function Auth() {
  if (IS_READ_ONLY_MODE) {
    return <GalleryRedirect to={{ pathname: '/home' }} />;
  }

  return <GalleryRedirect to={{ pathname: '/home' }} />;
}
