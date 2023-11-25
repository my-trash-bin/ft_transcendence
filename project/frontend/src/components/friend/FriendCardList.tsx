import { UserFollowDto } from '@/api/api';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { FriendCard } from './FriendCard';
import mockFriends from './utils/mockFriends';

export function FriendCardList() {
  const { api } = useContext(ApiContext);
  const [friendData, setFriendData] = useState<UserFollowDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.userFollowControllerFindFriends();
      if (result.ok) {
        setFriendData(result.data);
      } else {
        console.error({ result });
        // TODO: Handle the error gracefully
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // TODO: Handle the error gracefully
      setFriendData(mockFriends);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll">
      {loading ? (
        <p>Loading...</p>
      ) : (
        friendData.map((val) => (
          <FriendCard
            key={val.followee.id}
            imageURL={val.followee.profileImageUrl}
            nickname={val.followee.nickname}
          />
        ))
      )}
    </div>
  );
}
