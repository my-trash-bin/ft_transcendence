import { useCallback, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { FriendCard } from './FriendCard';
import { Loading } from '../common/Loading';

export function FriendCardList({
  activeScreen,
}: {
  readonly activeScreen: string;
}) {
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data, refetch } = useQuery(
    ['friendList'],
    useCallback(
      async () => (await api.userFollowControllerFindFriends()).data,
      [api],
    ),
  );

  useEffect(() => {
    if (activeScreen === 'friend') {
      refetch();
    }
  }, [activeScreen, refetch]);

  return (
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll place-content-start">
      {isLoading ? (
        <Loading width={500} />
      ) : isError || !data ? (
        <p>Error loading profile data.</p>
      ) : data.length > 0 ? (
        data.map((val) => (
          <FriendCard
            key={val.followee.id}
            imageUrl={val.followee.profileImageUrl}
            nickname={val.followee.nickname}
            id={val.followee.id}
            refetch={refetch}
          />
        ))
      ) : (
        <div>No elements</div>
      )}
    </div>
  );
}
