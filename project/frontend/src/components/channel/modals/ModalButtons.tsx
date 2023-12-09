import { getSocket } from '@/lib/Socket';
import Image from 'next/image';
export function ModalButtons({
  modalStateFunctions,
  authority,
  targetChannelId,
  closeModal,
}: {
  modalStateFunctions: {
    setModalParticipant: () => void;
    setModalSetting: () => void;
    setModalAdd: () => void;
  };
  authority: string;
  targetChannelId: string;
  closeModal: () => void;
}) {
  const exitChannel = () => {
    getSocket().emit('leave', { channelId: targetChannelId });
    closeModal();
  };

  return (
    <div className="flex flex-row justify-between mt-[15px] pr-[30px] pl-[30px]">
      <button onClick={modalStateFunctions.setModalSetting}>
        {authority === 'ADMINISTRATOR' ? (
          <Image
            alt="channel setting button"
            src="/icon/setting.svg"
            width={20}
            height={20}
          />
        ) : (
          ''
        )}
      </button>
      <button onClick={exitChannel}>
        <Image alt="exit button" src="/icon/exit.svg" width={20} height={20} />
      </button>
    </div>
  );
}
