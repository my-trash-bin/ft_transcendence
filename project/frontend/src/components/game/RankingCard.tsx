import Image from 'next/image';
import { useState } from 'react';
import { LongCard } from '../common/LongCard';
import ProfileModal from '../profile/ProfileModal';

interface RankingCardProps {
  readonly rank: number;
  readonly name: string;
  readonly avatar: string;
  readonly isUser: boolean;
}

export default function RankingCard({
  rank,
  name,
  avatar,
  isUser,
}: RankingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const alignCSS = 'flex items-center justify-between w-[600px]';
  return (
    <div>
      <button onClick={handleButtonClick} className="mb-xl">
        <LongCard
          size={isUser ? 'big' : 'medium'}
          color={isUser ? 'color' : 'default'}
        >
          <div className={`${alignCSS}`}>
            <span>
              {rank}. {name}
            </span>
            <Image
              src={avatar}
              alt={`${name}'s avatar`}
              width={50}
              height={50}
            />
          </div>
        </LongCard>
      </button>
      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        nickname={name}
      />
    </div>
  );
}
