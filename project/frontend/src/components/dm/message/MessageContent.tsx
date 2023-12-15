import useInfScroll from '@/hooks/chat/useInfScroll';
import { useSocket } from '@/hooks/chat/useSocket';
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
const isMyMessage = (
  msg1: { data: { member: { nickname: string } } },
  msg2: { data: { member: { nickname: string } } },
) => msg1.data.member.nickname === msg2.data.member.nickname;
const calIsFirst = (
  messageList: { type: string; data: { member: { nickname: string } } }[],
  idx: number,
): boolean => {
  if (idx === 0) return true;
  const targetIndex =
    messageList[idx - 1].type === 'scroll-target' ? idx - 2 : idx - 1;

  return (
    isSystemMessage(messageList[targetIndex]) ||
    !isMyMessage(messageList[targetIndex], messageList[idx])
  );
};

let render = { isSocketRender: true };
export function MessageContent({
  channelId,
  type,
  myNickname,
  initData,
  targetName,
}: Readonly<{
  channelId: string;
  type: messageType;
  myNickname: string;
  initData: MessageContentInterface[];
  targetName?: string;
}>) {
  const [messages, setMessages] = useState<MessageContentInterface[]>(initData);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const messageStartRef = useRef<HTMLDivElement>(null);
  useSocket(type, setMessages, channelId, targetName, render);
  useInfScroll(
    messageStartRef,
    setMessages,
    messages,
    type,
    channelId,
    isLastPage,
    setIsLastPage,
    render,
    targetName,
  );
  useEffect(() => {
    setMessages(initData);
  }, [initData]);
  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);
  render.isSocketRender = false;
  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      <div ref={messageStartRef} />
      {messages.map((message, idx) => {
        if (message.type === 'scroll-target')
          return <div key={crypto.randomUUID()} ref={scrollTargetRef} />;
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
    </div>
  );
}
