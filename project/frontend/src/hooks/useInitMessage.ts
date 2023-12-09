import { unwrap } from '@/api/unwrap';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import {
  MessageContentInterface,
  messageType,
} from '@/components/dm/message/MessageContent';
import { useCallback, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';

export const useInitMessage = (
  type: any,
  setMessages: any,
  channelId?: string,
  targetName?: string,
) => {
  const { api } = useContext(ApiContext);

  const { data: initialData, refetch } = useQuery(
    'fetchChannelMsg',
    useCallback(async () => {
      if (type === messageType.DM && targetName) {
        return unwrap(await api.dmControllerGetDmChannelMessages(targetName));
      } else if (channelId) {
        return unwrap(await api.channelControllerGetChannelMessages(channelId));
      }
    }, [api, channelId, type, targetName]),
    { enabled: false },
  );

  useEffect(() => {
    refetch();
  }, [channelId, refetch]);

  useEffect(() => {
    if (initialData) {
      setMessages(initialData as MessageContentInterface[]);
    }
  }, [initialData, setMessages]);
};
