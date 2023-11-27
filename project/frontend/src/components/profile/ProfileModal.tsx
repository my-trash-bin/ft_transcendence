'use client';
import { Button } from '@/components/common/Button';
import FriendAvatar from '@/components/friend/utils/FriendAvatar';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ModalLayout } from '../channel/modals/ModalLayout';
import { TextBox } from './TextBox';
import { CardType, HistoryCard } from './history/HistoryCard';
import { mockData } from './history/mockDataHistory';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  readonly refetchPage?: () => Promise<unknown>;
}

export const ProfileModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  targetId,
  refetchPage,
}) => {
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data, refetch } = useQuery(
    [targetId],
    useCallback(
      async () =>
        (await api.usersControllerGetUserInfo({ targetUser: targetId })).data,
      [api, targetId],
    ),
  );

  function handleFriendComponent() {
    if (!data) return <p>error</p>;
    let handler;
    let content;
    let disabled = false;
    if (data.relation === 'friend') {
      handler = unfollowUser;
      content = '친구끊기';
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

  function handleBlockComponent() {
    if (!data) return <p>error</p>;
    let handler;
    let content;
    let disabled = false;
    if (data.relation === 'block') {
      handler = unblockUser;
      content = '차단풀기';
    } else if (data.relation === 'me') {
      disabled = true;
      content = '나';
    } else {
      handler = blockUser;
      content = '차단하기';
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
      await api.userFollowControllerFollowUser({ targetUser: targetId });
      console.log('Friend successfully');
      refetch();
      refetchPage ? refetchPage() : null;
    } catch (error) {
      console.error('Error friend:', error);
    }
  }, [api, targetId, refetch, refetchPage]);

  const unfollowUser = useCallback(async () => {
    try {
      await api.userFollowControllerUnfollowUser({ targetUser: targetId });
      console.log('Unfriend successfully');
      refetch();
      refetchPage ? refetchPage() : null;
    } catch (error) {
      console.error('Error unfriend:', error);
    }
  }, [api, targetId, refetch, refetchPage]);

  const unblockUser = useCallback(async () => {
    try {
      await api.userFollowControllerUnBlockUser({ targetUser: targetId });
      console.log('UnBlock successfully');
      refetch();
      refetchPage ? refetchPage() : null;
    } catch (error) {
      console.error('Error unblock:', error);
    }
  }, [api, targetId, refetch, refetchPage]);

  const blockUser = useCallback(async () => {
    try {
      await api.userFollowControllerBlockUser({ targetUser: targetId });
      console.log('Block successfully');
      refetch();
      refetchPage ? refetchPage() : null;
    } catch (error) {
      console.error('Error block:', error);
    }
  }, [api, targetId, refetch, refetchPage]);

  const record = data?.record || { win: 0, lose: 0, ratio: 0 };

  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="400px"
      height="500px"
    >
      <div className="p-xl flex flex-col">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError || !data ? (
          <p>Error loading profile data.</p>
        ) : (
          <div>
            <div className="flex felx-row">
              <FriendAvatar imageUrl={data.imageUrl} size={80} />
              <TextBox
                nickname={data.nickname}
                win={record.win}
                lose={record.lose}
                ratio={record.ratio}
                statusMessage={data.statusMessage}
                isModal={true}
              />
            </div>
            <div className="flex flex-col pt-xl">
              {mockData.slice(0, 3).map((data) => (
                <HistoryCard
                  key={data.key}
                  user1Name={data.user1Name}
                  user2Name={data.user2Name}
                  user1Avatar={data.user1Avatar}
                  user2Avatar={data.user2Avatar}
                  user1Score={data.user1Score}
                  user2Score={data.user2Score}
                  type={CardType.Small}
                />
              ))}
            </div>
            <div className="flex flex-col pt-xl gap-md">
              <div className="flex flex-row gap-3xl justify-center">
                {handleFriendComponent()}
                <Button onClick={() => alert('game api')} isModal={true}>
                  게임하기
                </Button>
              </div>
              <div className="flex flex-row gap-3xl justify-center">
                {handleBlockComponent()}
                <Button onClick={() => alert('move to dm')} isModal={true}>
                  DM
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalLayout>
  );
};
