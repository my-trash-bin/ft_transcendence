import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Title } from '@/components/common/Title';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { CardType, HistoryCard } from './HistoryCard';

export function HistoryBox() {
  const router = useRouter();
  const { api } = useContext(ApiContext);

  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;

  const { isLoading, isError, data } = useQuery(
    [me, 'fetchHistory'],
    useCallback(
      async () => (await api.pongLogControllerGetUserGameHistories(me.id)).data,
      [api, me.id],
    ),
  );

  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg ml-xl relative">
      <div className="h-[inherit] pt-3xl pb-xl flex flex-col items-center">
        <Title location="top-left">게임 히스토리</Title>
        <Button onClick={() => router.push('/profile/history')} size={'big'}>
          더보기
        </Button>
        <div className="flex flex-col h-[400px] mt-xl w-[90%]">{render()}</div>
      </div>
    </div>
  );

  function render() {
    if (isLoading) return <Loading width={300} />;

    if (isError || !data) {
      return <p className="text-center">Something went wrong</p>;
    }

    if (data.records.length === 0) {
      return <p className="text-center">아직 게임 히스토리가 없습니다.</p>;
    }

    return (
      <div className="flex flex-col items-center w-[100%] h-[300px] overflow-y-scroll">
        {data.records.map((history: any) => (
          <HistoryCard
            key={history.id}
            user1Name={history.player1.nickname}
            user2Name={history.player2.nickname}
            user1Avatar={history.player1.profileImageUrl}
            user2Avatar={history.player2.profileImageUrl}
            user1Score={history.player1Score}
            user2Score={history.player2Score}
            type={CardType.Small}
          />
        ))}
      </div>
    );
  }
}
