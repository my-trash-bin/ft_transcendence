import Image from 'next/image';
import LongCard from '../../common/LongCard';

interface HistoryCardProps {
  readonly user1Name: string;
  readonly user2Name: string;
  readonly user1Avatar: string;
  readonly user2Avatar: string;
  readonly user1Score: number;
  readonly user2Score: number;
}

export function HistoryCard(props: HistoryCardProps) {
  return (
    <LongCard isUser={false}>
      <Image
        src={props.user1Avatar}
        alt="avatar"
        width={50}
        height={50}
        className="absolute left-sm"
      />
      <span className="text-left absolute left-3xl">{props.user1Name}</span>
      <span className="absolute left-1/2 transform -translate-x-1/2 text-center">
        {props.user1Score} : {props.user2Score}
      </span>
      <span className="text-right absolute right-3xl">{props.user2Name}</span>

      <Image
        src={props.user2Avatar}
        alt="avatar"
        width={50}
        height={50}
        className="absolute right-sm"
      />
    </LongCard>
  );
}
