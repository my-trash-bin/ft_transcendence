'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { Button } from '../common/Button';

type RegisterUserProps = {
  readonly imageUrl: string;
  readonly nickname: string;
};

export default function RegisterUser({
  imageUrl,
  nickname,
}: RegisterUserProps) {
  const { api } = useContext(ApiContext);

  const doRegister = async function () {
    console.log('trying register');
    try {
      await api.authControllerRegister({
        nickname: nickname,
      });
      console.log('go to /friend');
      <Link href="/friend" />;

      // onRegister();
    } catch (err) {
      console.error('Error registering user:', err);
    }
  };

  return (
    <div className="w-xl h-xl bg-light-background border-2 border-dark-purple rounded-lg flex flex-col gap-xl justify-center items-start p-xl">
      <p className="font-semibold text-h3">선택한 닉네임: {nickname}</p>
      <div className="flex flex-row items-center">
        <p className="font-semibold text-h3">선택한 아바타: </p>
        <Image
          src={imageUrl}
          priority={true}
          alt="avatar"
          width={100}
          height={100}
        />
      </div>
      <div className="self-end">
        <Button onClick={doRegister}>가입하기!</Button>
      </div>
    </div>
  );
}
