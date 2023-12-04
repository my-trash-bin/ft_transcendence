import { useSocket } from '@/hooks/useSocket';
import { useEffect, useRef, useState } from 'react';
import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';
import { UserStateAnnounce } from './UserStateAnnounce';

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

  useSocket(type, setMessages);

  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      {messages.map((message, idx) => {
        if (message.type === 'leave' || message.type === 'join') {
          return (
            <UserStateAnnounce
              key={message.data.id}
              nickname={message.data.member.nickname}
              userState={message.type}
            />
          );
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
