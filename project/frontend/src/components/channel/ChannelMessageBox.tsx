import { useEffect } from 'react';
import { MessageContent, messageType } from '../dm/message/MessageContent';
import { MessageSendBox } from '../dm/message/MessageSendBox';
import { ChannelInfo } from './ChannelInfo';

export function ChannleMessageBox({
  channelId,
}: Readonly<{ channelId: string }>) {
  useEffect(() => {}, [channelId]);

  return (
    <>
      <ChannelInfo channelId={channelId} />
      <MessageContent type={messageType.CHANNEL} />
      <MessageSendBox channelId={channelId} type={messageType.CHANNEL} />
    </>
  );
}
