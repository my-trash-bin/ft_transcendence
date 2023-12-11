import { unwrap } from '@/api/unwrap';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { Loading } from '../common/Loading';
import { LongCard } from '../common/LongCard';
import RankingCard from './RankingCard';

export function Ranking() {
  const { api } = useContext(ApiContext);

  const { isLoading, isError, data } = useQuery(
    'ranking',
    useCallback(
      async () => unwrap(await api.pongLogControllerGetRanking()),
      [api],
    ),
  );

  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;
  const myData = data?.filter((item) => item.user.nickname === me.nickname);

  if (isLoading) return <Loading width={500} />;
  if (isError || !data) return <p>알 수 없는 오류가 발생했습니다.</p>;
  return (
    <div>
      {myRank()}
      <div className={'max-w-[620px] mx-auto'}>
        {data.slice(0, 5).map((item, i) => (
          <RankingCard
            key={item.user.nickname}
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
