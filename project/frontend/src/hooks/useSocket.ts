import useToast from '@/components/common/useToast';
import { messageType } from '@/components/dm/message/MessageContent';
import { getSocket } from '@/lib/Socket';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useSocket = (
  type: messageType,
  setMessages: any,
  channelId: string,
  targetName: string | undefined,
) => {
  const router = useRouter();
  const { openMessage } = useToast();

  useEffect(() => {
    const socket = getSocket();
    const localMe = localStorage.getItem('me');
    const me = localMe ? JSON.parse(localMe) : null;


    const handleDirectMessage = (
      socket: any,
      setMessages: any,
      channelId: string,
    ) => {
      socket.on(`directMessage`, (res: any) => {
        if (res.data.channelId === channelId)
          setMessages((messages: any) => [...messages, res]);
      });
    };

    const handleChannelMessage = (
      socket: any,
      setMessages: any,
      channelId: string | undefined,
    ) => {
      socket.on(`channelMessage`, (res: any) => {
        if (res.data.channelId === channelId) {
          setMessages((messages: any) => [...messages, res]);
        }
      });
    };

    const handleLeave = (
      socket: any,
      setMessages: any,
      meId: string | undefined,
      router: any,
    ) => {
      socket.on('leave', (res: any) => {
        if (res.data.member.id === meId) {
          openMessage('채널에서 나갔습니다!');
          router.replace('/channel');
        } else {
          setMessages((messages: any) => [...messages, res]);
        }
      });
    };

    const handleJoin = (socket: any, setMessages: any) => {
      socket.on('join', (res: any) => {
        setMessages((messages: any) => [...messages, res]);
      });
    };

    const handleKickBanPromote = (
      socket: any,
      meId: string | undefined,
      channelId: string | undefined,
      router: any,
    ) => {
      socket.on('kickBanPromote', (res: any) => {
        const targetUserId = res.data.targetUser.id;

        if (res.data.actionType === 'KICK' || res.data.actionType === 'BANNED') {
          if (targetUserId === meId && channelId === res.data.channelId) {
            if (res.data.actionType === 'KICK') {
              openMessage('방장이 나가라고 합니다!');
            } else {
              openMessage('방장이 채널에서 차단했습니다!');
            }
            router.replace('/channel');
          }
        } else if (
          res.data.actionType === 'PROMOTE' &&
          channelId === res.data.channelId &&
          targetUserId === meId
        ) {
          openMessage('관리자가 되었습니다!');
        } else if (
          res.data.actionType === 'MUTE' &&
          targetUserId === meId &&
          channelId === res.data.channelId
        ) {
          openMessage('방장이 1분간 조용히 하래요 ㅠ');
        }
      });
    };
    if (type === messageType.DM) {
      handleDirectMessage(socket, setMessages, channelId);
    } else {
      handleChannelMessage(socket, setMessages, channelId);
      handleLeave(socket, setMessages, me?.id, router);
      handleJoin(socket, setMessages);
      handleKickBanPromote(socket, me?.id, channelId, router);
    }
    return () => {
      socket.off('directMessage');
      socket.off('channelMessage');
      socket.off('leave');
      socket.off('join');
      socket.off('kickBanPromote');
    };
  }, [type, setMessages, channelId, router, openMessage, targetName]);
};
