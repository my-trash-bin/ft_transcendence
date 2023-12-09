import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import RankingCard from './RankingCard';
import { LongCard } from '../common/LongCard';

export function Ranking() {
  const { api } = useContext(ApiContext);

  const { isLoading, isError, data } = useQuery(
    [''],
    useCallback(
      async () => (await api.pongLogControllerGetRanking()).data,
      [api],
    ),
  );

  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;
  const myData = data?.filter((item) => item.user.nickname === me.nickname);

  return (
    <div>
      {myRank()}
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
  function myRank() {
    if (myData)
      return (
        <RankingCard
          rank={myData[0].rank}
          name={myData[0].user.nickname}
          avatar={myData[0].user.profileImageUrl}
          isUser={true}
        />
      );
    else
      return (
        <LongCard size={'big'} color={'color'}>
          아직 나의 랭킹이 없습니다.
        </LongCard>
      );
  }
}
