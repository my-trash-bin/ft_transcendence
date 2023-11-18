import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export function getClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: 'http://localhost:4000/graphql',
    }),
    cache: new InMemoryCache({
      typePolicies: {
        DmUser: {
          fields: {
            latestTime: {
              read(value) {
                return new Date(parseInt(value));
              },
            },
          },
        },
        Channel: {
          fields: {
            latestTime: {
              read(value) {
                return new Date(parseInt(value));
              },
            },
          },
        },
      },
    }),
  });
}
