import { getSocket } from '@/lib/Socket';
import { MessageContent } from './MessageContent';
import { MessageSendBox } from './MessageSendBox';
import { UserInfo } from './UserInfo';

export function MessageBox({ username }: { username: string }) {
  const imageUri = '/avatar/avatar-blue.svg';

  return (
    <>
      <UserInfo imageUri={imageUri} username={username} onActive={false} />
      <MessageContent socket={getSocket()} receiver={username} />
      <MessageSendBox socket={getSocket()} receiver={username} />
    </>
  );
}
