import { getSocket } from '@/lib/Socket';
import { useEffect, useState } from 'react';
import { OtherChat } from './OtherChat';

export enum messageType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}
interface messageContent {
  channelId: string;
  message: string;
  time: Date;
  profileImage: string;
  nickname: string;
}

export function MessageContent({
  channelId,
  type,
}: Readonly<{ channelId: string; type: messageType }>) {
  const [messages, setMessages] = useState<messageContent[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (type === messageType.DM) {
      socket.on(`dm`, (data: messageContent) => {
        setMessages((messages) => [...messages, data]);
      });
    } else {
      socket.on(`channelMessage`, (data: messageContent) => {
        setMessages((messages) => [...messages, data]);
      });
    }

    return () => {
      socket.off(`dm`);
      socket.off(`channelMessage`);
    };
  }, [channelId, type]);

  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      {/* {messages.map((message, idx) => {
        if (message.nickname === myNickname) {
          return <MyChat key={message.time.toString()} {...message} />;
        } else {
          let isFirst = false;
          if (idx != 0 && messages[idx - 1].nickname != message.nickname) {
            isFirst = true;
          }
          <OtherChat
            key={message.time.toString()}
            {...message}
            isFirst={isFirst}
          />;
        }
      })} */}

      <OtherChat
        message="hihi"
        time={new Date()}
        profileImage="/avatar/avatar-big.svg"
        isFirst={true}
        nickname="nickname"
      />

      <OtherChat
        message="hihi"
        time={new Date()}
        profileImage="/avatar/avatar-big.svg"
        isFirst={false}
        nickname="nickname"
      />
    </div>
  );
}
