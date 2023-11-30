'use client';

import Image from 'next/image';
import { useState } from 'react';
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
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null);
  const [uploadImage, setUploadImage] = useState<any>(null);

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        setUploadImage(e.target.result);
        setSelectedAvatar(e.target.result);
      }
    };
    reader.readAsDataURL(selectedFile);
    console.log('uploadImage1: ', uploadImage);
    // console.log('selectedFile: ', selectedFile);

    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }
    try {
      const response = await fetch('/api/v1/avatar/upload', {
        method: 'POST',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });
      console.log('uploadImage2: ', uploadImage);
      if (response.ok) {
        console.log('Upload image successfully');
      } else {
        console.error('Error uploading file...');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  return (
    <div className="w-2xl h-[400px] bg-light-background rounded-lg flex flex-col justify-center items-center px-2xl">
      <h2 className="font-bold mb-lg">2. 사용하실 아바타를 선택하세요.</h2>
      <div className="grid grid-cols-3 grid-flow-row gap-xl mb-lg">
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
            uploadImage === selectedAvatar && uploadImage
              ? 'border-dark-purple'
              : 'border-default hover:border-dark-gray hover:bg-light-background'
          }  w-lg h-lg border-3`}
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
