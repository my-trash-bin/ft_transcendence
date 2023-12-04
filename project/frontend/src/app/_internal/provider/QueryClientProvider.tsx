'use client';

import { usePersist } from '@-ft/use-persist';
import { PropsWithChildren } from 'react';
import {
  QueryClientProvider as QCP,
  QueryClient,
  QueryClientConfig,
} from 'react-query';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.error(`error from react-query: ${error}`);
        if (error.message === 'Unauthorized') {
          location.href = '/';
        }
        throw error;
      },
      retry: 0,
    },
  },
};

export function QueryClientProvider({ children }: PropsWithChildren) {
  const clientPersist = usePersist(() => new QueryClient(queryClientConfig));

  return <QCP client={clientPersist.current}>{children}</QCP>;
}
