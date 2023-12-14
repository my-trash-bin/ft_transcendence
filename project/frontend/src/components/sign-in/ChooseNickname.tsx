'use client';

import { UniqueCheckResponse } from '@/api/api';
import { useContext, useState } from 'react';
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
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);

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
      if (result.isUnique !== isUnique) {
        if (result.isUnique === true) {
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 2000);
        } else if (result.isUnique === false) {
          setShowFailToast(true);
          setTimeout(() => setShowFailToast(false), 2000);
        }
        setIsUnique(result.isUnique);
      }
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

  const handleButtonClick = async () => {
    if (isValid) {
      await checkUnique();
    }
  };
  const css =
    'absolute right-0 bottom-0 h-[50px] p-sm transform flex justify-center items-center bg-default border-2 border-dark-purple text-dark-purple rounded-md z-50 text-lg';

  return (
    <div className="w-[500px] h-[500px]">
      <div className="w-2xl h-[400px] bg-light-background rounded-lg flex flex-col justify-center items-center">
        <h2 className=" mb-xl">1. 사용하실 닉네임을 입력하세요.</h2>
        {render()}
      </div>
    </div>
  );
  function render() {
    if (isError) {
      return <>알 수 없는 에러입니다.</>;
    } else {
      return (
        <div className="flex flex-col">
          <div className="flex flex-row relative">
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
              {showSuccessToast && (
                <div className={css}>사용 가능한 아이디 입니다.</div>
              )}
              {showFailToast && (
                <div className={css}>
                  이미 사용중인 아이디입니다. 다른 아이디를 선택하세요
                </div>
              )}
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
