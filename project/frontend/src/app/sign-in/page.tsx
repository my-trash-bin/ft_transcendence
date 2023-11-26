'use client';

import RegisterUser from '@/components/sign-in/RegisterUser';
import { useCallback, useState } from 'react';
import ChooseAvatar from '../../components/sign-in/ChooseAvatar';
import ChooseNickname from '../../components/sign-in/ChooseNickname';

const avatars: string[] = [
  '/avatar/avatar-blue.svg',
  '/avatar/avatar-black.svg',
  '/avatar/avatar-big.svg',
  '/avatar/avatar-small.svg',
];

export default function SignIn() {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleNicknameSubmit = useCallback(
    (newNickname: string) => {
      setNickname(newNickname);
    },
    [setNickname],
  );

  const handleChooseClick = useCallback(
    (selectedAvatar: string) => {
      setAvatar(selectedAvatar);
    },
    [setAvatar],
  );

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
