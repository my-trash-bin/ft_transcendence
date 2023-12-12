import { messageType } from '@/components/dm/message/MessageContent';
import { getSocket } from '@/lib/Socket';
import { useEffect } from 'react';

const handleDirectMessage = (
  socket: any,
  setMessages: any,
  targetName: string | undefined,
) => {
  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;

  socket.on(`directMessage`, (res: any) => {
    if (
      res.data.member.nickname === targetName ||
      res.data.member.nickname === me?.nickname
    ) {
      setMessages((messages: any) => [...messages, res]);
    }
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
) => {
  socket.on('leave', (res: any) => {
    if (res.data.member.id === meId) {
      alert('채널에서 나갔습니다.');
      location.href = '/channel';
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
  setMessages: any,
  meId: string | undefined,
  channelId: string | undefined,
) => {
  socket.on('kickBanPromote', (res: any) => {
    const targetUserId = res.data.targetUser.id;

    if (res.data.actionType === 'KICK' || res.data.actionType === 'BANNED') {
      if (targetUserId === meId && channelId === res.data.channelId) {
        alert('채널에서 강퇴당했습니다.');
        location.href = '/channel';
      }
    } else if (
      res.data.actionType === 'PROMOTE' &&
      channelId === res.data.channelId &&
      targetUserId === meId
    ) {
      alert('채널에서 관리자가 되었습니다.');
    } else if (
      res.data.actionType === 'MUTE' &&
      targetUserId === meId &&
      channelId === res.data.channelId
    ) {
      alert('채널에서 음소거 되었습니다. 3분동안 메세지를 보낼 수 없습니다.');
    }
  });
};

export const useSocket = (
  type: any,
  setMessages: any,
  channelId: string | undefined,
  targetName: string | undefined,
) => {
  useEffect(() => {
    const socket = getSocket();
    const localMe = localStorage.getItem('me');
    const me = localMe ? JSON.parse(localMe) : null;

    if (type === messageType.DM) {
      handleDirectMessage(socket, setMessages, targetName);
    } else {
      handleChannelMessage(socket, setMessages, channelId);
      handleLeave(socket, setMessages, me?.id);
      handleJoin(socket, setMessages);
      handleKickBanPromote(socket, setMessages, me?.id, channelId);
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
  }, [type, setMessages, channelId, targetName]);
};
