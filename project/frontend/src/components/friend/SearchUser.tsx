import { MessageSearchInput } from '../channel/message-search/MessageSearchInput';
import SearchCard from './SearchCard';

function SearchUser() {
  return (
    <div className="felx flex-col justify-center items-center">
      <div className="mt-xl mb-xl">
        <MessageSearchInput margin="m-auto" />
      </div>
      <div className="w-[700px] h-[500px] grid gap-lg justify-center items-center overflow-y-scroll">
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
