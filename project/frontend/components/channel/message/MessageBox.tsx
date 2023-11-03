import { MessageContent } from './MessageContent';
import { MessageSendBox } from './MessageSendBox';
import { UserInfo } from './UserInfo';

export function MessageBox() {
  const imageUri = '/avatar/avatar-blue.svg';
  const username = 'user3';
  return (
    <>
      <UserInfo imageUri={imageUri} username={username} onActive={false} />
      <MessageContent />
      <MessageSendBox />
    </>
  );
}
