import ProfileModal from '@/components/profile/ProfileModal';
import { ReactNode, useState } from 'react';
import FriendAvatar from './FriendAvatar';

interface CommonCardProps {
  readonly children: ReactNode;
  readonly imageURL?: string;
  readonly nickname: string;
  readonly id: string;
}

export function CommonCard({
  children,
  imageURL,
  nickname,
  id,
}: CommonCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const sizeCSS = 'w-[600px] h-[100px]';
  const colorCSS = 'bg-white border-3 border-default rounded-md';
  const alignCSS = 'flex items-center relative p-md';
  return (
    <div className={`${sizeCSS} ${colorCSS} ${alignCSS}`}>
      <FriendAvatar imageUrl={imageURL} size={60} onClick={handleModalOpen} />
      <div className="text-left text-black text-h2 font-semibold absolute left-[100px]">
        {nickname}
      </div>
      <div className="absolute right-xl flex items-center">{children}</div>
      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        targetId={id}
      />
    </div>
  );
}
