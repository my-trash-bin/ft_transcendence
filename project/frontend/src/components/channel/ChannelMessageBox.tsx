import { MessageContent, messageType } from '../dm/message/MessageContent';
import { MessageSendBox } from '../dm/message/MessageSendBox';
import { ChannelInfo } from './ChannelInfo';

export function ChannleMessageBox({
  channelId,
}: Readonly<{ channelId: string }>) {
  return (
    <>
      <ChannelInfo channelId={channelId} />
      <MessageContent
        channelId={channelId}
        type={messageType.CHANNEL}
        myNickname={'myNickname'}
      />
      <MessageSendBox channelId={channelId} type={messageType.CHANNEL} />
    </>
  );
}
