import { UserFollowDto } from '@/api/api';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { BlockCard } from './BlockCard';
import mockFriends from './utils/mockFriends';

function BlockCardList() {
  const { api } = useContext(ApiContext);
  const [friendData, setFriendData] = useState<UserFollowDto[]>([]);

  const fetchFriends = useCallback(async () => {
    try {
      const result = await api.userFollowControllerFindBlocks();
      if (result.ok) {
        setFriendData(result.data);
      } else {
        console.error({ result });
        // alert('// TODO: Handle the error gracefully');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // alert('// TODO: Handle the error gracefully');
      setFriendData(mockFriends);
    }
  }, [api]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll">
      {friendData.map((val) => {
        return (
          <BlockCard
            key={val.followee.id}
            imageURL={val.followee.profileImageUrl}
            nickname={val.followee.nickname}
          />
        );
      })}
    </div>
  );
}
export default BlockCardList;
