import Image from 'next/image';
import LongCard from '../common/LongCard';

interface RankingCardProps {
  item: {
    rank: number;
    name: string;
    avatar: string;
  };
  isUser: boolean;
}

export default function RankingCard({ item, isUser }: RankingCardProps) {
  const alignCSS = 'flex items-center justify-between w-[600px]';

  return (
    <LongCard isUser={isUser}>
      <div className={`${alignCSS}`}>
        <span>
          {item.rank}. {item.name}
        </span>
        <Image
          src={item.avatar}
          alt={`${item.name}'s avatar`}
          width={50}
          height={50}
        />
      </div>
    </LongCard>
  );
}
