import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useSocket } from '@/hooks/useSocket';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';
import { UserStateAnnounce } from './UserStateAnnounce';

export enum messageType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}
interface MessageContentInterface {
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

  const { api } = useContext(ApiContext);

  const { data: initialData, refetch } = useQuery(
    ['fetchChannelMsg'],
    useCallback(async () => {
      if (type === messageType.DM && targetName) {
        return (await api.dmControllerGetDmChannelMessages(targetName)).data;
      } else if (channelId) {
        return (await api.channelControllerGetChannelMessages(channelId)).data;
      }
    }, [api, channelId, type, targetName]),
    { enabled: false },
  );

  useEffect(() => {
    refetch();
  }, [channelId, refetch]);

  useEffect(() => {
    if (initialData) {
      setMessages(initialData as MessageContentInterface[]);
    }
  }, [initialData]);

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
