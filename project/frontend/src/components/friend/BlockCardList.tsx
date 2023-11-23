import { useState } from 'react';
import BlockCard from './BlockCard';

interface FriendInfo {
  nickname: string;
  profileImageUrl: string;
}

function BlockCardList() {
  const [friendData, setFriendData] = useState<FriendInfo[]>([]);

  return (
    <div className="w-[700px] h-[600px] pt-xl grid gap-lg justify-center items-center overflow-y-scroll">
      {friendData.map((val) => {
        return (
          <BlockCard
            key={val.nickname}
            imageURL={val.profileImageUrl}
            nickname={val.nickname}
          />
        );
      })}
    </div>
  );
}
export default BlockCardList;
