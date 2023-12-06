import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Title } from '@/components/common/Title';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { HistoryCard } from './HistoryCard';

export function HistoryBox() {
  const router = useRouter();
  const { api } = useContext(ApiContext);

  const { isLoading, isError, data } = useQuery(
    ['fetchHistory1'],
    useCallback(
      async () => (await api.pongLogControllerFindOneByUserId('5bbed335-f2f6-49c5-a651-5fd34dc647c9')).data,
      [api],
    ),
  );

  // "id": "string",
  // "player1Id": "string",
  // "player2Id": "string",
  // "player1Score": 0,
  // "player2Score": 0,
  // "isPlayer1win": true,
  // "createdAt": "2023-12-06T09:11:07.343Z"
  console.log(data);
  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg ml-xl relative">
      <div className="h-[inherit] pt-3xl pb-xl flex flex-col items-center">
        <Title location="top-left">최근 전적</Title>
        <Button onClick={() => router.push('/profile/history')} size={'big'}>
          더보기
        </Button>
        <div className="flex flex-col h-[500px] mt-xl w-[90%] overflow-y-scroll">
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

    if (data.userLogs.length === 0) {
      return <p className="font-semibold text-h2 text-center">No elements</p>;
    }

    return (
      <div className="flex flex-col items-center w-[80%] h-[500px] overflow-y-scroll">
        {data.userLogs.map((data) => (
          <HistoryCard
          key={data.id}
          user1Name={data.player1Id}
          user2Name={data.player2Id}
          user1Avatar={data.user1Avatar}
          user2Avatar={data.user2Avatar}
          user1Score={data.player1Score}
          user2Score={data.player2Score}
          />
        ))}
      </div>
    );
  }
}
