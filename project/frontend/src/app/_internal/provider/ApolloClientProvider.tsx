'use client';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  from,
  split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { createClient } from 'graphql-ws';
import { PropsWithChildren, useMemo } from 'react';

const NEXT_PUBLIC_GRAPHQL_SERVER_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL;
const NEXT_PUBLIC_GRAPHQL_SERVER_SUBSCRIPTIONS_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_SERVER_SUBSCRIPTIONS_URL;

if (
  !NEXT_PUBLIC_GRAPHQL_SERVER_URL ||
  !NEXT_PUBLIC_GRAPHQL_SERVER_SUBSCRIPTIONS_URL
)
  throw new Error('Missing environment variables! check source code');

export function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error({ message, locations, path }),
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
  async function customFetch(
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
  ): Promise<Response> {
    const token = await getAccessToken();
    return await fetch(input, {
      ...init,
      mode: 'cors',
      headers: {
        ...init?.headers,
        'Apollo-Require-Preflight': 'true',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }
  const uploadLink = createUploadLink({
    uri: NEXT_PUBLIC_GRAPHQL_SERVER_URL, // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    fetch: customFetch,
  });

  const wsLink =
    typeof window !== 'undefined'
      ? new GraphQLWsLink(
          createClient({
            url: NEXT_PUBLIC_GRAPHQL_SERVER_SUBSCRIPTIONS_URL!,
            connectionParams: async () => {
              const token = await getAccessToken();
              return {
                authToken: token,
              };
            },
          }),
        )
      : null;

  const httpLink = from([errorLink, uploadLink]);
  const link =
    typeof window !== 'undefined' && wsLink != null
      ? split(
          ({ query }) => {
            const def = getMainDefinition(query);
            return (
              def.kind === 'OperationDefinition' &&
              def.operation === 'subscription'
            );
          },
          wsLink,
          httpLink,
        )
      : httpLink;

  return new ApolloClient({
    connectToDevTools: true,
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          keyFields: [],
          fields: {},
        },
      },
    }),
  });
}

export interface ApolloClientProviderProps extends PropsWithChildren {}

export function ApolloClientProvider({ children }: ApolloClientProviderProps) {
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
