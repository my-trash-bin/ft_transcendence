import { useState } from 'react';
import Button from '../common/button';

type ChooseNicknameProps = {
  onNicknameSubmit: (nickname: string) => void;
};

export default function ChooseNickname({
  onNicknameSubmit,
}: ChooseNicknameProps) {
  const [nickname, setNickname] = useState('');

  const handleNicknameSubmit = () => {
    onNicknameSubmit(nickname);
  };

  return (
    <div>
      <h2 className="font-bold">1. 사용하실 닉네님을 입력하세요.</h2>
      <input
        type="text"
        placeholder="Enter your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <Button onClick={() => onNicknameSubmit(nickname)}>Confirm</Button>
      {/* <button onClick={() => onNicknameSubmit(nickname)}>Confirm</button> */}
    </div>
  );
}
