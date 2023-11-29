import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { Loading } from '@/components/common/Loading';
import { Title } from '@/components/common/Title';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { ProfileButton } from '../ProfileButton';
import { HistoryCard } from './HistoryCard';
import { mockData } from './mockDataHistory';

export function HistoryArticle() {
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data } = useQuery(
    ['achivement'],
    useCallback(
      async () => (await api.userFollowControllerFindFriends()).data,
      [api],
    ),
  );
  return (
    <div className="relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <Title location="top-center">최근 전적</Title>
        <ProfileButton href="/profile" text="돌아가기" />
        <div className="flex flex-col items-center w-[100%] h-[500px] mt-3xl">
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
      <div className="flex flex-col items-center w-[80%] h-[500px] overflow-y-scroll">
        {mockData.map((data) => (
          <HistoryCard
            key={data.key}
            user1Name={data.user1Name}
            user2Name={data.user2Name}
            user1Avatar={data.user1Avatar}
            user2Avatar={data.user2Avatar}
            user1Score={data.user1Score}
            user2Score={data.user2Score}
          />
        ))}
      </div>
    );
  }
}
