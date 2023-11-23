import { UserDto } from '@/api/api';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ModalLayout } from '../channel/modals/ModalLayout';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
}

export const ProfileEditModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  nickname,
}) => {
  const [isChanged, setIsChanged] = useState(false);
  const { api } = useContext(ApiContext);

  const mockId: string = '172daa3c-10af-4b37-b4d5-7a2f4ccc0dc2';
  const [profileData, setProfileData] = useState<UserDto>({
    id: '',
    nickname: '',
    profileImageUrl: '', // Provide a default value if needed
    joinedAt: '',
    isLeaved: false, // Set the default value for boolean
    leavedAt: undefined, // You can set it to undefined or provide a default value
    statusMessage: '',
  });

  useEffect(() => {
    if (isOpen) {
      const getProfileData = async () => {
        try {
          const result = await api.usersControllerFindOne(mockId);
          // alert('TODO: -> /api/v1/users/profile GET');
          // alert('TODO: me api -> replace mockId');
          if (result.ok) {
            // console.log(result);
            setProfileData(result.data);
          } else {
            console.error({ result });
            alert('// TODO: Handle the error gracefully');
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          alert('// TODO: Handle the error gracefully');
        }
      };
      getProfileData();
    }
  }, [api, mockId, isOpen]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((profileData) => ({
      ...profileData,
      nickname: e.target.value,
    }));
    setIsChanged(true);
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

  const saveChanges = useCallback(() => {
    console.log('click saveChanges');
    async () => {
      console.log('inside async');
      const result = await api.usersControllerUpdate(mockId, {
        nickname: nickname,
      });
      if (!result.ok) {
        console.error({ result });
        alert('// TODO: 뭔가 좀 잘못 됐을 때 에러 메시지 좀 예쁘게');
      }
      console.log('get data');
      console.log(result);
      onClose();
    };
  }, [api, nickname, onClose]);

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
            src={profileData.profileImageUrl ?? '/avatar/avatar-black.svg'}
            priority={true}
            alt="avatar"
            width={100}
            height={100}
          />
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
