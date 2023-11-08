import toast, { Toaster } from 'react-hot-toast';
import FriendAvatar from './FriendAvatar';

interface SearchCardProps {
  readonly nickname: string;
  readonly imageUri: string;
}

function SearchCard(props: SearchCardProps) {
  const profile = () => toast(`${props.nickname} 프로필 모달`);
  const friend = () => toast(`${props.nickname} 친구 하기`);
  const buttonClass =
    'w-md h-xs bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold mr-lg hover:bg-light-background';
  return (
    <div className="w-[600px] h-[100px] bg-white border-3 border-default rounded-md flex items-center relative">
      <Toaster
        toastOptions={{
          duration: 2000,
        }}
      />
      <button onClick={profile}>
        <FriendAvatar src={`${props.imageUri}`} size={50} />
      </button>
      <div className="text-left text-black text-h2 font-semibold ml-2xl">
        {props.nickname}
      </div>
      <div className="absolute right-xl flex items-center">
        <button onClick={friend} className={buttonClass}>
          친구 하기
        </button>
      </div>
    </div>
  );
}
export default SearchCard;
