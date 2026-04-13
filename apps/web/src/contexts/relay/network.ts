import { FetchFunction, SubscribeFunction } from 'relay-runtime';

import { baseurl } from '~/contexts/swr/fetch';
import {
  createRelayFetchFunction,
  createRelaySubscribeFunction,
  PersistedQueriesMap,
} from '~/shared/relay/network';
// Use this once we fix the ERRCONNRESET issue
// import { baseUrl } from '~/utils/baseUrl';

export function getGraphqlHost() {
  // Use this once we fix the ERRCONNRESET issue
  // return baseUrl
  return baseurl;
}

export function getGraphqlPath(operationName: string) {
  return `/glry/graphql/query/${operationName}`;
}

export function getGraphqlUrl(operationName: string) {
  return `${getGraphqlHost()}${getGraphqlPath(operationName)}`;
}

const fetchFunctionWithoutTracing = createRelayFetchFunction({
  url: (request) => getGraphqlUrl(request.name),
  headers: () => {
    const platform = navigator.platform;

    let osHeader = 'Unknown';
    if (platform.startsWith('Mac')) {
      // The user is on a Mac
      osHeader = 'Mac';
    } else if (platform.startsWith('Win')) {
      // The user is on Windows
      osHeader = 'Windows';
    } else if (platform.startsWith('Linux')) {
      // The user is on Linux
      osHeader = 'Linux';
    }

    return {
      'X-Platform': 'Web',
      'X-OS': osHeader,
    };
  },
  persistedQueriesFetcher: () =>
    import('persisted_queries.json').then((map) => {
      // @ts-expect-error Types not aligning because it's a module
      return map as PersistedQueriesMap;
    }),
});

export const relaySubscribeFunction: SubscribeFunction = createRelaySubscribeFunction({
  url: process.env.NEXT_PUBLIC_GRAPHQL_SUBSCRIPTION_URL as string,
});

export const relayFetchFunction: FetchFunction = (request, variables, cacheConfig, uploadables) => {
  return fetchFunctionWithoutTracing(request, variables, cacheConfig, uploadables);
};
