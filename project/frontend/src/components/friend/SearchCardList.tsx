import { useState } from 'react';
import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import SearchCard from './SearchCard';

interface SearchCard {
  nickname: string;
  profileImageUrl: string;
}

export function SearchCardList() {
  const [friendRenderData, setFriendRenderData] = useState<SearchCard[]>([]);
  const [searchUsername, setSearchUsername] = useState('');

  const userSearchCallback = (searchUsername: string) => {
    setSearchUsername(searchUsername);
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
