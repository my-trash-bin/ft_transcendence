import FriendCard from './FriendCard';

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

function FriendCardList() {
  return (
    <div className="w-[650px] h-[500px] mt-2xl grid gap-lg justify-center items-center overflow-y-scroll">
      {dummyFriend.map((val) => {
        return (
          <FriendCard
            key={val.key}
            imageUri={val.imageUri}
            nickname={val.nickname}
          />
        );
      })}
    </div>
  );
}
export default FriendCardList;
