// useSocket.js

import { messageType } from '@/components/dm/message/MessageContent';
import { getSocket } from '@/lib/Socket';
import { useEffect } from 'react';

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
      socket.on(`directMessage`, (res) => {
        if (
          res.data.member.nickname === targetName ||
          res.data.member.nickname === me?.nickname
        )
          setMessages((messages: any) => [...messages, res]);
      });
    } else {
      socket.on(`channelMessage`, (res) => {
        if (res.data.channelId === channelId)
          setMessages((messages: any) => [...messages, res]);
      });
      socket.on('leave', (res) => {
        if (res.data.member.id === me?.id) {
          alert('채널에서 나갔습니다.');
          location.href = '/channel';
        } else setMessages((messages: any) => [...messages, res]);
      });
      socket.on('join', (res) => {
        setMessages((messages: any) => [...messages, res]);
      });

      socket.on('kickBanPromote', (res) => {
        if (
          res.data.actionType === 'KICK' ||
          res.data.actionType === 'BANNED'
        ) {
          if (
            res.data.targetUser.id === me?.id &&
            channelId === res.data.channelId
          ) {
            alert('채널에서 강퇴당했습니다.');
            location.href = '/channel';
          }
        } else if (
          res.data.actionType === 'PROMOTE' &&
          channelId === res.data.channelId
        ) {
          if (res.data.targetUser.id === me?.id) {
            alert('채널에서 관리자가 되었습니다.');
          }
        } else {
          if (
            res.data.targetUser.id === me?.id &&
            channelId === res.data.channelId
          ) {
            alert('채널에서 뮤트 되었습니다.');
          }
        }
      });
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
  }, [type, setMessages, channelId]);
};
