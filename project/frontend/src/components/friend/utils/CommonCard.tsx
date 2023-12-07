import { ProfileModal } from '@/components/profile/ProfileModal';
import { ReactNode, useEffect, useState } from 'react';
import FriendAvatar from './FriendAvatar';
import FriendInvite from '@/components/game/FriendInvite';
import { getSocket } from '@/lib/Socket';

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [gameMode, setGameMode] = useState<'normal' | 'item'>('normal');
  const [active, setActive] = useState<'online' | 'offline' | 'on game'>(
    'offline',
  );
  const socket = getSocket();
  const activeColor =
    active === 'online'
      ? 'bg-default border-1 border-dark-purple'
      : active === 'offline'
      ? 'bg-gray'
      : 'bg-dark-purple';
  const handleStatus = (data: { status: string; userId: string }) => {
    console.log('status', data.status, 'userId', data.userId);
    if (id === data.userId && data.status === 'online') {
      setActive('online');
    }
    if (id === data.userId && data.status === 'offline') {
      setActive('offline');
    }
  };

  useEffect(() => {
    socket.on('userStatus', handleStatus);
    return () => {
      socket.off('userStatus', handleStatus);
    };
  }, []);

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };
  const handleProfileOpen = () => {
    setIsProfileOpen(true);
  };

  const handleInviteClose = () => {
    setIsInviteOpen(false);
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
        <div className="flex flex-row items-center gap-sm">
          <div className={`w-[10px] h-[10px] rounded-[10px] ${activeColor}`} />
          <p className="text-sm">{active}</p>
        </div>
      </div>
      <div className="absolute right-xl flex items-center">{children}</div>
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={handleProfileClose}
        targetId={id}
        refetchPage={refetch}
        openInvite={handleInviteOpen}
        setGameMode={setGameMode}
      />
      <FriendInvite
        isOpen={isInviteOpen}
        onClose={handleInviteClose}
        mode={gameMode}
        friendId={id}
      />
    </div>
  );
}
