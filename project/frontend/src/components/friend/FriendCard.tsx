import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useState } from 'react';
import { Button } from '../common/Button';
import FriendInvite from '../game/FriendInvite';
import { FriendSetting } from './FriendSetting';
import { CommonCard } from './utils/CommonCard';
import { GameInviteButtons } from '../game/GameInviteButtons';
import { getGameSocket } from '../pong/gameSocket';

interface FriendCardProps {
  readonly nickname: string;
  readonly imageUrl?: string;
  readonly id: string;
  readonly refetch: () => Promise<unknown>;
}

export function FriendCard({
  nickname,
  imageUrl,
  id,
  refetch,
}: FriendCardProps) {
  const router = useRouter();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [gameMode, setGameMode] = useState<'normal' | 'item'>('normal');
  const socket = getGameSocket();

  const handleInviteClose = useCallback(() => {
    socket.emit('cancelInvite', id);
    console.log('cancelInvite');
    setIsInviteOpen(false);
  }, [setIsInviteOpen, socket, id]);

  const handleInviteOpen = useCallback(() => {
    setIsInviteOpen(true);
  }, [setIsInviteOpen]);

  return (
    <CommonCard
      imageUrl={imageUrl}
      nickname={nickname}
      id={id}
      refetch={refetch}
    >
      <div className="flex flex-row justify-center items-center gap-md">
        <GameInviteButtons
          content={'게임하기'}
          setGameMode={setGameMode}
          handleInviteOpen={handleInviteOpen}
          isModal={false}
          friendId={id}
        />
        <Button onClick={() => router.push(`/dm/${nickname}`)}>메세지</Button>
        <FriendSetting targetId={id} refetch={refetch} />
      </div>
      <FriendInvite
        isOpen={isInviteOpen}
        onClose={handleInviteClose}
        mode={gameMode}
      />
    </CommonCard>
  );
}
