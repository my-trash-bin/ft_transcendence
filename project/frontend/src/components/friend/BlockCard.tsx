import toast, { Toaster } from 'react-hot-toast';
import Avatar from '../common/Avatar';

interface FriendCardProps {
  readonly nickname: string;
  readonly imageUri: string;
}
const profile = () => toast('프로필 모달 호출');
const unblock = () => toast('차단 해제하는 함수 호출');

function FriendCard(props: FriendCardProps) {
  const buttonClass =
    'w-md h-xs bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold mr-lg hover:bg-light-background';
  return (
    <div className="w-[600px] h-[100px] bg-light-background rounded-md flex items-center relative">
      <Toaster
        toastOptions={{
          duration: 2000,
        }}
      />
      <button onClick={profile}>
        <Avatar src={`${props.imageUri}`} />
      </button>
      <div className="text-left text-black text-h2 font-semibold ml-2xl">
        {props.nickname}
      </div>
      <div className="absolute right-xl flex">
        <button onClick={unblock} className={buttonClass}>
          차단 풀기
        </button>
      </div>
    </div>
  );
}
export default FriendCard;
