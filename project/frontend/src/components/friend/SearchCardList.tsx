import { useCallback, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import { SearchCard } from './SearchCard';

export function SearchCardList({ activeScreen }: { activeScreen: string }) {
  const { api } = useContext(ApiContext);
  const [searchName, setSearchName] = useState('');
  const { isLoading, isError, data, refetch } = useQuery(
    ['searchList', searchName],
    useCallback(
      async () =>
        (
          await api.usersControllerSearchByNickname({
            q: searchName,
          })
        ).data,
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
        <div className="w-[700px] h-[580px] grid gap-lg justify-center items-start overflow-y-scroll pt-xl place-content-start">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError || !data ? (
            <p>Error loading profile data.</p>
          ) : data.length > 0 ? (
            data.map((val) => (
              <SearchCard
                key={val.nickname}
                imageUrl={val.profileImageUrl}
                nickname={val.nickname}
                id={val.id}
                refetch={refetch}
              />
            ))
          ) : (
            <div>No elements</div>
          )}
        </div>
      </div>
    </div>
  );
}
