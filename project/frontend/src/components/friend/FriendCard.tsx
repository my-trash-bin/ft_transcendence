import Link from 'next/link';
import { useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { Button } from '../common/Button';
import { FriendSetting } from './FriendSetting';
import { CommonCard } from './utils/CommonCard';

interface FriendCardProps {
  readonly nickname: string;
  readonly imageURL?: string;
}

export function FriendCard(props: FriendCardProps) {
  const { api } = useContext(ApiContext);
  const { nickname } = props;

  return (
    <CommonCard imageURL={props.imageURL} nickname={props.nickname}>
      <Button onClick={() => alert('call game start api')}>게임하기</Button>
      <Link
        href={'/dm'}
        className={
          'w-md h-xs bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold mx-lg hover:bg-light-background'
        }
      >
        메세지
      </Link>
      <FriendSetting targetNickname={props.nickname} />
    </CommonCard>
  );
}
