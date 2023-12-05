import Image from 'next/image';
import { ModalLayout } from './ModalLayout';
import { useCallback, useContext, useState } from 'react';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useRouter } from 'next/navigation';

export function EnterPasswordModal({
  isModalOpen,
  setIsModalOpen,
  targetChannelId,
}: Readonly<{
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  targetChannelId: string;
}>) {
  const { api } = useContext(ApiContext);
  const router = useRouter();
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [password, setPassword] = useState<string>('');

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  const participateChannel = useCallback(async () => {
    try {
      await api.channelControllerParticipateChannel({
        type: 'protected',
        channelId: targetChannelId,
        password: password,
      });
      console.log('Participate channel successfully');
      router.push(`/channel/${targetChannelId}`);
    } catch (error) {
      console.error('Error participate channel:', error);
    }
  }, [api, targetChannelId, password, router]);

  return (
    <ModalLayout
      isOpen={isModalOpen}
      closeModal={closeModal}
      width="300px"
      height="230px"
    >
      <div className="flex flex-col h-[230px]">
        <button onClick={closeModal} className="self-end">
          <Image
            alt="close modal"
            src="/icon/cross-small.svg"
            width={25}
            height={25}
          ></Image>
        </button>
        <form className="flex flex-col items-center">
          <p className="mb-[15px] mt-[20px]">비밀번호 입력</p>
          <input
            autoComplete="off"
            type="password"
            placeholder="비밀번호를 입력하세요."
            onChange={handlePassword}
            className="pl-[10px] rounded-sm outline-none placeholder:text-[12px] placeholder:text-center w-[200px]"
          ></input>
          <button
            type="button"
            className="mt-[30px] pl-[20px] pr-[20px] w-[200px] h-[35px] bg-dark-purple rounded-md text-white"
            onClick={participateChannel}
          >
            확인
          </button>
        </form>
      </div>
    </ModalLayout>
  );
}
