'use client';

import { getSocket } from '@/lib/Socket';
import Image from 'next/image';
import { useState } from 'react';
import { messageType } from './MessageContent';

export function MessageSendBox({
  channelId,
  type,
  targetUserId,
}: {
  channelId?: string;
  type: messageType;
  targetUserId?: string;
}) {
  const [message, setMessage] = useState<string>('');
  const sendMessage = () => {
    const socket = getSocket();
    if (type === messageType.DM) {
      console.log('send message', message, targetUserId);
      socket.emit('directMessage', {
        msg: message,
        memberId: targetUserId,
      });
    } else socket.emit('channelMessage', { channelId, msg: message });

    setMessage('');
  };

  return (
    <div className="w-[100%] h-[60px] flex justify-center items-center">
      <div className="h-[30px] w-[95%] flex flex-row justify-center relative bg-chat-color2 rounded-[10px]">
        <input
          type="text"
          placeholder="Enter your message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="bg-chat-color2 outline-none h-[100%] w-[90%] pr-[1%] placeholder:text-center"
        />
        <button onClick={sendMessage} className="w-[5%] h-[100%] self-end">
          <Image
            alt="send icon"
            src="/icon/message-send.svg"
            width={30}
            height={30}
            layout="relative"
          />
        </button>
      </div>
    </div>
  );
}
