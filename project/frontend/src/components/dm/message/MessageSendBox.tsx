'use client';

import Image from 'next/image';
import { useState } from 'react';

export function MessageSendBox({
  socket,
  receiver,
}: {
  socket: any;
  receiver: string;
}) {
  const [message, setMessage] = useState<string>('');
  const sendMessage = () => {
    console.log(socket.connected);
    socket.emit(`dm`, {
      sender: 'test',
      receiver: 'test',
      message: message,
    });
    console.log(message + ' sent');
    setMessage('');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div className="w-[100%] h-[60px] flex justify-center items-center">
      <div className="h-[30px] w-[95%] flex flex-row justify-center relative bg-chat-color2 rounded-[10px]">
        <input
          type="text"
          placeholder="Enter your message"
          onChange={handleInput}
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
