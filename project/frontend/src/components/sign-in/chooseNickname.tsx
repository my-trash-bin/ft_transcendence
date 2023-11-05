import { useState } from 'react';
import { classButton } from './classButton';

type ChooseNicknameProps = {
  onNicknameSubmit: (nickname: string) => void;
};

export default function ChooseNickname({
  onNicknameSubmit,
}: ChooseNicknameProps) {
  const [nickname, setNickname] = useState('');
  const [isUnique, setIsUnique] = useState(false);

  function isNicknameValid(nickname: string): boolean {
    const nicknameRegex = /^[a-zA-Z0-9\-_]{6,20}$/;
    return nicknameRegex.test(nickname);
  }

  function isNicknameUnique(nickname: string): boolean {
    //ofc I will change this!!!
    return nickname !== '------';
  }

  function handleNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setIsUnique(false);
  }
  return (
    <div>
      <h2 className="font-bold mb-lg">1. 사용하실 닉네임을 입력하세요.</h2>
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
            닉네임은 6-20자 이어야 합니다. <br />
            영문, 숫자, -, _ 중에서 사용하세요.{' '}
          </p>
        </div>
        <div className="flex flex-col">
          <button
            onClick={() => {
              if (isNicknameValid(nickname)) {
                setIsUnique(isNicknameUnique(nickname));
              }
            }}
            className={`${classButton(isNicknameValid(nickname))} mb-[100px]`}
            disabled={!isNicknameValid(nickname)}
          >
            중복확인
          </button>
          <button
            onClick={() => {
              if (isNicknameValid(nickname) && isUnique) {
                onNicknameSubmit(nickname);
              }
            }}
            className={`${classButton(isUnique)}`}
            disabled={!isNicknameValid(nickname) || !isUnique}
          >
            다음으로
          </button>
        </div>
      </div>
    </div>
  );
}
