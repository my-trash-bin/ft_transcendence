import Image from 'next/image';
import { useState } from 'react';
import { ProfileEditModal } from './ProfileEditModal';
import { TextBox } from './TextBox';

interface ProfileArticleProps {
  readonly imageUrl?: string;
  readonly nickname: string;
  readonly win: number;
  readonly lose: number;
  readonly ratio: number;
  readonly statusMessage: string;
}

function ProfileBox(props: ProfileArticleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const buttonClass =
    'w-lg h-sm bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold hover:bg-light-background ' +
    'absolute top-xl right-xl';
  return (
    <div className="w-[900px] h-xl bg-light-background rounded-lg mb-[30px] relative">
      <div className="h-[inherit] p-2xl flex flex-row items-center">
        <Image
          src={props.imageUrl ?? '/avatar/avatar-black.svg'}
          priority={true}
          alt="avatar"
          width={150}
          height={150}
        />
        <TextBox
          nickname={props.nickname}
          win={props.win}
          lose={props.lose}
          ratio={props.ratio}
          statusMessage={props.statusMessage}
        />
        <button onClick={handleButtonClick} className={buttonClass}>
          프로필 수정
        </button>
      </div>
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        nickname={props.nickname}
      />
    </div>
  );
}

export default ProfileBox;
