import { useCallback, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import { SearchCard } from './SearchCard';
import { Loading } from '../common/Loading';
import { unwrap } from '@/api/unwrap';

export function SearchCardList({
  activeScreen,
}: {
  readonly activeScreen: string;
}) {
  const { api } = useContext(ApiContext);
  const [searchName, setSearchName] = useState('');
  const { isLoading, isError, data, refetch } = useQuery(
    ['searchList', searchName],
    useCallback(
      async () =>
        unwrap(
          await api.usersControllerSearchByNickname({
            q: searchName,
          }),
        ),
      [api, searchName],
    ),
  );

  useEffect(() => {
    if (activeScreen === 'search') {
      refetch();
    }
  }, [activeScreen, refetch]);

  const userSearchCallback = (searchUsername: string) => {
    setSearchName(searchUsername);
  };

  return (
    <div className="felx flex-col justify-center items-center">
      <div className="w-[700px] h-[600px] flex flex-col items-center">
        <MessageSearchInput
          width="600px"
          height="30px"
          placeholder="Search Friends"
          eventFunction={userSearchCallback}
        />
        <div className="w-[700px] h-[580px] grid gap-lg justify-center items-start overflow-y-scroll mt-xl place-content-start">
          {render()}
        </div>
      </div>
    </div>
  );

  function render() {
    if (isError && !isLoading) {
      return <p className="font-normal text-h2">Something wrong</p>;
    }
    if (isLoading || !data) return <Loading width={500} />;
    if (data.length === 0) {
      return <p className="font-semibold text-h2">No elements</p>;
    }
    return data.map((val) => (
      <SearchCard key={val.nickname} data={val} refetch={refetch} />
    ));
  }
}
