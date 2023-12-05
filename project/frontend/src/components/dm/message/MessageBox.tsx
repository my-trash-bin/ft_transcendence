import { Api } from '@/api/api';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { MessageContent, messageType } from './MessageContent';
import { MessageSendBox } from './MessageSendBox';
import { UserInfo } from './UserInfo';

export function MessageBox({ username }: { readonly username: string }) {
  const apiCall = useCallback(
    () => new Api().api.usersControllerGetUsetByNickname(username),
    [username],
  );

  const { isLoading, data } = useQuery('userByNickanme', apiCall);

  if (isLoading) return <div>loading... 👾</div>;

  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;
  return (
    <>
      <UserInfo
        imageUri={data?.data.profileImageUrl}
        username={data?.data.nickname}
        onActive={false}
      />
      <MessageContent
        type={messageType.DM}
        myNickname={me?.nickname}
        targetName={username}
      />
      <MessageSendBox type={messageType.DM} targetUserId={data?.data.id} />
    </>
  );
}
