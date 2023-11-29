import { useCallback, useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { Button } from '../common/Button';
import { CommonCard } from './utils/CommonCard';
import { UserRelationshipDto } from '@/api/api';

interface SearchCardProps {
  readonly data: UserRelationshipDto;
  readonly refetch: () => Promise<unknown>;
}

export function SearchCard({ data, refetch }: SearchCardProps) {
  const { api } = useContext(ApiContext);

  function handler() {
    if (!data) return <p>error</p>;
    let handler;
    let content;
    let disabled = false;
    if (data.relation === 'friend') {
      disabled = true;
      content = '이미친구';
    } else if (data.relation === 'none') {
      handler = requestFriend;
      content = '친구추가';
    } else if (data.relation === 'me') {
      content = '나';
      disabled = true;
    } else {
      content = '차단상태';
      disabled = true;
    }
    return (
      <Button
        isModal={true}
        disabled={disabled}
        onClick={!disabled ? handler : undefined}
      >
        {content}
      </Button>
    );
  }

  const requestFriend = useCallback(async () => {
    try {
      await api.userFollowControllerFollowUser({ targetUser: data.id });
      console.log('Friend request successfully');
      refetch();
    } catch (error) {
      console.error('Error friend request:', error);
    }
  }, [api, data, refetch]);

  return (
    <CommonCard
      imageUrl={data.profileImageUrl}
      nickname={data.nickname}
      id={data.id}
      refetch={refetch}
    >
      {handler()}
    </CommonCard>
  );
}
