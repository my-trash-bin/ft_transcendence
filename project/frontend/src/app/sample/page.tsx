'use client';

import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';

import { ApiContext } from '../_internal/provider/ApiContext';

export default function Page() {
  const { api } = useContext(ApiContext);

  const { isLoading, isError, data } = useQuery(
    ['sample'],
    useCallback(async () => (await api.appControllerGetProfile()).data, [api]),
  );

  return isLoading ? <>Loading...</> : <>{JSON.stringify(data)}</>;
}
