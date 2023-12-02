import { Title } from '@/components/common/Title';
import { CardType, HistoryCard } from './HistoryCard';
import { mockData } from './mockDataHistory';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';

export function HistoryBox() {
  const router = useRouter();

  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg ml-xl relative">
      <div className="h-[inherit] pt-3xl pb-xl flex flex-col items-center">
        <Title location="top-left">최근 전적</Title>
        <Button onClick={() => router.push('/profile/history')} size={'big'}>
          더보기
        </Button>
        <div className="flex flex-col h-[500px] mt-xl w-[90%] overflow-y-scroll">
          {mockData.map((data) => (
            <HistoryCard
              key={data.key}
              user1Name={data.user1Name}
              user2Name={data.user2Name}
              user1Avatar={data.user1Avatar}
              user2Avatar={data.user2Avatar}
              user1Score={data.user1Score}
              user2Score={data.user2Score}
              type={CardType.Small}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
