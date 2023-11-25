import { useCallback, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import { SearchCard } from './SearchCard';

export function SearchCardList() {
  const { api } = useContext(ApiContext);
  const [searchName, setSearchName] = useState('');

  const { isLoading, isError, data, refetch } = useQuery(
    [],
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
  const userSearchCallback = (searchUsername: string) => {
    setSearchName(searchUsername);
    refetch();
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
          {isLoading || !data ? (
            <p>Loading...</p>
          ) : data.length > 0 ? (
            data.map((val) => (
              <SearchCard
                key={val.nickname}
                imageURL={val.profileImageUrl}
                nickname={val.nickname}
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
