import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { BlockCard } from './BlockCard';

export function BlockCardList() {
  const { api } = useContext(ApiContext);

  const { isLoading, isError, data } = useQuery(
    [],
    useCallback(
      async () => (await api.userFollowControllerFindBlocks()).data,
      [api],
    ),
  );
  return (
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll">
      {isLoading || !data ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        data.map((val) => (
          <BlockCard
            key={val.followee.id}
            imageURL={val.followee.profileImageUrl}
            nickname={val.followee.nickname}
            id={val.followee.id}
          />
        ))
      ) : (
        <div>No elements</div>
      )}
    </div>
  );
}
