import { Title } from '@/components/common/Title';
import { Badge } from './Badge';
import { useContext, useCallback } from 'react';
import { Button } from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { Loading } from '@/components/common/Loading';

export function AchivementBox() {
  const router = useRouter();
  const { api } = useContext(ApiContext);
  const { isLoading, data } = useQuery(
    ['fetchAchievement1'],
    useCallback(
      async () => (await api.achievementControllerFindAll()).data,
      [api],
    ),
  );

  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg relative">
      <div className="h-[inherit] pt-3xl pb-xl flex flex-col items-center">
        <Title location="top-left">업적</Title>
        <Button onClick={() => router.push('/profile/achivement')} size={'big'}>
          더보기
        </Button>
        <div className="w-[100%] pt-xl flex justify-center">{render()}</div>
      </div>
    </div>
  );

  function render() {
    if (isLoading) return <Loading width={300} />;

    const filteredData = data?.filter((badge) => badge.isMine);

    // console.log(filteredData);
    if (filteredData?.length === 0 || !filteredData)
      return (
        <p className="self-center text-center">아직 획득한 업적이 없습니다. </p>
      );
    return (
      <div className="grid grid-cols-3 h-[90%] w-[90%] gap-md px-sm overflow-y-scroll">
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
