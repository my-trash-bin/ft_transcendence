import Link from 'next/link';
import { Button } from '../common/Button';
import { FriendSetting } from './FriendSetting';
import { CommonCard } from './utils/CommonCard';

interface FriendCardProps {
  readonly nickname: string;
  readonly imageURL?: string;
  readonly id: string;
  readonly refetch: () => Promise<unknown>;
}

export function FriendCard(props: FriendCardProps) {
  return (
    <CommonCard
      imageURL={props.imageURL}
      nickname={props.nickname}
      id={props.id}
    >
      <Button onClick={() => alert('call game start api')}>게임하기</Button>
      <Link
        href={'/dm'}
        className={
          'w-md h-xs bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold mx-lg hover:bg-light-background'
        }
      >
        메세지
      </Link>
      <FriendSetting targetId={props.id} refetch={props.refetch} />
    </CommonCard>
  );
}
