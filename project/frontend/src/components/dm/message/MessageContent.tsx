import { getSocket } from '@/lib/Socket';
import { useEffect, useRef, useState } from 'react';
import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';

export enum messageType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}
interface messageContent {
  type: string;
  data: {
    id: string;
    messageJson: string;
    sentAt: Date;
    member: {
      id: string;
      nickname: string;
      profileImageUrl: string;
    };
  };
}

export function MessageContent({
  type,
  myNickname,
}: Readonly<{ type: messageType; myNickname: string }>) {
  const [messages, setMessages] = useState<messageContent[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();

    if (type === messageType.DM) {
      socket.on(`directMessage`, (res) => {
        setMessages((messages) => [...messages, res]);
      });
    } else {
      socket.on(`channelMessage`, (res) => {
        setMessages((messages) => [...messages, res]);
      });
      socket.on('leave', (res) => {
        console.log(res);
      });
    }

    return () => {
      if (type === messageType.DM) {
        socket.off(`directMessage`);
      } else {
        socket.off(`channelMessage`);
        socket.off('leave');
      }
    };
  }, [type]);

  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      {messages.map((message, idx) => {
        if (message.type === 'leave') {
        } else if (message.data.member.nickname === myNickname) {
          return (
            <MyChat
              key={message.data.id}
              message={message.data.messageJson}
              time={new Date(message.data.sentAt)}
            />
          );
        } else {
          let isFirst = false;
          if (
            idx == 0 ||
            (idx != 0 &&
              messages[idx - 1].data.member.nickname !=
                message.data.member.nickname)
          ) {
            isFirst = true;
          }
          return (
            <OtherChat
              key={message.data.id}
              time={new Date(message.data.sentAt)}
              message={message.data.messageJson}
              profileImage={message.data.member.profileImageUrl}
              targetId={message.data.member.id}
              targetNickname={message.data.member.nickname}
              isFirst={isFirst}
            />
          );
        }
      })}
      <div ref={messageEndRef}></div>
    </div>
  );
}
