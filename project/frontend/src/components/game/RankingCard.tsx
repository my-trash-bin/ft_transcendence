import Image from 'next/image';
import { LongCard } from '../common/LongCard';

interface RankingCardProps {
  readonly rank: number;
  readonly name: string;
  readonly avatar?: string;
  readonly isUser: boolean;
}

export default function RankingCard({
  rank,
  name,
  avatar,
  isUser,
}: RankingCardProps) {
  const imageUrl = avatar ?? '/avatar/avatar-black.svg';
  const alignCSS = 'flex items-center justify-between w-[600px]';
  return (
    <div>
      <button className="">
        <LongCard
          size={isUser ? 'big' : 'medium'}
          color={isUser ? 'color' : 'default'}
        >
          <div className={`${alignCSS}`}>
            <span className="">
              {rank}. {name}
            </span>
            <Image
              src={imageUrl}
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
