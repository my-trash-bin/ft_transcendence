import { usePersist } from '@-ft/use-persist';
import { PropsWithChildren } from 'react';
import { Api, ApiConfig } from '../../../api/api';
import { ApiContext } from './ApiContext';

const apiConfig: ApiConfig<unknown> = {
  baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT,
};

export function ApiContextProvider({ children }: PropsWithChildren) {
  const apiPersist = usePersist(() => new Api(apiConfig));

  return (
    <ApiContext.Provider value={apiPersist.current}>
      {children}
    </ApiContext.Provider>
  );
}
