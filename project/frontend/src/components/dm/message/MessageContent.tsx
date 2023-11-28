import { getSocket } from '@/lib/Socket';
import { useEffect, useState } from 'react';
import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';

export enum messageType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}
interface messageContent {
  message: string;
  time: Date;
  profileImage: string;
  targetNickname: string;
  targetId: string;
}

export function MessageContent({
  type,
  nickname,
}: Readonly<{ type: messageType; nickname: string }>) {
  const [messages, setMessages] = useState<messageContent[]>([]);

  useEffect(() => {
    const socket = getSocket();

    if (type === messageType.DM) {
      socket.on(`directMessage`, (res) => {
        const data = {
          message: res.messageJson,
          time: new Date(res.sentAt),
          profileImage: res.member.profileImageUrl,
          targetId: res.memberId,
          targetNickname: res.member.nickname,
        };
        console.log(data);
        setMessages((messages) => [...messages, data]);
      });
    } else {
      socket.on(`channelMessage`, (data: messageContent) => {
        setMessages((messages) => [...messages, data]);
      });
    }

    return () => {
      if (type === messageType.DM) {
        socket.off(`directMessage`);
      } else {
        socket.off(`channelMessage`);
      }
    };
  }, [type]);

  const me: string | null = localStorage.getItem('me');
  const myNickname = me ? JSON.parse(me).nickname : '';
  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll mt-sm">
      {messages.map((message, idx) => {
        if (message.targetNickname === myNickname) {
          return <MyChat key={message.time.toString()} {...message} />;
        } else {
          let isFirst = false;
          if (
            idx == 0 ||
            (idx != 0 &&
              messages[idx - 1].targetNickname != message.targetNickname)
          ) {
            isFirst = true;
          }
          return (
            <OtherChat
              key={message.time.toString()}
              {...message}
              isFirst={isFirst}
            />
          );
        }
      })}

      {/* <OtherChat
        message="hihi"
        time={new Date()}
        profileImage="/avatar/avatar-big.svg"
        isFirst={true}
        targetId={targetUserId}
        targetNickname={nickname}
      />

      <OtherChat
        message="hihi"
        time={new Date()}
        profileImage="/avatar/avatar-big.svg"
        isFirst={false}
        targetId={targetUserId}
        targetNickname={nickname}
      />
      <UserStateAnnounce userState={UserState.LEAVE} nickname="hello" /> */}
    </div>
  );
}
