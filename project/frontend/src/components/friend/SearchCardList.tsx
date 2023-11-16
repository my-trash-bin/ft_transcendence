import { GET_FRIENDS } from '@/api/friend/FriendApi';
import { getClient } from '@/lib/ApolloClient';
import { useEffect, useState } from 'react';
import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import SearchCard from './SearchCard';

interface SearchCard {
  nickname: string;
  profileImageUrl: string;
}

async function fetchFriends() {
  const { data } = await getClient().query({
    query: GET_FRIENDS,
  });

  return data.friend as SearchCard[];
}

export function SearchCardList() {
  const [friendRenderData, setFriendRenderData] = useState<SearchCard[]>([]);
  const [searchUsername, setSearchUsername] = useState('');

  const userSearchCallback = (searchUsername: string) => {
    setSearchUsername(searchUsername);
  };

  useEffect(() => {
    const fetchData = async () => {
      const friendData = await fetchFriends();
      setFriendRenderData(
        friendData.filter((val) => val.nickname.includes(searchUsername)),
      );
    };

    fetchData();
  }, [searchUsername]);

  return (
    <div className="felx flex-col justify-center items-center">
      <div className="w-[700px] h-[600px] flex flex-col items-center">
        <MessageSearchInput
          width="600px"
          height="30px"
          eventFunction={userSearchCallback}
        />
        <div className="w-[700px] h-[580px] grid gap-lg justify-center items-start overflow-y-scroll pt-xl place-content-start">
          {friendRenderData.map((val, index) => {
            return (
              <SearchCard
                key={index}
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
