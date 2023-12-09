import { useCallback, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { BlockCard } from './BlockCard';
import { Loading } from '../common/Loading';
import { unwrap } from '@/api/unwrap';

export function BlockCardList({
  activeScreen,
}: {
  readonly activeScreen: string;
}) {
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data, refetch } = useQuery(
    'blockList',
    useCallback(
      async () => unwrap(await api.userFollowControllerFindBlocks()),
      [api],
    ),
  );

  useEffect(() => {
    if (activeScreen === 'block') {
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
      return <p className="font-semibold text-h2">차단한 사람이 없습니다.</p>;
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
