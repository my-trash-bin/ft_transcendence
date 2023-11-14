import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import SearchCard from './SearchCard';
import { mockFriends } from './utils/mockFriends';

function SearchUser() {
  return (
    <div className="felx flex-col justify-center items-center">
      <div className="w-[700px] h-[600px] flex flex-col items-center">
        <MessageSearchInput width="600px" height="25px" />
        <div className="w-[700px] h-[580px] grid gap-lg justify-center items-center overflow-y-scroll pt-xl">
          {mockFriends.map((val) => {
            return (
              <SearchCard
                key={val.key}
                imageURL={val.imageURL}
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
