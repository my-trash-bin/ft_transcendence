import { useCallback, useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { CommonCard } from './utils/CommonCard';

interface BlockCardProps {
  readonly nickname: string;
  readonly imageUrl?: string;
  readonly id: string;
  readonly refetch: () => Promise<unknown>;
}

export function BlockCard({ nickname, imageUrl, id, refetch }: BlockCardProps) {
  const { api } = useContext(ApiContext);

  const unblockUser = useCallback(async () => {
    try {
      await api.userFollowControllerUnBlockUser({ targetUser: id });
      console.log('UnBlock successfully');
      refetch();
    } catch (error) {
      console.error('Error unblock:', error);
    }
  }, [api, id, refetch]);

  return (
    <CommonCard imageUrl={imageUrl} nickname={nickname} id={id}>
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
