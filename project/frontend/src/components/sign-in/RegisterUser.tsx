'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';
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
  const router = useRouter();
  const [formData, setFormData] = useState(new FormData());

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const newFormData = new FormData();
        newFormData.append('file', file);
        setFormData(newFormData);
      }
    },
    [],
  );

  const handleSubmitClick = useCallback(async () => {
    if (!nickname || !formData) {
      alert('// TODO: 닉네임이나 아바타 설정 안 했을 때 에러 메시지 좀 예쁘게');
      return;
    }
    formData.append('nickname', nickname);
    console.log(formData);
    try {
      const result = await api.authControllerRegister(formData);
      if (!result.ok) {
        console.error({ result });
        alert('// TODO: 뭔가 좀 잘못 됐을 때 에러 메시지 좀 예쁘게');
      } else {
        router.push('/friend');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }, [api, formData, nickname, router, imageUrl]);

  return (
    <form
      className="w-xl h-xl bg-light-background border-2 border-dark-purple rounded-lg flex flex-col gap-xl justify-center items-start p-xl"
      encType="multipart/form-data"
    >
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
        <Button onClick={handleSubmitClick}>가입하기!</Button>
      </div>
    </form>
  );
}
