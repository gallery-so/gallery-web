// Polyfills for React Native wallet integrations
import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';

import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { LogBox } from 'react-native';
import { polyfill as polyfillEncoding } from 'react-native-polyfill-globals/src/encoding';
import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';
import { polyfill as polyfillReadableStream } from 'react-native-polyfill-globals/src/readable-stream';
import { polyfill as polyfillUrl } from 'react-native-polyfill-globals/src/url';
import { enableFreeze } from 'react-native-screens';

import App from './src/App';

function filterOutAnnoyingWarnings() {
  // eslint-disable-next-line no-console
  let previousWarn = console.warn;

  // eslint-disable-next-line no-console
  console.warn = (...args) => {
    const joined = args.join(' ');

    if (
      joined.includes('The provided value') ||
      joined.includes('Constants.manifest') ||
      joined.includes(
        'There was a problem sending log messages to your development environment [RangeError: Maximum call stack size exceeded (native stack depth)]'
      )
    ) {
      return;
    }

    previousWarn(...args);
  };
}

filterOutAnnoyingWarnings();

// Unimportant warnings from the fetch polyfill
LogBox.ignoreLogs([
  "The provided value 'moz",
  "The provided value 'ms-stream",
  'onAnimatedValueUpdate',
  'Could not render NFT',
  'Could not render FeedEvent',
  'Relay: Missing @required',
  'Tried to render EventTokenGrid without any tokens',
  'Non-serializable values were found',
  'Overriding previous layout animation',
  'There was a problem sending log message',
  'Constants.manifest has been deprecated in favor of Constants.expoConfig',
  // Warning only occurs when commenting before opening the bottom sheet because it uses lazyLoadQuery, which initializes the connection
  "CommentsBottomSheet_comments_connection' doesn't exist.",
]);

polyfillEncoding();
polyfillFetch();
polyfillReadableStream();
polyfillUrl();

enableFreeze(true);

registerRootComponent(App);
