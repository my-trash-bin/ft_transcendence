import Image from 'next/image';
import { LongCard } from '../../common/LongCard';

export enum CardType {
  Default = 'default',
  Small = 'small',
}

interface HistoryCardProps {
  user1Name: string;
  user2Name: string;
  user1Avatar: string;
  user2Avatar: string;
  user1Score: number;
  user2Score: number;
  type?: CardType;
}

export function HistoryCard({
  user1Name,
  user2Name,
  user1Avatar,
  user2Avatar,
  user1Score,
  user2Score,
  type = CardType.Default,
}: HistoryCardProps) {
  const cardSize = type === CardType.Default ? 'medium' : 'small';

  return (
    <div className={type === CardType.Default ? 'mb-xl' : 'mb-md'}>
      <LongCard size={cardSize} color="default">
        <Image
          src={user1Avatar}
          alt="avatar"
          width={type === CardType.Default ? 50 : 30}
          height={type === CardType.Default ? 50 : 30}
          className="absolute left-sm"
        />
        <Image
          src={user2Avatar}
          alt="avatar"
          width={type === CardType.Default ? 50 : 30}
          height={type === CardType.Default ? 50 : 30}
          className="absolute right-sm"
        />
        <span
          className={`absolute text-left ${
            type === CardType.Default ? 'left-3xl' : 'left-2xl'
          }`}
        >
          {user1Name}
        </span>
        <span className="absolute left-1/2 transform -translate-x-1/2 text-center">
          {user1Score} : {user2Score}
        </span>
        <span
          className={`absolute text-right ${
            type === CardType.Default ? 'right-3xl' : 'right-2xl'
          }`}
        >
          {user2Name}
        </span>
      </LongCard>
    </div>
  );
}
