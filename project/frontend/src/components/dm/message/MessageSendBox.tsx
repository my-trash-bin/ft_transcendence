'use client';

import { getSocket } from '@/lib/Socket';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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
  useEffect(() => {
    const socket = getSocket();
    socket.on('exception', (data: any) => {
      if (data.message === '뮤트 상태의 유저입니다.') {
        alert('뮤트 상태의 유저입니다.');
      }
    });
    return () => {
      socket.off('exception');
    };
  });
  const sendMessage = () => {
    if (message === '') return;
    const socket = getSocket();
    if (type === messageType.DM) {
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
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          value={message}
          className="bg-chat-color2 outline-none h-[100%] w-[90%] pr-[1%] placeholder:text-center"
        />
        <button
          type="button"
          onClick={sendMessage}
          className="w-[5%] h-[100%] self-end"
        >
          <Image
            alt="send icon"
            src="/icon/message-send.svg"
            width={30}
            height={30}
          />
        </button>
      </div>
    </div>
  );
}
