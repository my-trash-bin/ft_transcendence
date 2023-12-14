import { ApiContext } from '@/app/_internal/provider/ApiContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { ModalLayout } from './ModalLayout';
import useToast from '@/components/common/useToast';

export function ParticipationModal({
  isModalOpen,
  setIsModalOpen,
  targetChannelId,
  targetChannelType,
  setMyChannel,
}: Readonly<{
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  targetChannelId: string;
  targetChannelType: string;
  setMyChannel: (myChannel: boolean) => void;
}>) {
  const { api } = useContext(ApiContext);
  const router = useRouter();
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const { openIsBan, openIsFull } = useToast();

  const participateChannel = useCallback(async () => {
    try {
      await api.channelControllerParticipateChannel({
        type: targetChannelType === 'public' ? 'public' : 'protected',
        channelId: targetChannelId,
      });

      setIsModalOpen(false);
      router.push(`/channel/${targetChannelId}`);
      setMyChannel(true);
    } catch (error: any) {
      if (error?.error.message === '밴된 유저는 채널에 들어갈 수 없습니다.') {
        openIsBan();
        setIsModalOpen(false);
      } else if (error?.error.message === '최대 사용자 수 초과') {
        openIsFull();
        setIsModalOpen(false);
      }
    }
  }, [
    api,
    targetChannelId,
    targetChannelType,
    router,
    setIsModalOpen,
    setMyChannel,
    openIsBan,
    openIsFull,
  ]);

  return (
    <ModalLayout
      isOpen={isModalOpen}
      closeModal={closeModal}
      width="300px"
      height="170px"
    >
      <div className="flex flex-col h-[170px]">
        <button onClick={closeModal} className="self-end">
          <Image
            alt="close modal"
            src="/icon/cross-small.svg"
            width={25}
            height={25}
          />
        </button>
        <div className="flex flex-col items-center">
          <p className="mb-[15px] mt-[20px]">참여하시겠습니까?</p>
          <button
            type="button"
            className="mt-[30px] pl-[20px] pr-[20px] w-[200px] h-[35px] bg-dark-purple rounded-md text-white"
            onClick={participateChannel}
          >
            확인
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}
