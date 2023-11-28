import { Api } from '@/api/api';
import { useEffect, useState } from 'react';
import { MessageContent, messageType } from './MessageContent';
import { MessageSendBox } from './MessageSendBox';
import { UserInfo } from './UserInfo';

export function MessageBox({ username }: { username: string }) {
  const imageUri = '/avatar/avatar-blue.svg';
  const [loading, setLoading] = useState<boolean>(true);
  const [targetUserId, setUserId] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await new Api().api.usersControllerGetUsetByNickname(
          username,
        );
        setLoading(false);
        setUserId(data.data.id);
      } catch (e) {
        setError(true);
      }
    }
    fetchData();
  }, [username]);

  if (loading) return <div>loading... 👾</div>;
  if (error) return <div>error!</div>;

  return (
    <>
      <UserInfo imageUri={imageUri} username={username} onActive={false} />
      <MessageContent type={messageType.DM} nickname={username} />
      <MessageSendBox type={messageType.DM} targetUserId={targetUserId} />
    </>
  );
}
