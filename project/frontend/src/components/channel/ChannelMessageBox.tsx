import { Api } from '@/api/api';
import { useQuery } from 'react-query';
import { MessageContent, messageType } from '../dm/message/MessageContent';
import { MessageSendBox } from '../dm/message/MessageSendBox';
import { ChannelInfo } from './ChannelInfo';

export function ChannleMessageBox({
  channelId,
}: Readonly<{ channelId: string }>) {
  const channelApi = () =>
    new Api().api.channelControllerFindChannelInfo(channelId);

  const { isLoading, isError, data } = useQuery('channelInfo', channelApi);

  if (isLoading) return <div>Loading...</div>;

  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;

  const myAuthority = data?.data.members.filter((mem) => {
    return mem.memberId === me.id;
  });
  if (isLoading) return <div>Loading...</div>;
  if (myAuthority.length === 0) throw new Error('Error fetching data');

  return (
    <>
      <ChannelInfo
        channelId={channelId}
        channelData={data?.data}
        myAuthority={myAuthority[0].memberType}
        myNickname={me.nickname}
      />
      <MessageContent
        channelId={channelId}
        type={messageType.CHANNEL}
        myNickname={me.nickname}
      />
      <MessageSendBox channelId={channelId} type={messageType.CHANNEL} />
    </>
  );
}
