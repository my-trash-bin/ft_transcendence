import { GET_FRIENDS } from '@/api/friend/FriendApi';
import { getClient } from '@/lib/ApolloClient';
import { useEffect, useState } from 'react';
import BlockCard from './BlockCard';

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

function BlockCardList() {
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
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll">
      {friendData.map((val, index) => {
        return (
          <BlockCard
            key={index}
            imageURL={val.profileImageUrl}
            nickname={val.nickname}
          />
        );
      })}
    </div>
  );
}
export default BlockCardList;
