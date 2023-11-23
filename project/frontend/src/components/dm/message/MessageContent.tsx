import { getSocket } from '@/lib/Socket';
import { useEffect, useState } from 'react';

export enum messageType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}

export function MessageContent({
  channelId,
  type,
}: Readonly<{ channelId: string; type: messageType }>) {
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    const socket = getSocket();
    socket.on(`message`, (data: any) => {});

    return () => {
      socket.off(`message`);
    };
  }, []);

  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
}
