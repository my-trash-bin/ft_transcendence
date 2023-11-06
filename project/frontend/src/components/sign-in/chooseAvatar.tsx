'use client';

import { useState } from 'react';
import Avatar from './avatar';
import { classButton } from './classButton';

type ChooseAvatarProps = {
  avatars: string[];
  onChooseClick: (avatar: string) => void;
};

export default function ChooseAvatar({
  avatars,
  onChooseClick,
}: ChooseAvatarProps) {
  const [selectedAvatar, setAvatar] = useState<string | null>(null);

  return (
    <div>
      <h2 className="font-bold mb-lg">2. 사용하실 아바타를 선택하세요.</h2>

      <div className="grid grid-rows-2 grid-flow-col gap-xl ml-2xl">
        {avatars.map((avatar, index) => (
          <div key={index} onClick={() => setAvatar(avatar)}>
            <Avatar name={avatar} isSelected={selectedAvatar === avatar} />
          </div>
        ))}
        <div className="w-lg h-lg flex items-center justify-center border-3 border-dark-purple bg-light-background" />
      </div>
      <div className="flex flex-row-reverse">
        <button
          onClick={() => {
            if (typeof selectedAvatar === 'string') {
              onChooseClick(selectedAvatar);
            }
          }}
          disabled={!selectedAvatar}
          className={`${classButton(selectedAvatar !== null)} `}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
