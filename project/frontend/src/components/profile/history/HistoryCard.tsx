import Image from 'next/image';
import { LongCard } from '../../common/LongCard';

export enum CardType {
  Default = 'default',
  Small = 'small',
}

interface HistoryCardProps {
  readonly user1Name: string;
  readonly user2Name: string;
  readonly user1Avatar?: string;
  readonly user2Avatar?: string;
  readonly user1Score: number;
  readonly user2Score: number;
  readonly type?: CardType;
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
  const player1Img = user1Avatar ?? '/avatar/avatar-black.svg';
  const player2Img = user2Avatar ?? '/avatar/avatar-black.svg';
  return (
    <div className={type === CardType.Default ? 'mb-xl' : 'mb-md'}>
      <LongCard size={cardSize} color="default">
        <Image
          src={player1Img}
          alt="avatar"
          width={type === CardType.Default ? 50 : 30}
          height={type === CardType.Default ? 50 : 30}
          className="absolute left-sm"
        />
        <Image
          src={player2Img}
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
