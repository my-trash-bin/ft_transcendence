import { useCallback, useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { CommonCard } from './utils/CommonCard';

interface BlockCardProps {
  readonly nickname: string;
  readonly imageURL?: string;
  readonly id: string;
  readonly refetch: () => Promise<unknown>;
}

export function BlockCard(props: BlockCardProps) {
  const { api } = useContext(ApiContext);

  const unblockUser = useCallback(async () => {
    try {
      await api.userFollowControllerUnBlockUser({ targetUser: props.id });
      console.log('UnBlock sent successfully');
      props.refetch();
    } catch (error) {
      console.error('Error sending unblock:', error);
    }
  }, [api, props]);

  return (
    <CommonCard
      imageURL={props.imageURL}
      nickname={props.nickname}
      id={props.id}
    >
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
