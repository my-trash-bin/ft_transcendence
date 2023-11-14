'use client';

import LinkButton from '@/components/sign-in/LinkButton';
import { useState } from 'react';
import ChooseAvatar from '../../components/sign-in/ChooseAvatar';
import ChooseNickname from '../../components/sign-in/ChooseNickname';
import SelectAvatar from '../../components/sign-in/SelectAvatar';

const avatars: string[] = [
  'avatar-blue.svg',
  'avatar-black.svg',
  'avatar-big.svg',
  'avatar-small.svg',
];

export default function SignIn() {
  const [nickname, setNickname] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');

  const handleNicknameSubmit = (newNickname: string) => {
    setNickname(newNickname);
  };

  const handleChooseClick = (selectedAvatar: string) => {
    setAvatar(selectedAvatar);
  };

  const getNickname = (
    <ChooseNickname onNicknameSubmit={handleNicknameSubmit} />
  );

  const getAvatar =
    avatar === '' ? (
      <ChooseAvatar avatars={avatars} onChooseClick={handleChooseClick} />
    ) : (
      <div>
        {nickname}
        <SelectAvatar name={avatar} isSelected={true} />
        <LinkButton text="go to friend" href="/friend" />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center">
      {nickname === '' ? getNickname : getAvatar}
    </div>
  );
}
