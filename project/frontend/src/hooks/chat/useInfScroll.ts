import { QueryParamsType } from '@/api/api';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import {
  MessageContentInterface,
  messageType,
} from '@/components/dm/message/MessageContent';
import { useCallback, useContext, useEffect } from 'react';

export const DEFAULT_PAGE_SIZE = 10;
export default function useInfScroll(
  messageStartRef: any,
  setMessages: (arg: any) => void,
  messages: MessageContentInterface[],
  type: messageType,
  channelId: string,
  isLastPage: boolean,
  setIsLastPage: (arg: boolean) => void,
  render: any,
  targetName?: string,
) {
  const { api } = useContext(ApiContext);

  const loadMoreMessages = useCallback(async () => {
    if (messages.length === 0) return;
    const lastCursor = messages[0].data.sentAt;
    console.log('loadMoreMessages');
    console.log('lastCursor', lastCursor);
    const queryRequest: QueryParamsType = {
      pageSize: DEFAULT_PAGE_SIZE,
      cursorTimestamp: lastCursor,
    };
    let res: any;
    if (type === messageType.DM) {
      if (targetName === undefined) return;
      res = await api.dmControllerGetDmChannelMessages(
        targetName,
        queryRequest,
      );
    } else {
      res = await api.channelControllerGetChannelMessages(
        channelId,
        queryRequest,
      );
    }
    if (res.data.length === 0) setIsLastPage(true);
    else {
      setMessages((prevState: MessageContentInterface[]) => {
        const prevData = prevState.filter(
          (data) => data.type !== 'scroll-target',
        );
        res.data.push({
          type: 'scroll-target',
        });
        return [...res.data, ...prevData];
      });
    }
  }, [channelId, messages, api, setMessages, setIsLastPage, targetName, type]);

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (messageStartRef.current) {
      observer.observe(messageStartRef.current);
    }

    function handleObserver(entities: any, observer: any) {
      const target = entities[0];
      if (target.isIntersecting) {
        if (isLastPage || render.isSocketRender) return;
        loadMoreMessages();
      }
    }

    return () => observer.disconnect();
  }, [messageStartRef, channelId, loadMoreMessages, isLastPage, render]);
}
