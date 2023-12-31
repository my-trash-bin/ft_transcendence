import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { ChannelButton } from '../ChannelButton';
import { ChannelCreateContent } from './ChannelCreateContent';
import { ChannelSelector } from './ChannelSelector';
import { ModalLayout } from './ModalLayout';

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
}

export function CreateChannelModal({
  isOpen,
  closeModal,
  setShowSuccessToast,
  setShowFailToast,
}: {
  isOpen: boolean;
  closeModal: () => void;
  setShowSuccessToast: (set: boolean) => void;
  setShowFailToast: (set: boolean) => void;
}) {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC);
  const [isValid, setIsValid] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputSize, setInputSize] = useState(2);
  const { api } = useContext(ApiContext);

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
  const closeAndChangeTypePublic = () => {
    setChannelType(ChannelType.PUBLIC);
    closeModal();
  };
  const mutation = useMutation(api.channelControllerCreate, {
    onSuccess: () => {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 2000);
      closeAndChangeTypePublic();
    },
    onError: () => {
      setShowFailToast(true);
      setTimeout(() => setShowFailToast(false), 2000);
    },
  });

  const sendCreateChannel = () => {
    const channelCreateData =
      channelType === ChannelType.PROTECTED
        ? {
            title: inputTitle,
            type: channelType,
            capacity: inputSize,
            password: inputPassword,
          }
        : {
            title: inputTitle,
            type: channelType,
            capacity: inputSize,
          };
    mutation.mutate(channelCreateData);
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={closeAndChangeTypePublic}
      width="500px"
      height="400px"
    >
      <h2 className="text-[25px] mt-[20px] text-center text-dark-purple font-taebaek">
        채널 생성
      </h2>
      <form className="w-[inherit] h-[inherit] pt-[30px] pl-[30px] rounded-sm flex flex-col ">
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
              isRow={true}
            />
            <ChannelCreateContent
              channelType={channelType}
              setIsValid={setIsValid}
              inputTitle={inputTitle}
              setInputTitle={setInputTitle}
              inputPassword={inputPassword}
              setInputPassword={setInputPassword}
              inputSize={inputSize}
              setInputSize={setInputSize}
            />
          </div>
        </div>
        <div className="mt-[20px] flex justify-around pr-[80px] pl-[50px]">
          <ChannelButton
            onClick={sendCreateChannel}
            text="생성"
            width="60px"
            height="30px"
            disable={!isValid}
          />
          <ChannelButton
            onClick={closeAndChangeTypePublic}
            text="취소"
            width="60px"
            height="30px"
          />
        </div>
      </form>
    </ModalLayout>
  );
}
