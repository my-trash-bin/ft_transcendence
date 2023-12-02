// useSocket.js

import { messageType } from '@/components/dm/message/MessageContent';
import { getSocket } from '@/lib/Socket';
import { useEffect } from 'react';

export const useSocket = (type: any, setMessages: any) => {
  useEffect(() => {
    const socket = getSocket();

    if (type === messageType.DM) {
      socket.on(`directMessage`, (res) => {
        setMessages((messages: any) => [...messages, res]);
      });
    } else {
      socket.on(`channelMessage`, (res) => {
        setMessages((messages: any) => [...messages, res]);
      });
      socket.on('leave', (res) => {
        console.log(res);
      });
      socket.on('join', (res) => {
        console.log(res);
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
