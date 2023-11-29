import { getSocket } from '@/lib/Socket';
import { useEffect, useRef, useState } from 'react';
import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';

export enum messageType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}
interface messageContent {
  id: string;
  message: string;
  time: Date;
  profileImage: string;
  targetNickname: string;
  targetId: string;
}

export function MessageContent({ type }: Readonly<{ type: messageType }>) {
  const [messages, setMessages] = useState<messageContent[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();

    if (type === messageType.DM) {
      socket.on(`directMessage`, (res) => {
        const data = {
          id: res.id,
          message: res.messageJson,
          time: new Date(res.sentAt),
          profileImage: res.member.profileImageUrl,
          targetId: res.memberId,
          targetNickname: res.member.nickname,
        };
        console.log(res);
        setMessages((messages) => [...messages, data]);
      });
    } else {
      socket.on(`channelMessage`, (res) => {
        console.log(res);
        // const data = {
        //   id: res.id,
        //   message: res.messageJson,
        //   time: new Date(res.sentAt),
        //   profileImage: res.member.profileImageUrl,
        //   targetId: res.memberId,
        //   targetNickname: res.member.nickname,
        // };
        // setMessages((messages) => [...messages, data]);
      });
      socket.on('leave', (res) => {
        const me: string | null = localStorage.getItem('me');
        const myNickname = me ? JSON.parse(me).nickname : '';
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

  const me: string | null = localStorage.getItem('me');
  const myNickname = me ? JSON.parse(me).nickname : '';
  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      {messages.map((message, idx) => {
        if (message.targetNickname === myNickname) {
          return <MyChat key={message.id} {...message} />;
        } else {
          let isFirst = false;
          if (
            idx == 0 ||
            (idx != 0 &&
              messages[idx - 1].targetNickname != message.targetNickname)
          ) {
            isFirst = true;
          }
          return <OtherChat key={message.id} {...message} isFirst={isFirst} />;
        }
      })}
      <div ref={messageEndRef}></div>
    </div>
  );
}
