import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useState } from 'react';
import { Button } from '../common/Button';
import FriendInvite from '../game/FriendInvite';
import { FriendSetting } from './FriendSetting';
import { CommonCard } from './utils/CommonCard';
import { getGameSocket } from '../pong/gameSocket';

interface FriendCardProps {
  readonly nickname: string;
  readonly imageUrl?: string;
  readonly id: string;
  readonly refetch: () => Promise<unknown>;
}

function DualFunctionButton({
  content,
  setGameMode,
  handleInviteOpen,
}: {
  readonly content: ReactNode;
  readonly setGameMode: (mode: 'normal' | 'item') => void;
  readonly handleInviteOpen: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const startNormal = useCallback(() => {
    setGameMode('normal');
    handleInviteOpen();
  }, [setGameMode, handleInviteOpen]);
  const startItem = useCallback(() => {
    setGameMode('item');
    handleInviteOpen();
  }, [setGameMode, handleInviteOpen]);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-[75px] h-[30px]"
    >
      {isHovered ? (
        <div className="absolute bottom-[-15px]">
          <Button onClick={() => startNormal()}>{'일반모드'}</Button>
          <Button onClick={() => startItem()}>{'아이템모드'}</Button>
        </div>
      ) : (
        <Button>{content}</Button>
      )}
    </div>
  );
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
<<<<<<< HEAD
  const socket = getGameSocket();
  const handleInviteClose = () => {
=======
  const handleInviteClose = useCallback(() => {
>>>>>>> main
    setIsInviteOpen(false);
  }, [setIsInviteOpen]);
  const handleInviteOpen = useCallback(() => {
    setIsInviteOpen(true);
<<<<<<< HEAD
  };
  function DualFunctionButton({ content }: { readonly content: ReactNode }) {
    const [isHovered, setIsHovered] = useState(false);

    function startNormal() {
      socket.emit('inviteNormalMatch', id);
      setGameMode('normal');
      handleInviteOpen();
    }
    function startItem() {
      socket.emit('inviteItemMatch', id);
      setGameMode('item');
      handleInviteOpen();
    }
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-[75px] h-[30px]"
      >
        {isHovered ? (
          <div className="absolute bottom-[-15px]">
            <Button onClick={() => startNormal()}>{'일반모드'}</Button>
            <Button onClick={() => startItem()}>{'아이템모드'}</Button>
          </div>
        ) : (
          <Button>{content}</Button>
        )}
      </div>
    );
  }
=======
  }, [setIsInviteOpen]);
>>>>>>> main

  return (
    <CommonCard
      imageUrl={imageUrl}
      nickname={nickname}
      id={id}
      refetch={refetch}
    >
      <div className="flex flex-row justify-center items-center gap-md">
        <DualFunctionButton
          content={'게임하기'}
          setGameMode={setGameMode}
          handleInviteOpen={handleInviteOpen}
        />
        <Button onClick={() => router.push(`/dm/${nickname}`)}>메세지</Button>
        <FriendSetting targetId={id} refetch={refetch} />
      </div>
      <FriendInvite
        isOpen={isInviteOpen}
        onClose={handleInviteClose}
        mode={gameMode}
        friendId={id}
      />
    </CommonCard>
  );
}
