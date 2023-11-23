'use client';
import { UserDto } from '@/api/api';
import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import ProfileBox from '../../components/profile/ProfileBox';
import ArchivementBox from '../../components/profile/achivement/ArchivementBox';
import HistoryBox from '../../components/profile/history/HistoryBox';

export default function ProfilePage() {
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
  }, [api, mockId]);

  return (
    <div className="flex flex-row max-w-[100%] max-h-[100%]">
      <div className="flex flex-col items-center max-w-[100%] max-h-[100%]">
        <ProfileBox
          imageUrl={profileData.profileImageUrl}
          nickname={profileData.nickname}
          win={10}
          lose={10}
          ratio={50}
          statusMessage={'I can do it! - sample message'}
        />
        <div className="flex flex-row">
          <ArchivementBox />
          <HistoryBox />
        </div>
      </div>
    </div>
  );
}
// usersControllerFindOne
