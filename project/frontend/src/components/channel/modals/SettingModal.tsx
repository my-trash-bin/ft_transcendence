'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChannelButton } from '../ChannelButton';
import { inputValidator } from './InputValidator';

export function SettingModal({
  closeModal,
  modalStateFunctions,
}: {
  closeModal: () => void;
  modalStateFunctions: {
    setModalParticipant: () => void;
    setModalSetting: () => void;
    setModalAdd: () => void;
  };
}) {
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  const validText = 'text-[12px] mt-[5px]';
  const invalidText = 'text-[12px] mt-[5px] text-red-400';
  return (
    <>
      <div className="flex flex-row justify-between pt-[10px] pl-[10px] pr-[10px]">
        <button onClick={modalStateFunctions.setModalParticipant}>
          <Image alt="return" src="/icon/return.svg" width={20} height={20} />
        </button>
        <button onClick={closeModal}>
          <Image
            alt="close modal"
            src="/icon/cross-small.svg"
            width={25}
            height={25}
          />
        </button>
      </div>
      <div className="h-[400px] flex flex-col justify-center items-center">
        <p className="mb-[15px]">비밀번호 설정</p>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={(e) => {
            setPasswordValid(inputValidator('password', e.target.value));
            setPassword(e.target.value);
          }}
          className="pl-[10px] rounded-sm outline-none placeholder:text-[12px] placeholder:text-center"
        />
        <p className={passwordValid ? validText : invalidText}>
          비밀번호는 숫자 6자리로 입력해 주세요.
        </p>
        <div className="mt-[30px] pl-[20px] pr-[20px] w-[200px] flex flex-row justify-between">
          <ChannelButton
            text="적용"
            width="60px"
            height="35px"
            onClick={closeModal}
            disable={!passwordValid}
          />
          <ChannelButton
            text="취소"
            width="60px"
            height="35px"
            onClick={closeModal}
          />
        </div>
      </div>
    </>
  );
}
