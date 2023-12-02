import Image from 'next/image';
import { useCallback, useContext, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ProfileEditModal } from './ProfileEditModal';
import { TextBox } from './TextBox';
import { Loading } from '../common/Loading';
import { Button } from '../common/Button';

export function ProfileBox() {
  const { api } = useContext(ApiContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, isError, data, refetch } = useQuery(
    [],
    useCallback(async () => (await api.usersControllerMyProfile()).data, [api]),
  );

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-[900px] h-xl bg-light-background rounded-lg mb-[30px] relative">
      <div className="h-[inherit] p-2xl flex flex-row items-center">
        {renderProfileContent()}
      </div>
    </div>
  );

  function renderProfileContent() {
    if (isLoading) return <Loading width={300} />;

    if (isError) {
      return <p>Error loading profile data.</p>;
    }
    if (!data) {
      return <p>Fail to get data.</p>;
    }

    return (
      <div className="flex flex-row ">
        {data.me.profileImageUrl ? (
          <Image
            src={data.me.profileImageUrl}
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
          nickname={data.me.nickname}
          // win={data.record.win}
          // lose={data.record.win}
          // ratio={data.record.win}
          win={3}
          lose={3}
          ratio={3}
          statusMessage={data.me.statusMessage}
        />
        <Button onClick={handleButtonClick} size={'big'}>
          프로필 수정
        </Button>
        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          fetchData={refetch}
          defaultData={data}
        />
      </div>
    );
  }
}
