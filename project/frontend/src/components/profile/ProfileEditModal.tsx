import { UserDto } from '@/api/api';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ModalLayout } from '../channel/modals/ModalLayout';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => Promise<void>;
}
function isNicknameValid(nickname: string): boolean {
  const nicknameRegex = /^[a-zA-Z0-9\-_]{6,12}$/;
  return nicknameRegex.test(nickname);
}

export const ProfileEditModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  fetchData,
}) => {
  const [isChanged, setIsChanged] = useState(false);
  const { api } = useContext(ApiContext);
  const mockId: string = '172daa3c-10af-4b37-b4d5-7a2f4ccc0dc2';
  // TODO: get id from cookie
  const [profileData, setProfileData] = useState<UserDto>({
    id: '',
    nickname: '',
    profileImageUrl: '',
    joinedAt: '',
    isLeaved: false,
    leavedAt: undefined,
    statusMessage: '',
  });

  const getProfileData = useCallback(async () => {
    try {
      const result = await api.usersControllerFindOne(mockId);
      // TODO: -> /api/v1/users/profile GET
      // TODO: me api -> replace mockId
      if (result.ok) {
        setProfileData(result.data);
      } else {
        console.error({ result });
        alert('TODO: Handle the error gracefully');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      alert('TODO: Handle the error gracefully');
    }
  }, [api, mockId]);

  useEffect(() => {
    if (isOpen) {
      getProfileData();
    }
  }, [isOpen, getProfileData]);

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

  const saveChanges = useCallback(async () => {
    try {
      const result = await api.usersControllerUpdate(mockId, {
        nickname: profileData.nickname,
      });
      if (!result.ok) {
        console.error({ result });
        alert('// TODO: Handle errors gracefully');
      }
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('// TODO: Handle errors gracefully');
    }
  }, [api, mockId, profileData.nickname, onClose, fetchData]);

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
          {profileData.profileImageUrl ? (
            <Image
              src={profileData.profileImageUrl}
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
              placeholder={profileData.nickname}
              className="bg-[#f3f0f8] border-2 border-dark-purple-interactive w-[200px]"
            />
            <p className={textClass}>상태메세지</p>
            <input
              type="text"
              value={profileData.statusMessage}
              onChange={handleStatusMessageChange}
              placeholder={profileData.statusMessage}
              className="bg-[#f3f0f8] border-2 border-dark-purple"
            />
          </div>
          <button
            disabled={!isChanged || !isNicknameValid(profileData.nickname)}
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
