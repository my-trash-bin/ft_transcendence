import { ApiContext } from '@/app/_internal/provider/ApiContext';
import useDirectMessage from '@/hooks/chat/useDirectMessage';
import { useContext } from 'react';
import { MessageContent, messageType } from './MessageContent';
import { MessageSendBox } from './MessageSendBox';
import { UserInfo } from './UserInfo';

export function MessageBox({
  username,
  channelId,
}: {
  readonly username: string;
  readonly channelId: string;
}) {
  const { isLoading, dmInfo, channelMessage } = useDirectMessage(
    channelId,
    username,
  );

  if (isLoading || !dmInfo) return <div>로딩중... 👾</div>;

  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;
  return (
    <>
      <UserInfo
        imageUri={dmInfo.profileImageUrl}
        username={dmInfo.nickname}
        onActive={false}
        targetId={dmInfo.id}
      />
      <MessageContent
        type={messageType.DM}
        myNickname={me?.nickname}
        targetName={username}
        channelId={channelId}
        initData={channelMessage}
      />
      <MessageSendBox type={messageType.DM} targetUserId={dmInfo.id} />
    </>
  );
}
