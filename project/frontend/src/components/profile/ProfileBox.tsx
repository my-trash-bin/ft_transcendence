import { UserDto } from '@/api/api';
import Image from 'next/image';
import { useCallback, useContext, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ProfileEditModal } from './ProfileEditModal';
import { TextBox } from './TextBox';

function ProfileBox() {
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
      if (result.ok) {
        setProfileData(result.data);
      } else {
        console.error({ result });
        alert('// TODO: Handle the error gracefully');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      alert('// TODO: Handle the error gracefully');
    }
  }, [api, mockId]);

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
        <TextBox
          nickname={profileData.nickname}
          win={10}
          lose={10}
          ratio={50}
          statusMessage={profileData.statusMessage}
        />
        <button onClick={handleButtonClick} className={buttonClass}>
          프로필 수정
        </button>
      </div>
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        fetchData={getProfileData}
      />
    </div>
  );
}

export default ProfileBox;
