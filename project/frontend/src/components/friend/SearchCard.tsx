import { useCallback, useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { Button } from '../common/Button';
import { CommonCard } from './utils/CommonCard';

interface SearchCardProps {
  readonly nickname: string;
  readonly imageUrl?: string;
  readonly id: string;
  readonly refetch: () => Promise<unknown>;
}

export function SearchCard({
  nickname,
  imageUrl,
  id,
  refetch,
}: SearchCardProps) {
  const { api } = useContext(ApiContext);

  const requestFriend = useCallback(async () => {
    try {
      await api.userFollowControllerFollowUser({ targetUser: id });
      console.log('Friend request successfully');
      refetch();
    } catch (error) {
      console.error('Error friend request:', error);
    }
  }, [api, id, refetch]);

  return (
    <CommonCard
      imageUrl={imageUrl}
      nickname={nickname}
      id={id}
      refetch={refetch}
    >
      <Button onClick={requestFriend}>친구 하기</Button>
    </CommonCard>
  );
}
