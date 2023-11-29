import Image from 'next/image';
import { ModalLayout } from './ModalLayout';

export function ParticipationModal({
  isModalOpen,
  setIsModalOpen,
  targetChannelId,
}: Readonly<{
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  targetChannelId: string;
}>) {
  const closeModal = () => {
    setIsModalOpen(false);
  };

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
          >
            확인
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}
