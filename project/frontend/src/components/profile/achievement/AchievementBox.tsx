import { unwrap } from '@/api/unwrap';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Title } from '@/components/common/Title';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { Badge } from './Badge';

export function AchievementBox() {
  const router = useRouter();
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data } = useQuery(
    'fetchAchievement',
    useCallback(
      async () => unwrap(await api.achievementControllerFindAll()),
      [api],
    ),
  );

  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg relative">
      <div className="h-[inherit] pt-3xl pb-xl flex flex-col items-center">
        <Title location="top-left">나의 업적</Title>
        <Button
          onClick={() => router.push('/profile/achievement')}
          size={'big'}
        >
          더보기
        </Button>
        <div className="w-[100%] pt-xl flex justify-center">{render()}</div>
      </div>
    </div>
  );

  function render() {
    if (isLoading) return <Loading width={300} />;
    if (isError || !data) {
      return <p className="text-center">Something went wrong</p>;
    }
    const filteredData = data?.filter((badge) => badge.isMine);

    if (filteredData?.length === 0 || !filteredData)
      return (
        <p className="self-center text-center">아직 획득한 업적이 없습니다. </p>
      );
    return (
      <div className="grid grid-cols-3 h-[300px] w-[90%] gap-md px-sm overflow-y-scroll">
        {filteredData.map((badge) => (
          <Badge
            key={badge.id}
            size="small"
            nameContent={badge.title}
            commentContent={null}
            imageURL={badge.imageUrl}
          />
        ))}
      </div>
    );
  }
}
