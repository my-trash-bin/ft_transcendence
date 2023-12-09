import { useState } from 'react';
import { Button } from '../common/Button';
import FriendInvite from '../game/FriendInvite';
import { FriendSetting } from './FriendSetting';
import { CommonCard } from './utils/CommonCard';
import { useRouter } from 'next/navigation';

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
  const handleInviteClose = () => {
    setIsInviteOpen(false);
  };
  const handleInviteOpen = () => {
    setIsInviteOpen(true);
  };
  function DualFunctionButton({ content }) {
    const [isHovered, setIsHovered] = useState(false);

    function startNormal() {
      setGameMode('normal');
      handleInviteOpen();
    }
    function startItem() {
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

  return (
    <CommonCard
      imageUrl={imageUrl}
      nickname={nickname}
      id={id}
      refetch={refetch}
    >
      <div className="flex flex-row justify-center items-center gap-md">
        <DualFunctionButton content={'게임하기'} />
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
