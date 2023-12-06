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
        return (await api.dmControllerGetDmChannelMessages(targetName)).data;
      } else if (channelId) {
        return (await api.channelControllerGetChannelMessages(channelId)).data;
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
