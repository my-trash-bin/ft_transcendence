import { UserDto } from '@/api/api';
import { useCallback, useContext, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import SearchCard from './SearchCard';

export function SearchCardList() {
  const [searchedData, setSearchedData] = useState<UserDto[]>([]);
  const [searchName, setSearchName] = useState('');
  const { api } = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const userSearchCallback = (searchUsername: string) => {
    setSearchName(searchUsername);
    fetchFriends();
  };

  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.usersControllerSearchByNickname({
        q: searchName,
      });
      setSearchedData(result.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [api, searchName]);

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
          {searchedData.map((val) => {
            return (
              <SearchCard
                key={val.nickname}
                imageURL={val.profileImageUrl}
                nickname={val.nickname}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
