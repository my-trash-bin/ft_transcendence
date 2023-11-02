'use client';

import { useState } from 'react';
import ChooseAvatar from '../../../components/sign-in/chooseAvatar';
import ChooseNickname from '../../../components/sign-in/chooseNickname';

const avatars: string[] = [
  'avatar-blue.svg',
  'avatar-black.svg',
  'avatar-big.svg',
  'avatar-small.svg',
];

export default function SignIn() {
  const [nickname, setNickname] = useState<string>('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleNicknameSubmit = (newNickname: string) => {
    setNickname(newNickname);
  };

  const handleAvatarSelect = (avatar: string) => {
    setAvatar(avatar);
  };

  const handleChooseClick = () => {
    // Handle the logic when the "Choose" button is clicked
    // You can, for example, proceed to the next step or perform other actions.
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {nickname === '' ? (
        <ChooseNickname onNicknameSubmit={handleNicknameSubmit} />
      ) : (
        <>
          <div>{`Nickname: ${nickname}`}</div>
          <ChooseAvatar
            avatars={avatars}
            selectedAvatar={avatar}
            onAvatarSelect={handleAvatarSelect}
            onChooseClick={handleChooseClick} // Pass the onChooseClick function
          />
        </>
      )}
    </div>
  );
}
