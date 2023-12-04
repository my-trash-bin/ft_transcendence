// useSocket.js

import { messageType } from '@/components/dm/message/MessageContent';
import { getSocket } from '@/lib/Socket';
import { useEffect } from 'react';

export const useSocket = (type: any, setMessages: any) => {
  useEffect(() => {
    const socket = getSocket();
    const localMe = localStorage.getItem('me');
    const me = localMe ? JSON.parse(localMe) : null;

    if (type === messageType.DM) {
      socket.on(`directMessage`, (res) => {
        setMessages((messages: any) => [...messages, res]);
      });
    } else {
      socket.on(`channelMessage`, (res) => {
        setMessages((messages: any) => [...messages, res]);
      });
      socket.on('leave', (res) => {
        if (res.data.member.id === me.id) {
          alert('채널에서 나갔습니다.');
          location.href = '/channel';
        } else setMessages((messages: any) => [...messages, res]);
      });
      socket.on('join', (res) => {
        setMessages((messages: any) => [...messages, res]);
      });
    }

    return () => {
      if (type === messageType.DM) {
        socket.off(`directMessage`);
      } else {
        socket.off(`channelMessage`);
        socket.off('leave');
        socket.off('join');
      }
    };
  }, [type, setMessages]);
};
