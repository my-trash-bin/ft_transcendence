'use client';

import RegisterUser from '@/components/sign-in/RegisterUser';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';
import ChooseAvatar from '../../components/sign-in/ChooseAvatar';
import ChooseNickname from '../../components/sign-in/ChooseNickname';
import { ApiContext } from '../_internal/provider/ApiContext';

const avatars: string[] = [
  '/avatar/avatar-blue.svg',
  '/avatar/avatar-black.svg',
  '/avatar/avatar-big.svg',
  '/avatar/avatar-small.svg',
];

export default function SignIn() {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const { api } = useContext(ApiContext);
  const router = useRouter();

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

  const handleSubmitClick = useCallback(() => {
    if (!nickname || !avatar) {
      alert('// TODO: 닉네임이나 아바타 설정 안 했을 때 에러 메시지 좀 예쁘게');
      return;
    }
    (async () => {
      const result = await api.authControllerRegister({
        nickname,
        imageUrl: `/avatar/${avatar}`,
      });
      if (!result.ok) {
        console.error({ result });
        alert('// TODO: 뭔가 좀 잘못 됐을 때 에러 메시지 좀 예쁘게');
      }
      router.push('/friend');
    })();
  }, [api, nickname, avatar, router]);

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
