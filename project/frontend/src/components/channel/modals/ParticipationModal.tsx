import Image from 'next/image';
import { ModalLayout } from './ModalLayout';
import { useCallback, useContext } from 'react';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useRouter } from 'next/navigation';

export function ParticipationModal({
  isModalOpen,
  setIsModalOpen,
  targetChannelId,
  targetChannelType,
}: Readonly<{
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  targetChannelId: string;
  targetChannelType: string;
}>) {
  const { api } = useContext(ApiContext);
  const router = useRouter();
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const participateChannel = useCallback(async () => {
    try {
      await api.channelControllerParticipateChannel({
        type: targetChannelType === 'public' ? 'public' : 'protected',
        channelId: targetChannelId,
      });
      console.log('Participate channel successfully');
      router.push(`/channel/${targetChannelId}`);
    } catch (error) {
      console.error('Error participate channel:', error);
    }
  }, [api, targetChannelId, targetChannelType, router]);

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
          ></Image>
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
