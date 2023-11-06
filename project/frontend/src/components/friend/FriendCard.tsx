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
        <button onClick={game} className={buttonClass}>
          게임 하기
        </button>
        <button onClick={dm} className={buttonClass}>
          메세지
        </button>
        <Image
          src={`/icon/message-setting.svg`}
          alt={`setting-icon`}
          width={20}
          height={20}
          className="rotate-90"
        />
      </div>
    </div>
  );
}
export default FriendCard;
