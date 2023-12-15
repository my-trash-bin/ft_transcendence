import { ApiContext } from '@/app/_internal/provider/ApiContext';
import useChannelMessage from '@/hooks/chat/useChannel';
import { useContext } from 'react';
import {
  MessageContent,
  MessageContentInterface,
  messageType,
} from '../dm/message/MessageContent';
import { MessageSendBox } from '../dm/message/MessageSendBox';
import { ChannelInfo } from './ChannelInfo';

export function ChannleMessageBox({
  channelId,
}: Readonly<{ channelId: string }>) {
  const { api } = useContext(ApiContext);

  const { channelInfo, isLoading, channelMessage } =
    useChannelMessage(channelId);

  if (isLoading) return <div>Loading...</div>;

  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;

  const myAuthority: any = channelInfo?.members.filter((mem: any) => {
    return mem.memberId === me?.id;
  });
  if (isLoading) return <div>Loading...</div>;
  if (!myAuthority) return <></>;
  return (
    <>
      <ChannelInfo
        channelId={channelId}
        channelData={channelInfo}
        myAuthority={myAuthority[0]?.memberType}
        myNickname={me?.nickname}
      />
      <MessageContent
        channelId={channelId}
        type={messageType.CHANNEL}
        myNickname={me?.nickname}
        initData={channelMessage as MessageContentInterface[]}
      />
      <MessageSendBox channelId={channelId} type={messageType.CHANNEL} />
    </>
  );
}
