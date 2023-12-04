import { useSocket } from '@/hooks/useSocket';
import { useEffect, useRef, useState } from 'react';
import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';
import { UserStateAnnounce } from './UserStateAnnounce';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '@/app/_internal/provider/ApiContext';

export enum messageType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}
interface messageContent {
  // type: string;
  // data: {
  id: string;
  messageJson: string;
  sentAt: Date;
  member: {
    id: string;
    nickname: string;
    profileImageUrl: string;
    // };
  };
}

export function MessageContent({
  channelId,
  type,
  myNickname,
}: Readonly<{ channelId: string; type: messageType; myNickname: string }>) {
  const [messages, setMessages] = useState<messageContent[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { api } = useContext(ApiContext);
  const { isLoading, isError, data, refetch } = useQuery(
    [],
    useCallback(
      async () =>
        (await api.channelControllerGetChannelMessages(channelId)).data,
      [api, channelId],
    ),
  );

  useEffect(() => {
    if (data) {
      setMessages((messages: any) => [...messages, ...data]);
    }
  }, [data]);

  console.log('messages', messages);
  console.log('messages', messages);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useSocket(type, setMessages);

  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      {messages.map((message, idx) => {
        // if (message.type === 'leave' || message.type === 'join') {
        //   return (
        //     <UserStateAnnounce
        //       key={message.data.id}
        //       nickname={message.data.member.nickname}
        //       userState={message.type}
        //     />
        //   );
        // } else if (message.data.member.nickname === myNickname) {
        if (message.member.nickname === myNickname) {
          return (
            <MyChat
              key={message.id}
              message={message.messageJson}
              time={new Date(message.sentAt)}
            />
          );
        } else {
          let isFirst = false;
          if (
            idx == 0 ||
            (idx != 0 &&
              messages[idx - 1].member.nickname != message.member.nickname)
          ) {
            isFirst = true;
          }
          return (
            <OtherChat
              key={message.id}
              time={new Date(message.sentAt)}
              message={message.messageJson}
              profileImage={message.member.profileImageUrl}
              targetId={message.member.id}
              targetNickname={message.member.nickname}
              isFirst={isFirst}
            />
          );
        }
      })}
      <div ref={messageEndRef}></div>
    </div>
  );
}
