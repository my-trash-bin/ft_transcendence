import { useProfileAndChannelInfo } from '@/hooks/useProfileAndChannelInfo';
import { MessageContent, messageType } from '../dm/message/MessageContent';
import { MessageSendBox } from '../dm/message/MessageSendBox';
import { ChannelInfo } from './ChannelInfo';

export function ChannleMessageBox({
  channelId,
}: Readonly<{ channelId: string }>) {
  const { isLoading, me, channel } = useProfileAndChannelInfo(channelId);

  if (isLoading) return <div>Loading...</div>;

  const myAuthority = channel.members.filter((mem) => {
    return mem.memberId === me.id;
  });
  if (isLoading) return <div>Loading...</div>;
  if (myAuthority.length === 0) throw new Error('Error fetching data');

  return (
    <>
      <ChannelInfo
        channelId={channelId}
        channelData={channel}
        myAuthority={myAuthority[0].memberType}
        myNickname={me.me.nickname}
      />
      <MessageContent type={messageType.CHANNEL} myNickname={me.me.nickname} />
      <MessageSendBox channelId={channelId} type={messageType.CHANNEL} />
    </>
  );
}
