import { Title } from '@/components/common/Title';
import { Badge } from './Badge';
import { mockAchivementData } from './mockAchivementData';
import { Button } from '@/components/common/Button';
import { useRouter } from 'next/navigation';

export function AchivementBox() {
  const router = useRouter();

  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg relative">
      <div className="h-[inherit] pt-3xl pb-xl flex flex-col items-center">
        <Title location="top-left">업적</Title>
        <Button onClick={() => router.push('/profile/history')} size={'big'}>
          더보기
        </Button>
        <div className="grid grid-cols-3 h-[500px] w-[90%] mt-xl gap-md px-sm overflow-y-scroll">
          {mockAchivementData.map((badge) =>
            badge.isMine ? (
              <Badge
                key={badge.key}
                size="small"
                nameContent={badge.name}
                commentContent={null}
                imageURL={badge.imageURL}
              />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
