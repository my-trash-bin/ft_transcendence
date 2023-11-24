import { TargetUserDto } from '@/api/api';
import { useCallback, useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { CommonCard } from './utils/CommonCard';

interface BlockCardProps {
  readonly nickname: string;
  readonly imageURL?: string;
}

export function BlockCard(props: BlockCardProps) {
  const { api } = useContext(ApiContext);

  const unblockUser = useCallback(async () => {
    try {
      const requestData: TargetUserDto = { targetUser: props.nickname };
      alert('call unblock api');
      await api.userFollowControllerUnBlockUser(requestData);
      console.log('UnBlock sent successfully');
    } catch (error) {
      console.error('Error sending unblock:', error);
    }
  }, [api, props.nickname]);

  return (
    <CommonCard imageURL={props.imageURL} nickname={props.nickname}>
      <button
        onClick={unblockUser}
        className={
          'w-md h-xs bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold mr-lg hover:bg-light-background'
        }
      >
        차단 풀기
      </button>
    </CommonCard>
  );
}
