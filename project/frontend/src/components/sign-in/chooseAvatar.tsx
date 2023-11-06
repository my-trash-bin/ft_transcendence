'use client';

import { useState } from 'react';
import SelectAvatar from './SelectAvatar';
import { classButton } from './classButton';

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
    <div>
      <h2 className="font-bold mb-lg">2. 사용하실 아바타를 선택하세요.</h2>

      <div className="grid grid-rows-2 grid-flow-col gap-xl ml-2xl">
        {avatars.map((avatar, index) => (
          <div key={index} onClick={() => setSelectedAvatar(avatar)}>
            <SelectAvatar
              name={avatar}
              isSelected={selectedAvatar === avatar}
            />
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
