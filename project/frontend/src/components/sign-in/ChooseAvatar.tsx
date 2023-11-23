'use client';

import { useState } from 'react';
import { Button } from '../common/Button';
import SelectAvatar from './SelectAvatar';

type ChooseAvatarProps = {
  readonly avatars: string[];
  readonly onChooseClick: (avatar: string) => void;
};

export default function ChooseAvatar({
  avatars,
  onChooseClick,
}: ChooseAvatarProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  return (
    <div className="w-2xl h-[400px] bg-light-background rounded-lg flex flex-col justify-center items-center">
      <h2 className="font-bold mb-lg">2. 사용하실 아바타를 선택하세요.</h2>
      <div className="flex flex-col">
        <div className="grid grid-rows-2 grid-flow-col gap-xl mb-xl">
          {avatars.map((avatar, index) => (
            <SelectAvatar
              key={index}
              imageUrl={avatar}
              isSelected={selectedAvatar === avatar}
              onClick={() => setSelectedAvatar(avatar)}
            />
          ))}
          <div className="w-lg h-lg flex items-center justify-center border-3 border-default hover:border-dark-gray hover:bg-light-background" />
        </div>
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
