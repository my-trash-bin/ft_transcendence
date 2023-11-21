'use client';

import Image from 'next/image';
import { Button } from '../common/Button';
type RegisterUserProps = {
  readonly imageUrl: string;
  readonly nickname: string;
};

export default function RegisterUser({
  imageUrl,
  nickname,
}: RegisterUserProps) {
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
        <Button onClick={() => {}}>가입하기!</Button>
      </div>
    </div>
  );
}
