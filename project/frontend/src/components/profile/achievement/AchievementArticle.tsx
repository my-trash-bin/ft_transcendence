import { unwrap } from '@/api/unwrap';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Title } from '@/components/common/Title';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { Badge } from './Badge';

export function AchievementArticle() {
  const { api } = useContext(ApiContext);
  const router = useRouter();
  const { isLoading, isError, data } = useQuery(
    'fetchAchievement',
    useCallback(
      async () => unwrap(await api.achievementControllerFindAll()),
      [api],
    ),
  );

  return (
    <div className="relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <Title location="top-center" font="big">
          전체 업적
        </Title>
        <Button onClick={() => router.push('/profile')} size={'big'}>
          돌아가기
        </Button>
        <div className="w-[700px] mt-3xl p-md flex justify-center">
          {render()}
        </div>
      </div>
    </div>
  );

  function render() {
    if (isLoading) return <Loading width={500} />;

    if (isError || !data) {
      return (
        <p className="font-normal text-h2 text-center">Something went wrong</p>
      );
    }

    if (data.length === 0) {
      return <p className="font-semibold text-h2 text-center">No elements</p>;
    }

    return (
      <div className="grid grid-cols-3 w-[700px] h-[500px] gap-xl p-md overflow-y-scroll">
        {data?.map((badge) => (
          <Badge
            key={badge.id}
            nameContent={badge.title}
            commentContent={badge.description}
            imageURL={badge.imageUrl}
            isMine={badge.isMine}
          />
        ))}
      </div>
    );
  }
}
