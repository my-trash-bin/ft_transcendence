import { LiveStatus } from '@/components/common/LiveStatus';
import { ProfileModal } from '@/components/profile/ProfileModal';
import { ReactNode, useState } from 'react';
import FriendAvatar from './FriendAvatar';
import useFriendInviteStore from '@/components/common/FriendInvite';

interface CommonCardProps {
  readonly children: ReactNode;
  readonly imageUrl?: string;
  readonly nickname: string;
  readonly id: string;
  readonly refetch: () => Promise<unknown>;
}

export function CommonCard({
  children,
  imageUrl,
  nickname,
  id,
  refetch,
}: CommonCardProps) {
  const [gameMode, setGameModeLocal] = useState<'normal' | 'item'>('normal');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { setIsInviteOpen, setGameMode } = useFriendInviteStore();

  const toggleGameMode = () => {
    const newMode = gameMode === 'normal' ? 'item' : 'normal';
    setGameModeLocal(newMode);
    setGameMode(newMode);
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };
  const handleProfileOpen = () => {
    setIsProfileOpen(true);
  };
  const handleInviteOpen = () => {
    setIsInviteOpen(true);
  };
  const sizeCSS = 'w-[600px] h-[100px]';
  const colorCSS = 'bg-white border-3 border-default rounded-md';
  const alignCSS = 'flex items-center relative p-md';
  return (
    <div className={`${sizeCSS} ${colorCSS} ${alignCSS}`}>
      <FriendAvatar imageUrl={imageUrl} size={60} onClick={handleProfileOpen} />
      <div className="flex flex-col absolute left-[100px]">
        <div className="text-left text-black text-h3  font-light font-agro">
          {nickname}
        </div>
        <LiveStatus targetId={id} />
      </div>
      <div className="absolute right-xl flex items-center">{children}</div>
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={handleProfileClose}
        targetId={id}
        refetchPage={refetch}
        openInvite={handleInviteOpen}
        setGameMode={toggleGameMode}
      />
    </div>
  );
}
