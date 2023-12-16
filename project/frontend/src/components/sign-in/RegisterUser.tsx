'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { Button } from '../common/Button';
import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';

type RegisterUserProps = {
  readonly imageUrl: string;
  readonly nickname: string;
};

export default function RegisterUser({
  imageUrl,
  nickname,
}: RegisterUserProps) {
  const { api } = useContext(ApiContext);
  const router = useRouter();

  const handleSubmitClick = useCallback(async () => {
    if (!nickname || !imageUrl) {
      alert('no nickname or image url');
      console.error('no nickname or image url');
      return;
    }
    try {
      await api.authControllerRegister({ nickname, imageUrl });
      router.push('/friend');
    } catch (error: any) {
      error?.error?.message && alert(`${error?.error?.message}`);
      console.error('error', error);
    }
  }, [api, imageUrl, nickname, router]);

  return (
    <div className="w-xl h-xl bg-light-background border-2 border-dark-purple rounded-lg flex flex-col gap-xl justify-center items-start p-xl">
      <p className="font-semibold text-h3">선택한 닉네임: {nickname}</p>
      <div className="flex flex-row items-center">
        <p className="font-semibold text-h3">선택한 아바타: </p>
        <Image
          src={avatarToUrl(imageUrl)}
          priority={true}
          alt="avatar"
          width={100}
          height={100}
        />
      </div>
      <div className="self-end">
        <Button onClick={handleSubmitClick}>가입하기!</Button>
      </div>
    </div>
  );
}
