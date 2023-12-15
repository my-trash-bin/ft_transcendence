import useToast from '@/components/common/useToast';
import {
  MessageContentInterface,
  messageType,
} from '@/components/dm/message/MessageContent';
import { getSocket } from '@/lib/Socket';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const setMessageWithScrollTarget = (
  render: any,
  setMessages: any,
  res: any,
) => {
  render.isSocketRender = true;
  setMessages((prevState: MessageContentInterface[]) => {
    const prevData = prevState.filter((data) => data.type !== 'scroll-target');
    return [...prevData, res, { type: 'scroll-target' }];
  });
};

const handleDirectMessage = (
  socket: any,
  setMessages: any,
  channelId: string,
  render: any,
) => {
  socket.on(`directMessage`, (res: any) => {
    if (res.data.channelId === channelId) {
      setMessageWithScrollTarget(render, setMessages, res);
    }
  });
};

const handleChannelMessage = (
  socket: any,
  setMessages: any,
  channelId: string | undefined,
  render: any,
) => {
  socket.on(`channelMessage`, (res: any) => {
    if (res.data.channelId === channelId) {
      setMessageWithScrollTarget(render, setMessages, res);
    }
  });
};

export const useSocket = (
  type: any,
  setMessages: any,
  channelId: string,
  targetName: string | undefined,
  render: object,
) => {
  const router = useRouter();
  const { openIsOut, openIsKick, openIsBan, openIsMute, openIsPromote } =
    useToast();

  const handleLeave = useCallback(
    (socket: any, setMessages: any, meId: string | undefined, router: any) => {
      socket.on('leave', (res: any) => {
        if (res.data.member.id === meId) {
          openIsOut();
          router.replace('/channel');
        } else {
          setMessageWithScrollTarget(render, setMessages, res);
        }
      });
    },
    [render, openIsOut],
  );

  const handleJoin = useCallback(
    (socket: any, setMessages: any) => {
      socket.on('join', (res: any) => {
        setMessageWithScrollTarget(render, setMessages, res);
      });
    },
    [render],
  );

  const handleKickBanPromote = useCallback(
    (
      socket: any,
      meId: string | undefined,
      channelId: string | undefined,
      router: any,
    ) => {
      socket.on('kickBanPromote', (res: any) => {
        const targetUserId = res.data.targetUser.id;

        if (
          res.data.actionType === 'KICK' ||
          res.data.actionType === 'BANNED'
        ) {
          if (targetUserId === meId && channelId === res.data.channelId) {
            if (res.data.actionType === 'KICK') {
              openIsKick();
            } else {
              openIsBan();
            }
            router.replace('/channel');
          }
        } else if (
          res.data.actionType === 'PROMOTE' &&
          channelId === res.data.channelId &&
          targetUserId === meId
        ) {
          openIsPromote();
        } else if (
          res.data.actionType === 'MUTE' &&
          targetUserId === meId &&
          channelId === res.data.channelId
        ) {
          openIsMute();
        }
      });
    },
    [openIsBan, openIsKick, openIsMute, openIsPromote],
  );

  useEffect(() => {
    const socket = getSocket();
    const localMe = localStorage.getItem('me');
    const me = localMe ? JSON.parse(localMe) : null;
    if (type === messageType.DM) {
      handleDirectMessage(socket, setMessages, channelId, render);
    } else {
      handleChannelMessage(socket, setMessages, channelId, render);
      handleLeave(socket, setMessages, me?.id, router);
      handleJoin(socket, setMessages);
      handleKickBanPromote(socket, me?.id, channelId, router);
    }

    return () => {
      if (type === messageType.DM) {
        socket.off(`directMessage`);
      } else {
        socket.off(`channelMessage`);
        socket.off('leave');
        socket.off('join');
        socket.off('kickBanPromote');
      }
    };
  }, [
    type,
    setMessages,
    channelId,
    targetName,
    router,
    handleKickBanPromote,
    handleLeave,
    render,
    handleJoin,
  ]);
};
