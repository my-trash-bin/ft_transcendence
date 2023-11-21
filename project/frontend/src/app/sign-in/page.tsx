'use client';

import RegisterUser from '@/components/sign-in/RegisterUser';
import { useState } from 'react';
import ChooseAvatar from '../../components/sign-in/ChooseAvatar';
import ChooseNickname from '../../components/sign-in/ChooseNickname';

const avatars: string[] = [
  '/avatar/avatar-blue.svg',
  '/avatar/avatar-black.svg',
  '/avatar/avatar-big.svg',
  '/avatar/avatar-small.svg',
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

  const getNicknameComponent = (
    <ChooseNickname onNicknameSubmit={handleNicknameSubmit} />
  );

  const getAvatarComponent =
    avatar === '' ? (
      <ChooseAvatar avatars={avatars} onChooseClick={handleChooseClick} />
    ) : (
      <RegisterUser imageUrl={avatar} nickname={nickname}></RegisterUser>
    );

  return (
    <div className="min-h-screen flex items-center justify-center">
      {nickname === '' ? getNicknameComponent : getAvatarComponent}
    </div>
  );
}
