import Image from 'next/image';
import { LongCard } from '../common/LongCard';

interface RankingCardProps {
  rank: number;
  name: string;
  avatar: string;
  isUser: boolean;
}

export default function RankingCard({
  rank,
  name,
  avatar,
  isUser,
}: RankingCardProps) {
  const alignCSS = 'flex items-center justify-between w-[600px]';
  return (
    <LongCard
      size={isUser ? 'big' : 'medium'}
      color={isUser ? 'color' : 'default'}
    >
      <div className={`${alignCSS}`}>
        <span>
          {rank}. {name}
        </span>
        <Image src={avatar} alt={`${name}'s avatar`} width={50} height={50} />
      </div>
    </LongCard>
  );
}
