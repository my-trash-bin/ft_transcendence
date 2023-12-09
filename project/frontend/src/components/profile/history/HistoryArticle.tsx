import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Title } from '@/components/common/Title';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { HistoryCard } from './HistoryCard';

export function HistoryArticle() {
  const { api } = useContext(ApiContext);
  const router = useRouter();
  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;

  const { isLoading, isError, data } = useQuery(
    [me, 'fetchHistory'],
    useCallback(
      async () => (await api.pongLogControllerGetUserGameHistories(me.id)).data,
      [api, me],
    ),
  );

  return (
    <div className="relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <Title location="top-center" font="big">
          게임 히스토리
        </Title>
        <Button onClick={() => router.push('/profile')} size={'big'}>
          돌아가기
        </Button>
        <div className="flex flex-col items-center w-[100%] h-[500px] mt-3xl">
          {render()}
        </div>
      </div>
    </div>
  );

  function render() {
    if (isLoading) return <Loading width={500} />;

    if (isError || !data) {
      return <p className="text-h2 text-center">Something went wrong</p>;
    }

    if (data.records.length === 0) {
      return (
        <p className="text-h2 text-center">아직 게임 히스토리가 없습니다.</p>
      );
    }

    return (
      <div className="flex flex-col items-center w-[80%] h-[500px] overflow-y-scroll pt-sm">
        {data.records.map((history: any) => (
          <HistoryCard
            key={history.id}
            user1Name={history.player1.nickname}
            user2Name={history.player2.nickname}
            user1Avatar={history.player1.profileImageUrl}
            user2Avatar={history.player2.profileImageUrl}
            user1Score={history.player1Score}
            user2Score={history.player2Score}
          />
        ))}
      </div>
    );
  }
}
