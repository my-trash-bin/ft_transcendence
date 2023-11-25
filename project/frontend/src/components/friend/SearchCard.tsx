import { TargetUserDto } from '@/api/api';
import { useCallback, useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { Button } from '../common/Button';
import { CommonCard } from './utils/CommonCard';

interface SearchCardProps {
  readonly nickname: string;
  readonly imageURL?: string;
  readonly id: string;
}

export function SearchCard(props: SearchCardProps) {
  const { api } = useContext(ApiContext);

  const requestFriend = useCallback(async () => {
    try {
      const requestData: TargetUserDto = { targetUser: props.id };
      await api.userFollowControllerFollowUser(requestData);
      console.log('friend request sent successfully');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }, [api, props.id]);

  return (
    <CommonCard
      imageURL={props.imageURL}
      nickname={props.nickname}
      id={props.id}
    >
      <Button onClick={requestFriend}>친구 하기</Button>
    </CommonCard>
  );
}
