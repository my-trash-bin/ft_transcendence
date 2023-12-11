import { unwrap } from '@/api/unwrap';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { MessageContent, messageType } from '../dm/message/MessageContent';
import { MessageSendBox } from '../dm/message/MessageSendBox';
import { ChannelInfo } from './ChannelInfo';

export function ChannleMessageBox({
  channelId,
}: Readonly<{ channelId: string }>) {
  const { api } = useContext(ApiContext);

  const { isLoading, isError, data } = useQuery(
    'channelInfo',
    useCallback(
      async () => unwrap(await api.channelControllerFindChannelInfo(channelId)),
      [api, channelId],
    ),
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <p>알 수 없는 에러</p>;

  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;

  const myAuthority: any = data.members.filter((mem: any) => {
    return mem.memberId === me.id;
  });
  if (isLoading) return <div>Loading...</div>;
  if (!myAuthority) return <></>;
  return (
    <>
      <ChannelInfo
        channelId={channelId}
        channelData={data}
        myAuthority={myAuthority[0]?.memberType}
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
