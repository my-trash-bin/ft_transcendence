import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { MessageContent, messageType } from './MessageContent';
import { MessageSendBox } from './MessageSendBox';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { UserInfo } from './UserInfo';
import { unwrap } from '@/api/unwrap';

export function MessageBox({ username }: { readonly username: string }) {
  const { api } = useContext(ApiContext);

  const { isLoading, isError, data } = useQuery(
    'userByNickanme',
    useCallback(
      async () => unwrap(await api.usersControllerGetUsetByNickname(username)),
      [api, username],
    ),
  );

  if (isLoading) return <div>로딩중... 👾</div>;
  if (isError || !data) return <p>알 수 없는 에러</p>;

  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;
  return (
    <>
      <UserInfo
        imageUri={data.profileImageUrl}
        username={data.nickname}
        onActive={false}
        targetId={data.id}
      />
      <MessageContent
        type={messageType.DM}
        myNickname={me?.nickname}
        targetName={username}
      />
      <MessageSendBox type={messageType.DM} targetUserId={data.id} />
    </>
  );
}
