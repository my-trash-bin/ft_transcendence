'use client';

import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { Button } from '../common/Button';
import { SelectAvatar } from './SelectAvatar';

type ChooseAvatarProps = {
  readonly avatars: string[];
  readonly onChooseClick: (avatar: string) => void;
};

export default function ChooseAvatar({
  avatars,
  onChooseClick,
}: ChooseAvatarProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(() => '');
  const [uploadImage, setUploadImage] = useState<any>(null);
  const { api } = useContext(ApiContext);
  const [isError, setIsError] = useState(false);

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (selectedFile.size > maxSize) {
        alert(
          'File size exceeds the maximum allowed size (1MB). Please choose a smaller file.',
        );
        event.target.value = null;
        return;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            setUploadImage(e.target.result);
          }
        };
        reader.readAsDataURL(selectedFile);
        await callApi(selectedFile);
      }
    } else {
      alert('Please select a file.');
    }
  };

  const callApi = async function (selectedFile: any) {
    try {
      const response = await api.avatarControllerUploadFile({
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });
      if (response.ok) {
        console.log('Uploaded image successfully');
        const responseData = await response.json();
        setSelectedAvatar(responseData.filePath);
      } else {
        setIsError(true);
        console.error('Error uploading file', response);
      }
    } catch (error) {
      setIsError(true);
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="w-2xl h-[400px] bg-light-background rounded-lg flex flex-col justify-center items-center px-2xl">
      <h2 className="font-bold mb-lg">2. 사용하실 아바타를 선택하세요.</h2>
      {render()}
    </div>
  );

  function render() {
    if (isError) {
      return <>알 수 없는 에러입니다.</>;
    } else {
      return (
        <div className="flex flex-col justify-center items-center">
          <div className="grid grid-cols-3 grid-flow-row gap-xl mb-lg">
            {avatars.map((avatar) => (
              <SelectAvatar
                key={avatar}
                imageUrl={avatarToUrl(avatar)}
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
          </div>
          <input
            type="file"
            accept="image/jpg,image/png,image/jpeg,image/gif"
            name="profile_img"
            className="text-md ml-[120px]"
            onChange={handleFileChange}
          />
          <div className="self-end">
            <Button
              onClick={() => {
                if (typeof selectedAvatar === 'string') {
                  onChooseClick(selectedAvatar);
                }
              }}
              disabled={!selectedAvatar}
            >
              다음으로
            </Button>
          </div>
        </div>
      );
    }
  }
}
