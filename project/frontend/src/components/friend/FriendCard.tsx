import { Button } from '../common/Button';
import { FriendSetting } from './FriendSetting';
import { CommonCard } from './utils/CommonCard';
import { useRouter } from 'next/navigation';

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
        <Button onClick={() => alert('call game start api')}>게임하기</Button>
        <Button onClick={() => router.push('/dm')}>메세지</Button>
        <FriendSetting targetId={id} refetch={refetch} />
      </div>
    </CommonCard>
  );
}
