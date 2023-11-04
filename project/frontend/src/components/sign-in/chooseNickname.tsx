import { useState } from 'react';
import Button from '../common/button';

type ChooseNicknameProps = {
  onNicknameSubmit: (nickname: string) => void;
};

export default function ChooseNickname({
  onNicknameSubmit,
}: ChooseNicknameProps) {
  const [nickname, setNickname] = useState('');

  return (
    <div>
      <h2 className="font-bold mb-lg">1. 사용하실 닉네임을 입력하세요.</h2>
      <input
        type="text"
        placeholder="닉네임을 입력하세요."
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="ml-md mr-md border-2 border-gray p-xs"
      />
      <Button onClick={() => onNicknameSubmit(nickname)}>다음으로</Button>
      <p className="text-sm text-dark-gray ml-md mt-md">
        닉네임은 6-20자 이어야 합니다. <br />
        영문, 숫자, -, _ 중에서 사용하세요.{' '}
      </p>
    </div>
  );
}
