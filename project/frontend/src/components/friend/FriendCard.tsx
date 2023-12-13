import { useRouter } from 'next/navigation';
import { Button } from '../common/Button';
import { GameInviteButtons } from '../game/GameInviteButtons';
import { FriendSetting } from './FriendSetting';
import { CommonCard } from './utils/CommonCard';

interface FriendCardProps {
  readonly nickname: string;
  readonly imageUrl?: string;
  readonly id: string;
  readonly refetch: () => Promise<unknown>;
}

export function FriendCard({
  nickname,
  imageUrl,
  id,
  refetch,
}: FriendCardProps) {
  const router = useRouter();
  return (
    <CommonCard
      imageUrl={imageUrl}
      nickname={nickname}
      id={id}
      refetch={refetch}
    >
      <div className="flex flex-row justify-center items-center gap-md">
        <GameInviteButtons content={'게임하기'} isModal={false} friendId={id} />
        <Button onClick={() => router.push(`/dm/${nickname}`)}>메세지</Button>
        <FriendSetting targetId={id} refetch={refetch} />
      </div>
    </CommonCard>
  );
}
