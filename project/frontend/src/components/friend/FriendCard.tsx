import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import Avatar from '../common/Avatar';

interface FriendCardProps {
  readonly nickname: string;
  readonly imageUri: string;
}
const profile = () => toast('프로필 모달 호출');
const game = () => toast('게임 요청하는 함수');
const dm = () => toast('디엠 요청하는 함수');

function FriendCard(props: FriendCardProps) {
  const buttonClass =
    'w-md h-xs bg-default rounded-full border-2 border-dark-purple text-center text-black text-lg font-bold mr-lg hover:bg-light-background';
  return (
    <div className="w-[600px] h-[100px] bg-light-background flex items-center relative">
      <button onClick={profile}>
        <Avatar src={`${props.imageUri}`} />
      </button>
      <div className="text-left text-black text-h2 font-semibold ml-2xl">
        {props.nickname}
      </div>
      <div className="absolute right-xl flex">
        <button onClick={game} className={buttonClass}>
          게임 하기
        </button>
        <Toaster
          toastOptions={{
            duration: 2000,
          }}
        />
        <button onClick={dm} className={buttonClass}>
          메세지
        </button>
        <Toaster
          toastOptions={{
            duration: 2000,
          }}
        />
        <Image
          src={`/icon/setting.svg`}
          alt={`setting-icon`}
          width={30}
          height={30}
        />
      </div>
    </div>
  );
}
export default FriendCard;
