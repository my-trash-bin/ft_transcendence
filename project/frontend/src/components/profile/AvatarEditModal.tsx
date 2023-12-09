import Image from 'next/image';
import { useCallback, useContext, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { ModalLayout } from '../channel/modals/ModalLayout';
import { Button } from '../common/Button';
import { SelectAvatar } from '../sign-in/SelectAvatar';

const avatars: string[] = [
  '/avatar/avatar-blue.svg',
  '/avatar/avatar-black.svg',
  '/avatar/avatar-big.svg',
  '/avatar/avatar-small.svg',
];

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => Promise<unknown>;
  defaultData: any;
}

export const AvatarEditModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  fetchData,
}) => {
  const { api } = useContext(ApiContext);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(() => '');
  const [uploadImage, setUploadImage] = useState<any>(null);

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        setUploadImage(e.target.result);
      }
    };
    reader.readAsDataURL(selectedFile);
    await callApi(selectedFile);
  };

  async function callApi(selectedFile: any) {
    try {
      const response = await fetch('/api/v1/avatar/upload', {
        method: 'POST',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });
      if (response.ok) {
        console.log('Upload image successfully');
        const responseData = await response.json();
        setSelectedAvatar(responseData.filePath);
      } else {
        console.error('Error uploading file...');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const updateProfile = useCallback(async () => {
    try {
      await api.usersControllerUpdate({
        profileImageUrl: selectedAvatar,
      });
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  }, [api, onClose, fetchData, selectedAvatar]);

  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="300px"
      height="550px"
    >
      <div className="w-[100%] h-[100%] relative">
        <div className="p-xl h-[100%] flex flex-col gap-lg justift-center items-center">
          <p className="text-h2 font-taebaek text-dark-purple">아바타 수정</p>
          <div className="grid grid-cols-2 grid-flow-row gap-lg">
            {avatars.map((avatar) => (
              <SelectAvatar
                key={avatar}
                imageUrl={avatar}
                isSelected={selectedAvatar === avatar}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
            <div
              className={`${
                uploadImage
                  ? 'border-dark-purple'
                  : 'border-default hover:border-dark-gray hover:bg-light-background'
              }  w-lg h-lg border-3 inline-block overflow-x-hidden overflow-y-hidden`}
            >
              {uploadImage ? (
                <Image
                  src={uploadImage}
                  priority={true}
                  alt="avatar"
                  width={100}
                  height={100}
                />
              ) : null}
            </div>
            <input
              type="file"
              accept="image/jpg,image/png,image/jpeg,image/gif"
              name="profile_img"
              className="text-md"
              onChange={handleFileChange}
            />
          </div>
          <Button disabled={!selectedAvatar} onClick={updateProfile}>
            수정하기
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};
