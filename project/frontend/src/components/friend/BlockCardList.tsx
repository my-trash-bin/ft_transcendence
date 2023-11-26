import { useCallback, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { BlockCard } from './BlockCard';
import { Loading } from '../common/Loading';

export function BlockCardList({
  activeScreen,
}: {
  readonly activeScreen: string;
}) {
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data, refetch } = useQuery(
    ['blockList'],
    useCallback(
      async () => (await api.userFollowControllerFindBlocks()).data,
      [api],
    ),
  );

  useEffect(() => {
    if (activeScreen === 'block') {
      refetch();
    }
  }, [activeScreen, refetch]);

  return (
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll place-content-start">
      {render()}
    </div>
  );

  function render() {
    if (isLoading) return <Loading width={500} />;

    if (isError || !data) {
      return <p className="font-normal text-h2">Something wrong</p>;
    }
    if (data.length === 0) {
      return <p className="font-semibold text-h2">No elements</p>;
    }
    return data.map((val) => (
      <BlockCard
        key={val.followee.id}
        imageUrl={val.followee.profileImageUrl}
        nickname={val.followee.nickname}
        id={val.followee.id}
        refetch={refetch}
      />
    ));
  }
}
