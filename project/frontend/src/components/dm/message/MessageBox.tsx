import { MessageContent, messageType } from './MessageContent';
import { MessageSendBox } from './MessageSendBox';
import { UserInfo } from './UserInfo';

export function MessageBox({ username }: { username: string }) {
  const imageUri = '/avatar/avatar-blue.svg';
  const channelId = 'aaa';
  return (
    <>
      <UserInfo imageUri={imageUri} username={username} onActive={false} />
      <MessageContent
        channelId={channelId}
        type={messageType.DM}
        myNickname="aaa"
      />
      <MessageSendBox channelId={channelId} type={messageType.DM} />
    </>
  );
}
