'use client';

import { useState } from 'react';
import Avatar from './avatar';

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
      <h2>Step 2: Choose an Avatar</h2>

      <div className="avatar-options">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`avatar-option ${
              selectedAvatar === avatar ? 'selected' : ''
            }`}
            onClick={() => setAvatar(avatar)}
          >
            <Avatar name={avatar} isSelected={selectedAvatar === avatar} />
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          if (typeof selectedAvatar === 'string') {
            onChooseClick(selectedAvatar);
          }
        }}
        disabled={!selectedAvatar}
        className={`text-blue-600 py-2 px-4 rounded ${
          selectedAvatar
            ? 'bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold'
            : 'bg-gray-300 cursor-not-allowed text-gray-500'
        }`}
      >
        Click Me
      </button>
    </div>
  );
}
