import { UserProfileDto } from '@/api/api';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ModalLayout } from '../channel/modals/ModalLayout';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => Promise<unknown>;
  defaultData: any;
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
  const [newData, setNewData] = useState<UserProfileDto>(defaultData);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsChanged(false);
    setNewData(defaultData);
    setPassword('');
  }, [isOpen, defaultData]);

  const updateProfile = useCallback(async () => {
    try {
      await api.usersControllerUpdate({
        nickname: newData.nickname,
        // profileImageUrl: newData.profileImageUrl,
        // statusMessage: newData.statusMessage,
      });
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  }, [api, , newData, onClose, fetchData]);

  const updatePassword = useCallback(async () => {
    try {
      alert('call api to set 2fa password');
      // await api.usersControllerUpdate({
      //   password: password,
      // });
      onClose();
    } catch (error) {
      console.error('Error send password:', error);
    }
  }, [onClose]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNewData((newData) => ({
      ...newData,
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
    setNewData((newData) => ({
      ...newData,
      statusMessage: e.target.value,
    }));
    setIsChanged(true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const textClass = 'font-bold text-xl text-dark-purple leading-loose';
  const buttonClass =
    'w-[80px] h-[30px] rounded-sm border-2 text-center text-black text-lg font-bold hover:bg-light-background self-end';
  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="300px"
      height="550px"
    >
      <div className="w-[100%] h-[100%] relative">
        <div className="p-xl h-[100%] flex flex-col gap-lg justift-center items-center">
          <p className="text-h2 font-bold text-dark-purple">프로필 수정</p>
          {defaultData.me.profileImageUrl ? (
            <Image
              src={defaultData.me.profileImageUrl}
              alt="avatar"
              width={100}
              height={100}
            />
          ) : (
            <Image
              src={'/avatar/avatar-black.svg'}
              alt="avatar"
              width={100}
              height={100}
            />
          )}
          <div className="flex flex-col w-[100%] justify-center">
            <p className={textClass}>닉네임</p>
            <input
              type="text"
              placeholder={defaultData.me.nickname}
              onChange={handleNicknameChange}
              className="bg-[#f3f0f8] border-2 border-dark-purple-interactive w-[200px]"
            />
            <p className={textClass}>상태메세지</p>
            <input
              type="text"
              placeholder={defaultData.me.statusMessage}
              onChange={handleStatusMessageChange}
              className="bg-[#f3f0f8] border-2 border-dark-purple"
            />
            <button
              disabled={!isChanged || !isNicknameValid(newData.nickname)}
              onClick={updateProfile}
              className={`${buttonClass} ${
                isChanged
                  ? 'bg-default border-dark-purple'
                  : 'bg-gray border-dark-gray'
              } mt-sm`}
            >
              수정하기
            </button>
            <p className={textClass}>2차 비밀번호 설정</p>
            <input
              type="password"
              onChange={handlePasswordChange}
              className="bg-[#f3f0f8] border-2 border-dark-purple"
            />
            <button
              disabled={!password}
              onClick={updatePassword}
              className={`${buttonClass} ${
                password
                  ? 'bg-default border-dark-purple'
                  : 'bg-gray border-dark-gray'
              } mt-sm`}
            >
              설정하기
            </button>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
};
