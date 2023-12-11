'use client';

import { UniqueCheckResponse } from '@/api/api';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { Button } from '../common/Button';

type ChooseNicknameProps = {
  readonly onNicknameSubmit: (nickname: string) => void;
};

export default function ChooseNickname({
  onNicknameSubmit,
}: ChooseNicknameProps) {
  const [nickname, setNickname] = useState('');
  const [isUnique, setIsUnique] = useState<boolean | undefined>(undefined);
  const [isValid, setIsValid] = useState(false);
  const { api } = useContext(ApiContext);
  const [isError, setIsError] = useState(false);

  function isNicknameValid(nickname: string): boolean {
    const nicknameRegex = /^[a-zA-Z0-9\-_]{6,12}$/;
    return nicknameRegex.test(nickname);
  }

  const checkUnique = async function () {
    try {
      const response = await api.usersControllerCheckNickname({
        nickname: nickname,
      });
      const result: UniqueCheckResponse = response.data;
      setIsUnique(result.isUnique);
    } catch (error: any) {
      setIsError(true);
      console.error('Error during unique check:', error);
    }
  };

  function handleNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setIsUnique(undefined);
    setIsValid(isNicknameValid(newNickname));
  }

  function showUnique(unique: boolean | undefined): void {
    if (unique !== isUnique) {
      setIsUnique(unique);

      if (unique === true) {
        toast.success('Nickname is unique!');
      } else if (unique === false) {
        toast.error('Nickname is not unique!');
      }
    }
  }

  const handleButtonClick = async () => {
    if (isValid) {
      await checkUnique();
      showUnique(isUnique);
    }
  };

  return (
    <div className="w-2xl h-[400px] bg-light-background rounded-lg flex flex-col justify-center items-center">
      <h2 className=" mb-xl">1. 사용하실 닉네임을 입력하세요.</h2>
      {render()}
    </div>
  );
  function render() {
    if (isError) {
      return <>알 수 없는 에러입니다.</>;
    } else {
      return (
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="닉네임을 입력하세요."
                value={nickname}
                onChange={handleNicknameChange}
                className="ml-md mr-md border-2 border-gray p-[2px]"
              />
              <p className="text-sm text-dark-gray ml-md mt-md">
                닉네임은 6-12자 이어야 합니다. <br />
                영문, 숫자, -, _ 중에서 사용하세요.{' '}
              </p>
            </div>
            <Button onClick={handleButtonClick} disabled={!isValid}>
              중복확인
            </Button>
          </div>
          <div className="self-end mt-xl">
            <Button
              onClick={() => {
                if (isValid && isUnique) {
                  onNicknameSubmit(nickname);
                }
              }}
              disabled={!isValid || !isUnique}
            >
              다음으로
            </Button>
          </div>
        </div>
      );
    }
  }
}
