import { useState } from 'react';
import { ChannelButton } from '../ChannelButton';
import { ChannelCreateContent } from './ChannelCreateContent';
import { ChannelSelector } from './ChannelSelector';
import { ModalLayout } from './ModalLayout';

export enum ChannelType {
  PUBLIC,
  PRIVATE,
  PROTECTED,
}

export function CreateChannelModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC);
  const [isValid, setIsValid] = useState(false);
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

  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={closeModal}
      width="500px"
      height="400px"
    >
      <h2 className="text-[25px] mt-[20px] text-center">채널 생성</h2>
      <form className="w-[inherit] h-[inherit] pt-[30px] pl-[30px] rounded-sm flex flex-col">
        <div className="flex">
          <div>
            <h3 className="mb-[25px]">채널 타입 : </h3>
            <h3 className="mb-[35px]">채널 제목 : </h3>
            <h3 className="mb-[35px]">비밀번호 : </h3>
            <h3 className="mb-[25px]">최대 인원 : </h3>
          </div>
          <div>
            <ChannelSelector
              channelType={channelType}
              channelTypeChangeEvent={channelTypeChangeEvent}
            />
            <ChannelCreateContent
              channelType={channelType}
              isValid={isValid}
              setIsValid={setIsValid}
            />
          </div>
        </div>
        <div className="mt-[20px] flex justify-around pr-[80px] pl-[50px]">
          <ChannelButton
            onClick={closeModal}
            text="생성"
            width="60px"
            height="30px"
            disable={!isValid}
          ></ChannelButton>
          <ChannelButton
            onClick={closeModal}
            text="취소"
            width="60px"
            height="30px"
          ></ChannelButton>
        </div>
      </form>
    </ModalLayout>
  );
}