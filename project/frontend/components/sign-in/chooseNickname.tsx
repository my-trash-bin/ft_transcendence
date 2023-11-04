import { useState } from 'react';

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
      <h2>Step 1: Choose a Nickname</h2>
      <input
        type="text"
        placeholder="Enter your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button className="bg-example text-h1" onClick={handleNicknameSubmit}>
        Confirm
      </button>
    </div>
  );
}
