import { unwrap } from '@/api/unwrap';
import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import { AvatarEditModal } from './AvatarEditModal';
import { ProfileEditModal } from './ProfileEditModal';
import { TextBox } from './TextBox';

export function ProfileBox() {
  const { api } = useContext(ApiContext);
  const [profileEditModal, setProfileEditModal] = useState(false);
  const [avatarEditModal, setAvatarEditModal] = useState(false);
  const router = useRouter();
  const { isLoading, isError, data, refetch } = useQuery(
    'myProfile',
    useCallback(
      async () => unwrap(await api.usersControllerMyProfile()),
      [api],
    ),
    {
      onSuccess: (fetchedData) => {
        localStorage.setItem('me', JSON.stringify(fetchedData.me));
      },
    },
  );
  const localMe = localStorage.getItem('me');
  const me = localMe ? JSON.parse(localMe) : null;
  const {
    isLoading: historyLoading,
    isError: historyError,
    data: historyData,
  } = useQuery(
    [me, 'fetchHistory'],
    useCallback(
      async () =>
        unwrap(await api.pongLogControllerGetUserGameHistories(me?.id)),
      [api, me],
    ),
  );
  const handleOpenProfile = () => {
    setProfileEditModal(true);
  };
  const handleCloseProfile = () => {
    setProfileEditModal(false);
  };
  const handleOpenAvatar = () => {
    setAvatarEditModal(true);
  };
  const handleCloseAvatar = () => {
    setAvatarEditModal(false);
  };

  const handleLogout = useCallback(async () => {
    try {
      const result = await api.authControllerLogout();
      if (!result.ok) {
        console.error({ result });
      } else {
        router.push('/');
        localStorage.removeItem('me');
      }
    } catch (error) {
      alert('알 수 없는 오류입니다!');
      console.error('Error during logout:', error);
    }
  }, [api, router]);

  return (
    <div className="w-[900px] h-xl bg-light-background rounded-lg mb-[30px] relative p-lg flex justify-center items-center">
      {renderProfileContent()}
    </div>
  );

  function renderProfileContent() {
    if (isLoading || historyLoading) return <Loading width={300} />;

    if (isError || historyError) {
      return <p>Error loading profile data.</p>;
    }
    if (!data) {
      return <p>Fail to get data.</p>;
    }
    return (
      <div className="flex flex-row justify-center items-center gap-lg w-[100%] h-[100%]">
        <div className="flex flex-col justify-center items-center gap-md px-2xl">
          <div className="w-[150px] h-[150px] rounded-md inline-block overflow-x-hidden overflow-y-hidden">
            {data.me.profileImageUrl ? (
              <Image
                src={avatarToUrl(data.me.profileImageUrl)}
                alt="avatar"
                width={150}
                height={150}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <Image
                src={'/avatar/avatar-black.svg'}
                alt="avatar"
                width={150}
                height={150}
              />
            )}
          </div>
          <Button onClick={handleOpenAvatar}>아바타 수정</Button>
        </div>
        <div className="flex flex-col justify-between rounded-sm bg-default p-xl w-[50%] h-[100%]">
          <TextBox
            nickname={data.me.nickname}
            win={historyData?.stats.wins}
            lose={historyData?.stats.losses}
            ratio={historyData?.stats.winRate}
            statusMessage={data.me.statusMessage}
          />
          <div className="self-end">
            <Button onClick={handleOpenProfile}>프로필 수정</Button>
          </div>
        </div>
        <Button onClick={handleLogout}>로그아웃</Button>
        <ProfileEditModal
          isOpen={profileEditModal}
          onClose={handleCloseProfile}
          fetchData={refetch}
          defaultData={data}
        />
        <AvatarEditModal
          isOpen={avatarEditModal}
          onClose={handleCloseAvatar}
          fetchData={refetch}
          defaultData={data}
        />
      </div>
    );
  }
}
