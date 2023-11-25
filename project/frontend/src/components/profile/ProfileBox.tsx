import Image from 'next/image';
import { useCallback, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ProfileEditModal } from './ProfileEditModal';
import { TextBox } from './TextBox';

function ProfileBox() {
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
  const buttonClass =
    'w-lg h-sm bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold hover:bg-light-background ' +
    'absolute top-xl right-xl';
  return (
    <div className="w-[900px] h-xl bg-light-background rounded-lg mb-[30px] relative">
      {isLoading ? (
        <p>Loading...</p>
      ) : isError || !data ? (
        <p>Error loading profile data.</p>
      ) : (
        <div>
          <div className="h-[inherit] p-2xl flex flex-row items-center">
            {data.imageUrl ? (
              <Image
                src={data.imageUrl}
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
            )}{' '}
            <TextBox
              nickname={data.nickname}
              win={data.record.win}
              lose={data.record.win}
              ratio={data.record.win}
              statusMessage={data.statusMessage}
            />
            <button onClick={handleButtonClick} className={buttonClass}>
              프로필 수정
            </button>
          </div>
          <ProfileEditModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            fetchData={refetch}
            defaultData={data}
          />
        </div>
      )}
    </div>
  );
}

export default ProfileBox;
