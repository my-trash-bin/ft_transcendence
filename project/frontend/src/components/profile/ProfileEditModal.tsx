import { UserProfileDto } from '@/api/api';
import Image from 'next/image';
import { useCallback, useContext, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ModalLayout } from '../channel/modals/ModalLayout';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => Promise<unknown>;
  defaultData: UserProfileDto;
}
function isNicknameValid(nickname: string): boolean {
  const nicknameRegex = /^[a-zA-Z0-9\-_]{6,12}$/;
  return nicknameRegex.test(nickname);
}

export const ProfileEditModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  fetchData,
  defaultData,
}) => {
  const { api } = useContext(ApiContext);
  const [isChanged, setIsChanged] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileDto>(defaultData);

  const saveChanges = useCallback(async () => {
    try {
      await api.usersControllerUpdate({
        nickname: profileData.nickname,
      });
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('// TODO: Handle errors gracefully');
    }
  }, [api, , profileData.nickname, onClose, fetchData]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setProfileData((profileData) => ({
      ...profileData,
      nickname: newNickname,
    }));
    setIsChanged(false);
    if (isNicknameValid(newNickname)) {
      setIsChanged(true);
    }
  };

  const handleStatusMessageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setProfileData((profileData) => ({
      ...profileData,
      statusMessage: e.target.value,
    }));
    setIsChanged(true);
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
          {defaultData.imageUrl ? (
            <Image
              src={defaultData.imageUrl}
              alt="avatar"
              width={150}
              height={150}
            />
          ) : (
            <Image
              src={'/avatar/avatar-black.svg'}
              alt="avatar"
              width={150}
              height={150}
            />
          )}
          <div className="flex flex-col w-[100%] justify-center">
            <p className={textClass}>닉네임</p>
            <input
              type="text"
              value={profileData.nickname}
              onChange={handleNicknameChange}
              placeholder={defaultData.nickname}
              className="bg-[#f3f0f8] border-2 border-dark-purple-interactive w-[200px]"
            />
            <p className={textClass}>상태메세지</p>
            <input
              type="text"
              value={profileData.statusMessage}
              onChange={handleStatusMessageChange}
              placeholder={defaultData.statusMessage}
              className="bg-[#f3f0f8] border-2 border-dark-purple"
            />
          </div>
          <button
            disabled={!isChanged || !isNicknameValid(defaultData.nickname)}
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
