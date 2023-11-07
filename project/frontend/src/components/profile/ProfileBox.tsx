import Image from 'next/image';
import toast from 'react-hot-toast';
import { TextBox } from './TextBox';

interface ProfileArticleProps {
  readonly avatar: string;
  readonly nickname: string;
  readonly win: number;
  readonly lose: number;
  readonly ratio: number;
  readonly statusMessage: string;
}

function ProfileBox(props: ProfileArticleProps) {
  const profile = () => toast(`프로필 수정`);
  const buttonClass =
    'w-lg h-sm bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold hover:bg-light-background ' +
    'absolute top-xl right-xl';
  return (
    <div className="w-[600px] h-xl bg-light-background rounded-lg ml-xl mt-xl mb-xl relative">
      <div className="h-[inherit] p-2xl flex flex-row items-center">
        <Image
          src={props.avatar}
          priority={true}
          alt="avatar"
          width={150}
          height={200}
        />
        <TextBox
          nickname={props.nickname}
          win={props.win}
          lose={props.lose}
          ratio={props.ratio}
          statusMessage={props.statusMessage}
        />
        <button onClick={profile} className={buttonClass}>
          프로필 수정
        </button>
      </div>
    </div>
  );
}

export default ProfileBox;
