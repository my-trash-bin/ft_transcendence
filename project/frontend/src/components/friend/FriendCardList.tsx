import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { FriendCard } from './FriendCard';

export function FriendCardList() {
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data } = useQuery(
    [],
    useCallback(
      async () => (await api.userFollowControllerFindFriends()).data,
      [api],
    ),
  );

  return (
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll">
      {isLoading || !data ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        data.map((val) => (
          <FriendCard
            key={val.followee.id}
            imageURL={val.followee.profileImageUrl}
            nickname={val.followee.nickname}
          />
        ))
      ) : (
        <div>No elements</div>
      )}
    </div>
  );
}
