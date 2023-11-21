import { useState } from 'react';
import FriendCard from './FriendCard';

interface FriendInfo {
  nickname: string;
  profileImageUrl: string;
}

function FriendCardList() {
  const [friendData, setFriendData] = useState<FriendInfo[]>([]);

  return (
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll">
      {friendData.map((val) => (
        <FriendCard
          key={val.nickname}
          imageURL={val.profileImageUrl}
          nickname={val.nickname}
        />
      ))}
    </div>
  );
}

export default FriendCardList;
