import { unwrap } from '@/api/unwrap';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useCallback, useContext } from 'react';
import { useQueries } from 'react-query';

export default function useChannelMessage(channelId: string) {
  const { api } = useContext(ApiContext);
  const channelInfoFn = useCallback(
    async () => unwrap(await api.channelControllerFindChannelInfo(channelId)),
    [api, channelId],
  );
  const initialData = useCallback(
    async () =>
      unwrap(await api.channelControllerGetChannelMessages(channelId)),
    [api, channelId],
  );
  const data = useQueries([
    { queryKey: 'channelInfo', queryFn: channelInfoFn },
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
    channelInfo: data[0].data,
    channelMessage,
  };
}
