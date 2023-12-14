'use client';

import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { Title } from '@/components/common/Title';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { ChannelButton } from '../ChannelButton';
import { ChannelSelector } from './ChannelSelector';
import { inputValidator } from './InputValidator';
import useToast from '@/components/common/useToast';

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
}

export function SettingModal({
  channelId,
  closeModal,
  modalStateFunctions,
}: {
  channelId: string;
  closeModal: () => void;
  modalStateFunctions: {
    setModalParticipant: () => void;
    setModalSetting: () => void;
    setModalAdd: () => void;
  };
}) {
  const { api } = useContext(ApiContext);
  const [password, setPassword] = useState('');
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC);
  const [passwordValid, setPasswordValid] = useState(
    channelType !== ChannelType.PROTECTED,
  );
  const { openSuccessChangeChannnal, openFailChangeChannnal } = useToast();

  const channelTypeChangeEvent = (channelType: ChannelType) => {
    switch (channelType) {
      case ChannelType.PUBLIC:
        setChannelType(ChannelType.PUBLIC);
        break;
      case ChannelType.PRIVATE:
        setChannelType(ChannelType.PRIVATE);
        break;
      case ChannelType.PROTECTED:
        setChannelType(ChannelType.PROTECTED);
        break;
    }
  };

  useEffect(() => {
    setPasswordValid(channelType !== ChannelType.PROTECTED);
  }, [channelType]);

  const mutation = useMutation(api.channelControllerChannelUpdate, {
    onSuccess: () => {
      closeModal();
      openSuccessChangeChannnal();
    },
    onError: () => {
      openFailChangeChannnal();
    },
  });

  function updateChannel() {
    const channelUpdateData =
      channelType === ChannelType.PROTECTED
        ? {
            channelId: channelId,
            type: channelType,
            password: password,
          }
        : {
            channelId: channelId,
            type: channelType,
          };
    mutation.mutate(channelUpdateData);
  }
  const validText = 'text-[12px] mt-[5px] text-dark-gray';
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
      <div className="flex flex-col justify-center items-center">
        <Title>채널 설정 변경</Title>
        <div className="h-[300px] flex flex-col justify-center gap-md p-md">
          <div className="flex flex-row pl-lg">
            <p className="">채널 타입 변경:</p>
            <ChannelSelector
              channelType={channelType}
              channelTypeChangeEvent={channelTypeChangeEvent}
              isRow={false}
            />
          </div>

          <div className="flex flex-row gap-sm">
            <p className="pl-lg">비밀번호 설정:</p>
            <div className="flex flex-col">
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                disabled={channelType !== ChannelType.PROTECTED}
                onChange={(e) => {
                  setPasswordValid(inputValidator('password', e.target.value));
                  setPassword(e.target.value);
                }}
                className="pl-[10px] rounded-sm outline-none placeholder:text-[12px] placeholder:text-center w-[150px]"
              ></input>
              <p className={passwordValid ? validText : invalidText}>
                숫자 6자리로 입력해 주세요.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-[30px] pl-[20px] pr-[20px] w-[200px] flex flex-row justify-between">
          <ChannelButton
            text="적용"
            width="60px"
            height="35px"
            onClick={updateChannel}
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
