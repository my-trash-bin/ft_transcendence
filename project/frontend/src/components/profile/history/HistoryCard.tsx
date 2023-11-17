import Image from 'next/image';
import { LongCard } from '../../common/LongCard';

enum CardType {
  Default = 'default',
  Small = 'small',
}

interface HistoryCardProps {
  readonly user1Name: string;
  readonly user2Name: string;
  readonly user1Avatar: string;
  readonly user2Avatar: string;
  readonly user1Score: number;
  readonly user2Score: number;
  readonly type?: CardType;
}

export function HistoryCard(props: HistoryCardProps) {
  const cardSize = props.type === CardType.Default ? 'medium' : 'small';

  return (
    <div className={props.type === CardType.Default ? 'mb-xl' : 'mb-md'}>
      <LongCard size={cardSize} color="default">
        <Image
          src={props.user1Avatar}
          alt="avatar"
          width={props.type === CardType.Default ? 50 : 30}
          height={props.type === CardType.Default ? 50 : 30}
          className="absolute left-sm"
        />
        <Image
          src={props.user2Avatar}
          alt="avatar"
          width={props.type === CardType.Default ? 50 : 30}
          height={props.type === CardType.Default ? 50 : 30}
          className="absolute right-sm"
        />
        <span
          className={`absolute text-left ${
            props.type === CardType.Default ? 'left-3xl' : 'left-2xl'
          }`}
        >
          {props.user1Name}
        </span>
        <span className="absolute left-1/2 transform -translate-x-1/2 text-center">
          {props.user1Score} : {props.user2Score}
        </span>
        <span
          className={`absolute text-right ${
            props.type === CardType.Default ? 'right-3xl' : 'right-2xl'
          }`}
        >
          {props.user2Name}
        </span>
      </LongCard>
    </div>
  );
}
