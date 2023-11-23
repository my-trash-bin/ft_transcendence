import { useEffect, useState } from 'react';

export function MessageContent({
  socket,
  receiver,
}: {
  socket: any;
  receiver: string;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    socket.on(`dm`, (data: any) => {
      const { sender, receiver, message } = data;
      console.log(`Received message from ${sender}: ${message}`);
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off(`dm`);
    };
  }, [socket]);

  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
}
