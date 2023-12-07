import { ProfileModal } from '@/components/profile/ProfileModal';
import { ReactNode, useState } from 'react';
import FriendAvatar from './FriendAvatar';
import FriendInvite from '@/components/game/FriendInvite';

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
      <div className="text-left text-black text-h3 absolute left-[100px] font-light font-agro">
        {nickname}
      </div>
      <div className="absolute right-xl flex items-center">{children}</div>
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={handleProfileClose}
        targetId={id}
        refetchPage={refetch}
        openInvite={handleInviteOpen}
      />
      <FriendInvite
        isOpen={isInviteOpen}
        onClose={handleInviteClose}
        mode="item"
        friendId={id}
      />
    </div>
  );
}
