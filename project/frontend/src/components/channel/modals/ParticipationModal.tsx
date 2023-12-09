import { ApiContext } from '@/app/_internal/provider/ApiContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { ModalLayout } from './ModalLayout';

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
      console.log('Participate channel');
      await api.channelControllerParticipateChannel({
        type: targetChannelType === 'public' ? 'public' : 'protected',
        channelId: targetChannelId,
      });
      console.log('Participate channel successfully');
      setIsModalOpen(false);
      router.push(`/channel/${targetChannelId}`);
    } catch (error: any) {
      console.error('Error participate channel:', error);
      if (error?.error.message === '밴된 유저는 채널에 들어갈 수 없습니다.') {
        alert('해당 채널에서 BEN된 유저입니다.');
        setIsModalOpen(false);
      }
    }
  }, [api, targetChannelId, targetChannelType, router, setIsModalOpen]);

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
