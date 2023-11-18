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
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
};

export function QueryClientProvider({ children }: PropsWithChildren) {
  const clientPersist = usePersist(() => new QueryClient(queryClientConfig));

  return <QCP client={clientPersist.current}>{children}</QCP>;
}
