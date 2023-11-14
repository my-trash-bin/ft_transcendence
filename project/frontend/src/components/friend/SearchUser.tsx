import { GET_FRIENDS } from '@/api/friend/FriendApi';
import { getClient } from '@/lib/ApolloClient';
import { useEffect, useState } from 'react';
import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import SearchCard from './SearchCard';

interface FriendInfo {
  nickname: string;
  profileImageUrl: string;
}

async function fetchFriends() {
  const { data } = await getClient().query({
    query: GET_FRIENDS,
  });

  return data.friend;
}

function SearchUser() {
  const [friendData, setFriendData] = useState<FriendInfo[]>([]);

  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFriends();
      setFriendData(data);
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div className="felx flex-col justify-center items-center">
      <div className="w-[700px] h-[600px] flex flex-col items-center">
        <MessageSearchInput width="600px" height="25px" />
        <div className="w-[700px] h-[580px] grid gap-lg justify-center items-center overflow-y-scroll pt-xl">
          {friendData.map((val, index) => {
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

export default SearchUser;
