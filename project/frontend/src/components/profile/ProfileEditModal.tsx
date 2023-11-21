import Image from 'next/image';
import { useState } from 'react';
import { ModalLayout } from '../channel/modals/ModalLayout';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
}

interface ModalData {
  readonly profileImageUrl: string;
  readonly nickname: string;
  readonly statusMessage: string;
}

const mockModalData: ModalData = {
  profileImageUrl: '/avatar/avatar-black.svg',
  nickname: 'MockUser123',
  statusMessage: 'Happy day~',
};

export const ProfileEditModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  nickname,
}) => {
  const [editData, setEditData] = useState<ModalData>({
    ...mockModalData,
  });
  const [isChanged, setIsChanged] = useState(false);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData((prevData) => ({
      ...prevData,
      nickname: e.target.value,
    }));
    setIsChanged(true);
  };

  const handleStatusMessageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditData((prevData) => ({
      ...prevData,
      statusMessage: e.target.value,
    }));
    setIsChanged(true);
  };

  const saveChanges = () => {
    console.log('call /users/{id} with', editData);
    onClose();
  };

  const textClass = 'font-bold text-xl text-dark-purple leading-loose';
  const buttonClass =
    'w-[80px] h-[30px] rounded-sm border-2 text-center text-black text-lg font-bold hover:bg-light-background self-end';
  const colorClass = isChanged
    ? 'bg-default border-dark-purple'
    : 'bg-gray border-dark-gray';
  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="300px"
      height="500px"
    >
      <div className="w-[100%] h-[100%] relative">
        <div className="p-xl h-[100%] flex flex-col gap-lg justift-center items-center">
          <p className="text-h2 font-bold text-dark-purple">프로필 수정</p>
          <Image
            src={editData.profileImageUrl}
            priority={true}
            alt="avatar"
            width={100}
            height={100}
          />
          {/* <button
            onClick={saveChanges}
            className={`${buttonClass} ${'bg-default border-dark-purple'}`}
          >
            아바타 변경
          </button> */}
          <div className="flex flex-col w-[100%] justify-center">
            <p className={textClass}>닉네임</p>
            <input
              type="text"
              value={editData.nickname}
              onChange={handleNicknameChange}
              placeholder={mockModalData.nickname}
              className="bg-[#f3f0f8] border-2 border-dark-purple-interactive w-[200px]"
            />
            <p className={textClass}>상태메세지</p>
            <input
              type="text"
              value={editData.statusMessage}
              onChange={handleStatusMessageChange}
              placeholder={mockModalData.statusMessage}
              className="bg-[#f3f0f8] border-2 border-dark-purple"
            />
          </div>
          <button
            disabled={!isChanged}
            onClick={saveChanges}
            className={`${buttonClass} ${colorClass}`}
          >
            수정하기
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};
