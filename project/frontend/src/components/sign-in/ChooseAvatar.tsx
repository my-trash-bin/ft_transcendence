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

  const onChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setUploadImage(e.target.result);
          setSelectedAvatar(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-2xl h-[400px] bg-light-background rounded-lg flex flex-col justify-center items-center">
      <h2 className="font-bold mb-lg">2. 사용하실 아바타를 선택하세요.</h2>
      <div className="flex flex-col">
        <div className="grid grid-cols-3 grid-flow-row gap-xl mb-xl">
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
          onChange={onChange}
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
    </div>
  );
}
