'use client';
import { unwrap } from '@/api/unwrap';
import { Button } from '@/components/common/Button';
import FriendAvatar from '@/components/friend/utils/FriendAvatar';
import { useRouter } from 'next/navigation';
import { SetStateAction, useCallback, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ModalLayout } from '../channel/modals/ModalLayout';
import { LiveStatus } from '../common/LiveStatus';
import { LongCard } from '../common/LongCard';
import { GameInviteButtons } from '../game/GameInviteButtons';
import { TextBox } from './TextBox';
import { CardType, HistoryCard } from './history/HistoryCard';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  readonly refetchPage?: () => Promise<unknown>;
  openInvite: () => void;
  setGameMode: React.Dispatch<SetStateAction<'normal' | 'item'>>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  targetId,
  refetchPage,
}) => {
  const { api } = useContext(ApiContext);
  const router = useRouter();
  const {
    isLoading: userInfoLoading,
    isError: userInfoError,
    data: userInfoData,
    refetch: refetchUserInfo,
  } = useQuery(
    [targetId, 'profile'],
    useCallback(
      async () =>
        unwrap(await api.usersControllerGetUserInfo({ targetUser: targetId })),
      [api, targetId],
    ),
    {
      enabled: isOpen,
    },
  );
  const {
    isLoading: historyLoading,
    isError: historyError,
    data: historyData,
  } = useQuery(
    [targetId, 'fetchHistory'],
    useCallback(
      async () =>
        unwrap(await api.pongLogControllerGetUserGameHistories(targetId)),
      [api, targetId],
    ),
    {
      enabled: isOpen,
    },
  );

  useEffect(() => {
    if (isOpen) {
      refetchUserInfo();
    }
  }, [isOpen, refetchUserInfo]);

  function handleFriendButton() {
    if (!userInfoData) return <p>error</p>;
    let handler;
    let content;
    let disabled = false;
    if (userInfoData.relation === 'friend') {
      handler = unfollowUser;
      content = '친구끊기';
    } else if (userInfoData.relation === 'none') {
      handler = requestFriend;
      content = '친구추가';
    } else if (userInfoData.relation === 'me') {
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
  function handleBlockButton() {
    if (!userInfoData) return <p>error</p>;
    let handler;
    let content;
    let disabled = false;
    if (userInfoData.relation === 'block') {
      handler = unblockUser;
      content = '차단풀기';
    } else if (userInfoData.relation === 'me') {
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
  function handlerGameButton() {
    if (!userInfoData) return <p>error</p>;
    let content;
    let disabled = false;
    if (userInfoData.relation === 'me') {
      disabled = true;
      content = '나';
    } else {
      content = '게임하기';
    }
    if (disabled)
      return (
        <Button isModal={true} disabled={true}>
          {content}
        </Button>
      );
    return (
      <GameInviteButtons content={content} isModal={true} friendId={targetId} />
    );
  }

  function handlerDmButton() {
    if (!userInfoData) return <p>error</p>;
    let handler;
    let content;
    let disabled = false;
    if (userInfoData.relation === 'me') {
      disabled = true;
      content = '나';
    } else {
      content = 'DM';
      handler = () => router.push(`/dm/${userInfoData.nickname}`);
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
      refetchUserInfo();
      refetchPage?.();
    } catch (error) {
      console.error('Error friend:', error);
    }
  }, [api, targetId, refetchUserInfo, refetchPage]);
  const unfollowUser = useCallback(async () => {
    try {
      await api.userFollowControllerUnfollowUser({ targetUser: targetId });
      console.log('Unfriend successfully');
      refetchUserInfo();
      refetchPage?.();
    } catch (error) {
      console.error('Error unfriend:', error);
    }
  }, [api, targetId, refetchUserInfo, refetchPage]);
  const unblockUser = useCallback(async () => {
    try {
      await api.userFollowControllerUnBlockUser({ targetUser: targetId });
      console.log('UnBlock successfully');
      refetchUserInfo();
      refetchPage?.();
    } catch (error) {
      console.error('Error unblock:', error);
    }
  }, [api, targetId, refetchUserInfo, refetchPage]);
  const blockUser = useCallback(async () => {
    try {
      await api.userFollowControllerBlockUser({ targetUser: targetId });
      console.log('Block successfully');
      refetchUserInfo();
      refetchPage?.();
    } catch (error) {
      console.error('Error block:', error);
    }
  }, [api, targetId, refetchUserInfo, refetchPage]);

  function renderHistory() {
    if (historyData?.records) {
      const historyCards = historyData.records
        .slice(0, 3)
        .map((history: any) => (
          <HistoryCard
            key={history.id}
            user1Name={history.player1.nickname}
            user2Name={history.player2.nickname}
            user1Avatar={history.player1.profileImageUrl}
            user2Avatar={history.player2.profileImageUrl}
            user1Score={history.player1Score}
            user2Score={history.player2Score}
            type={CardType.Small}
          />
        ));

      const emptyCards = Array.from(
        { length: 3 - (historyData.records?.length || 0) },
        (_, index) => (
          <LongCard key={`empty-${index}`} size={'small'} color="default">
            no history
          </LongCard>
        ),
      );

      return (
        <div className="flex flex-col">{historyCards.concat(emptyCards)}</div>
      );
    } else {
      return <p>No history data available.</p>;
    }
  }

  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="400px"
      height="500px"
    >
      <div className="flex justify-center items-center w-[100%] h-[100%]">
        {renderProfileContent()}
      </div>
    </ModalLayout>
  );

  function renderProfileContent() {
    if (userInfoLoading || historyLoading) return <p>로딩중입니다...</p>;

    if (userInfoError || historyError) {
      return <p>Error loading profile data.</p>;
    }
    if (!userInfoData) {
      return <p>Fail to get data.</p>;
    }

    return (
      <div className="p-xl flex flex-col gap-md justify-center items-center">
        <div className="flex felx-row gap-xl">
          <div className="flex flex-col items-center gap-md">
            <FriendAvatar imageUrl={userInfoData.imageUrl} size={80} />
            <LiveStatus targetId={userInfoData.id} />
          </div>
          <TextBox
            nickname={userInfoData.nickname}
            win={historyData?.stats.wins}
            lose={historyData?.stats.losses}
            ratio={historyData?.stats.winRate}
            statusMessage={userInfoData.statusMessage}
            isModal={true}
          />
        </div>
        {renderHistory()}
        <div className="flex flex-col gap-md">
          <div className="flex flex-row gap-3xl justify-center">
            {handleFriendButton()}
            {handlerGameButton()}
          </div>
          <div className="flex flex-row gap-3xl justify-center">
            {handleBlockButton()}
            {handlerDmButton()}
          </div>
        </div>
      </div>
    );
  }
};
