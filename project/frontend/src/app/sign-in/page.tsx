'use client';

import LinkButton from '@/components/sign-in/LinkButton';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';
import ChooseAvatar from '../../components/sign-in/ChooseAvatar';
import ChooseNickname from '../../components/sign-in/ChooseNickname';
import SelectAvatar from '../../components/sign-in/SelectAvatar';
import { ApiContext } from '../_internal/provider/ApiContext';

const avatars: string[] = [
  'avatar-blue.svg',
  'avatar-black.svg',
  'avatar-big.svg',
  'avatar-small.svg',
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
        <LinkButton onClick={handleSubmitClick}>go to friend</LinkButton>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center">
      {nickname === '' ? getNickname : getAvatar}
    </div>
  );
}
