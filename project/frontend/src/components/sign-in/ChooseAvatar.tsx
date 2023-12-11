'use client';

import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useState } from 'react';
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
  const [selectedFile, setSelectedFile] = useState<any>(undefined);
  const [fileUrl, setFileUrl] = useState<any>(undefined);
  const { api } = useContext(ApiContext);
  const [isError, setIsError] = useState(false);

  const handleFileChange = async (event: any) => {
    const newSelectedFile = event.target.files[0];

    if (!newSelectedFile) {
      alert('파일을 선택하세요.');
      return;
    } else if (newSelectedFile.size > 10 * 1024 * 1024) {
      event.target.value = null;
      alert('파일의 최대 크기는 10MB 입니다.');
      return;
    } else {
      setSelectedFile(newSelectedFile);
    }
  };

  const callApi = useCallback(
    async (uploadFile: any) => {
      try {
        console.log('call api with', uploadFile);
        const response = await api.avatarControllerUploadFile({
          body: uploadFile,
          headers: {
            'Content-Type': uploadFile.type,
          },
        });
        if (response.ok) {
          console.log('Uploaded image successfully', response);
          const responseData = await response.json();
          setSelectedAvatar(responseData.filePath);
          setFileUrl(responseData.filePath);
        } else {
          setIsError(true);
          console.error('Error uploading file', response);
        }
      } catch (error) {
        setIsError(true);
        console.error('Error uploading file1:', error);
      }
    },
    [api],
  );

  useEffect(() => {
    if (selectedFile) {
      callApi(selectedFile);
    }
  }, [selectedFile, callApi]);
  // console.log(selectedAvatar);
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
                fileUrl
                  ? 'border-dark-purple'
                  : 'border-default hover:border-dark-gray hover:bg-light-background'
              }  w-lg h-lg border-3 inline-block overflow-x-hidden overflow-y-hidden`}
            >
              {fileUrl ? (
                <Image
                  src={fileUrl}
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
