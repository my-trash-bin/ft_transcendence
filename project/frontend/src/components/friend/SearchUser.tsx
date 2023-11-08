import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import SearchCard from './SearchCard';

function SearchUser() {
  return (
    <div className="felx flex-col justify-center items-center">
      <div className="w-[700px] h-[600px] flex flex-col items-center">
        <MessageSearchInput width="600px" height="25px" />
        <div className="w-[700px] h-[580px] grid gap-lg justify-center items-center overflow-y-scroll pt-xl">
          {dummyFriend.map((val) => {
            return (
              <SearchCard
                key={val.key}
                imageUri={val.imageUri}
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

const dummyFriend = [
  {
    key: '1',
    imageUri: '/avatar/avatar-big.svg',
    nickname: 'klew',
  },
  {
    key: '2',
    imageUri: '/avatar/avatar-small.svg',
    nickname: 'minkim',
  },
  {
    key: '3',
    imageUri: '/avatar/avatar-black.svg',
    nickname: 'yoonsele',
  },
  {
    key: '4',
    imageUri: '/avatar/avatar-small.svg',
    nickname: 'hyunn',
  },
  {
    key: '5',
    imageUri: '/avatar/avatar-big.svg',
    nickname: 'klew',
  },
  {
    key: '6',
    imageUri: '/avatar/avatar-small.svg',
    nickname: 'kyu',
  },
];
