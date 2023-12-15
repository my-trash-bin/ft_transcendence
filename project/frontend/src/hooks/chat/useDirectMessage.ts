import { unwrap } from '@/api/unwrap';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useCallback, useContext } from 'react';
import { useQueries } from 'react-query';

export default function useDirectMessage(
  channelId: string,
  targetName: string,
) {
  const { api } = useContext(ApiContext);
  const dmInfoFn = useCallback(
    async () => unwrap(await api.usersControllerGetUsetByNickname(targetName)),
    [api, targetName],
  );
  const initialData = useCallback(
    async () => unwrap(await api.dmControllerGetDmChannelMessages(targetName)),
    [api, targetName],
  );
  const data = useQueries([
    { queryKey: 'userByNickanme', queryFn: dmInfoFn },
    { queryKey: 'channelMessage', queryFn: initialData },
  ]);
  const isLoading = data.some((d: any) => d.isLoading);
  if (isLoading) return { isLoading: true };
  const channelMessage: any = data[1].data;
  if (channelMessage.length > 0) {
    channelMessage.push({
      type: 'scroll-target',
    });
  }
  return {
    isLoading: isLoading,
    dmInfo: data[0].data,
    channelMessage,
  };
}
