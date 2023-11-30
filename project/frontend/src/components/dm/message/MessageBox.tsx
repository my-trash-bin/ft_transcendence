import { Api } from '@/api/api';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { MessageContent, messageType } from './MessageContent';
import { MessageSendBox } from './MessageSendBox';
import { UserInfo } from './UserInfo';

export function MessageBox({ username }: { username: string }) {
  const apiCall = useCallback(
    () => new Api().api.usersControllerGetUsetByNickname(username),
    [username],
  );

  const { isLoading, isError, data } = useQuery('userByNickanme', apiCall);

  if (isLoading) return <div>loading... 👾</div>;
  if (isError) throw new Error('에러가 발생했습니다.');
  console.log(data);
  return (
    <>
      <UserInfo
        imageUri={data?.data.profileImageUrl}
        username={data?.data.nickname}
        onActive={false}
      />
      <MessageContent type={messageType.DM} />
      <MessageSendBox type={messageType.DM} targetUserId={data?.data.id} />
    </>
  );
}
