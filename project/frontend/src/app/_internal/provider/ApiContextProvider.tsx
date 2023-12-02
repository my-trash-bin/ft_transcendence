'use client';

import { usePersist } from '@-ft/use-persist';
import { PropsWithChildren } from 'react';

import { Api, ApiConfig } from '@/api/api';
import { ApiContext } from './ApiContext';

async function customFetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
): Promise<Response> {
  return await fetch(input, {
    ...init,
    mode: 'cors',
    headers: {
      ...init?.headers,
    },
    credentials: 'include',
  });
}

const apiConfig: ApiConfig<unknown> = {
  baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT,
  customFetch: customFetch as typeof fetch,
};

export function ApiContextProvider({ children }: PropsWithChildren) {
  const apiPersist = usePersist(() => new Api(apiConfig));

  return (
    <ApiContext.Provider value={apiPersist.current}>
      {children}
    </ApiContext.Provider>
  );
}
