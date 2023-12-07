import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import RankingCard from './RankingCard';
import { mockUser } from './mockUser';

export function Ranking() {
  const { api } = useContext(ApiContext);

  const { isLoading, isError, data } = useQuery(
    [''],
    useCallback(
      async () => (await api.pongLogControllerGetRanking()).data,
      [api],
    ),
  );

  return (
    <div>
      <RankingCard
        rank={mockUser[0].rank}
        name={mockUser[0].name}
        avatar={mockUser[0].avatar}
        isUser={true}
      />
      <div className={'max-w-[620px] mx-auto'}>
        {data &&
          data
            .slice(0, 5)
            .map((item) => (
              <RankingCard
                key={item.id}
                rank={item.rank}
                name={item.user.nickname}
                avatar={item.user.profileImageUrl}
                isUser={false}
              />
            ))}
      </div>
    </div>
  );
}
