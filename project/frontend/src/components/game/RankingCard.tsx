import Image from 'next/image';
import { useState } from 'react';
import { LongCard } from '../common/LongCard';

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
  const [, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
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
            <span className="">
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
    </div>
  );
}
