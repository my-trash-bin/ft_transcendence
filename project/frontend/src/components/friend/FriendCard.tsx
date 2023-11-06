import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import Avatar from '../common/Avatar';
import FriendSetting from './FriendSetting';
interface FriendCardProps {
  readonly nickname: string;
  readonly imageUri: string;
}

function FriendCard(props: FriendCardProps) {
  const profile = () => toast(`${props.nickname} 프로필 모달`);
  const game = () => toast(`${props.nickname} 게임 요청`);
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
      <div className="absolute right-xl flex items-center">
        <button onClick={game} className={buttonClass}>
          게임 하기
        </button>
        <Link href={'/dm'} className={buttonClass}>
          메세지
        </Link>
        <FriendSetting nickname={props.nickname} />
      </div>
    </div>
  );
}
export default FriendCard;
