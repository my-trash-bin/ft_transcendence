import { UserProfileDto } from '@/api/api';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ModalLayout } from '../channel/modals/ModalLayout';
import { Button } from '../common/Button';
import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import useToast from '../common/useToast';

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
  const { openMessage } = useToast();

  useEffect(() => {
    setIsChanged(false);
    setNewData(defaultData);
    setPassword('');
  }, [isOpen, defaultData]);

  const updateProfile = useCallback(async () => {
    try {
      await api.usersControllerUpdate({
        nickname: newData.nickname,
        statusMessage: newData.statusMessage,
      });
      fetchData();
      onClose();
    } catch (error) {
      alert(`${error.error.message}`);
      console.error('Error saving changes:', error);
    }
  }, [api, newData, onClose, fetchData]);

  const updatePassword = useCallback(async () => {
    try {
      await api.usersControllerSetTwoFactorPassword({
        password: password,
      });
      onClose();
    } catch (error: any) {
      if (error.status === 400) {
        openMessage(
          '비밀번호는 6-12자의 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다',
        );
      }
      console.error('Error send password:', error);
    }
  }, [onClose, api, password]);

  const unsetPassword = useCallback(async () => {
    try {
      await api.usersControllerUnsetTwoFactorPassword({});
      onClose();
    } catch (error) {
      alert('뭔가 에러');
      console.error('Error unset password:', error);
    }
  }, [onClose, api]);

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

  const textClass = 'font-bold text-xl  text-dark-purple leading-loose';
  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="300px"
      height="550px"
    >
      <div className="w-[100%] h-[100%] relative">
        <div className="p-xl h-[100%] flex flex-col gap-lg justift-center items-center">
          <p className="text-h2 font-taebaek text-dark-purple">프로필 수정</p>
          {defaultData.me.profileImageUrl ? (
            <Image
              src={avatarToUrl(defaultData.me.profileImageUrl)}
              alt="avatar"
              width={100}
              height={100}
              className="rounded-md"
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
            <div className="self-end mt-sm">
              <Button
                disabled={!isChanged || !isNicknameValid(newData.nickname)}
                onClick={updateProfile}
              >
                수정하기
              </Button>
            </div>
            <p className={textClass}>2차 비밀번호 설정</p>
            <input
              type="password"
              onChange={handlePasswordChange}
              className="bg-[#f3f0f8] border-2 border-dark-purple"
            />
            <div className="self-end mt-sm flex flex-row gap-sm">
              <Button onClick={unsetPassword}>해제하기</Button>
              <Button disabled={!password} onClick={updatePassword}>
                설정하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
};
