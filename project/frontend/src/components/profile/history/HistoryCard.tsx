import Image from 'next/image';
import { LongCard } from '../../common/LongCard';

interface HistoryCardProps {
  readonly user1Name: string;
  readonly user2Name: string;
  readonly user1Avatar: string;
  readonly user2Avatar: string;
  readonly user1Score: number;
  readonly user2Score: number;
  readonly isdefault: boolean;
}

export function HistoryCard(props: HistoryCardProps) {
  return (
    <LongCard size={props.isdefault ? 'medium' : 'small'} color="default">
      <Image
        src={props.user1Avatar}
        alt="avatar"
        width={props.isdefault ? 50 : 30}
        height={props.isdefault ? 50 : 30}
        className="absolute left-sm"
      />
      <Image
        src={props.user2Avatar}
        alt="avatar"
        width={props.isdefault ? 50 : 30}
        height={props.isdefault ? 50 : 30}
        className="absolute right-sm"
      />
      <span
        className={`absolute text-left ${
          props.isdefault ? 'left-3xl' : 'left-2xl'
        }`}
      >
        {props.user1Name}
      </span>
      <span className="absolute left-1/2 transform -translate-x-1/2 text-center">
        {props.user1Score} : {props.user2Score}
      </span>
      <span
        className={`absolute text-right ${
          props.isdefault ? 'right-3xl' : 'right-2xl'
        }`}
      >
        {props.user2Name}
      </span>
    </LongCard>
  );
}
