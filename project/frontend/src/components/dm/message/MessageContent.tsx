import { useInitMessage } from '@/hooks/useInitMessage';
import { useSocket } from '@/hooks/useSocket';
import { useEffect, useRef, useState } from 'react';
import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';
import { UserStateAnnounce } from './UserStateAnnounce';

export enum messageType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}
export interface MessageContentInterface {
  type: string;
  data: {
    id: string;
    messageJson: string;
    sentAt: Date;
    member: {
      id: string;
      nickname: string;
      profileImageUrl: string;
      joinedAt: Date;
    };
  };
}

const isSystemMessage = (message: { type: string }) =>
  ['leave', 'join'].includes(message.type);
const isMySessage = (
  msg1: { data: { member: { nickname: string } } },
  msg2: { data: { member: { nickname: string } } },
) => msg1.data.member.nickname === msg2.data.member.nickname;
const calIsFirst = (
  mesaageList: { type: string; data: { member: { nickname: string } } }[],
  idx: number,
) =>
  idx === 0 ||
  isSystemMessage(mesaageList[idx - 1]) ||
  !isMySessage(mesaageList[idx - 1], mesaageList[idx]);

export function MessageContent({
  channelId,
  type,
  myNickname,
  targetName,
}: Readonly<{
  channelId?: string;
  type: messageType;
  myNickname: string;
  targetName?: string;
}>) {
  const [messages, setMessages] = useState<MessageContentInterface[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useInitMessage(type, setMessages, channelId, targetName);
  useSocket(type, setMessages, channelId, targetName);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      {messages.map((message, idx) => {
        if (message.type === 'leave' || message.type === 'join') {
          return (
            <UserStateAnnounce
              key={crypto.randomUUID()}
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
          return (
            <OtherChat
              key={message.data.id}
              time={new Date(message.data.sentAt)}
              message={message.data.messageJson}
              profileImage={message.data.member.profileImageUrl}
              targetId={message.data.member.id}
              targetNickname={message.data.member.nickname}
              isFirst={calIsFirst(messages, idx)}
            />
          );
        }
      })}
      <div ref={messageEndRef} />
    </div>
  );
}
