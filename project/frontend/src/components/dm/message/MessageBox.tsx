import { Api, UserDto } from '@/api/api';
import { useEffect, useState } from 'react';
import { MessageContent, messageType } from './MessageContent';
import { MessageSendBox } from './MessageSendBox';
import { UserInfo } from './UserInfo';

export function MessageBox({ username }: { username: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [targetUserData, setData] = useState<UserDto>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await new Api().api.usersControllerGetUsetByNickname(
          username,
        );
        setLoading(false);
        setData(data.data);
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
      <UserInfo
        imageUri={targetUserData?.profileImageUrl}
        username={targetUserData?.nickname}
        onActive={false}
      />
      <MessageContent type={messageType.DM} />
      <MessageSendBox type={messageType.DM} targetUserId={targetUserData?.id} />
    </>
  );
}
