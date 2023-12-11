import { useCallback, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { FriendCard } from './FriendCard';
import { Loading } from '../common/Loading';
import { unwrap } from '@/api/unwrap';

export function FriendCardList({
  activeScreen,
}: {
  readonly activeScreen: string;
}) {
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data, refetch } = useQuery(
    'friendList',
    useCallback(
      async () => unwrap(await api.userFollowControllerFindFriends()),
      [api],
    ),
  );

  useEffect(() => {
    if (activeScreen === 'friend') {
      refetch();
    }
  }, [activeScreen, refetch]);

  return (
    <div className="w-[700px] h-[600px] mt-xl grid gap-lg justify-center items-center overflow-y-scroll place-content-start">
      {render()}
    </div>
  );

  function render() {
    if (isLoading) return <Loading width={500} />;

    if (isError || !data) {
      return <p className="font-normal text-h2">알 수 없는 에러</p>;
    }
    if (data.length === 0) {
      return <p className="font-semibold text-h2">아직 친구가 없습니다.</p>;
    }
    return data.map((val) => (
      <FriendCard
        key={val.followee.id}
        nickname={val.followee.nickname}
        imageUrl={val.followee.profileImageUrl}
        id={val.followee.id}
        refetch={refetch}
      />
    ));
  }
}
