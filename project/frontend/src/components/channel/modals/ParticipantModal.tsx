import Image from 'next/image';
import { ModalButtons } from './ModalButtons';
import { ParticipantCard } from './ParticipantCard';

const par = [
  {
    nickname: 'nameaaaaaaaaaaa',
    imageUri: '/avatar/avatar-small.svg',
  },
  {
    nickname: 'name2',
    imageUri: '/avatar/avatar-small.svg',
  },
  {
    nickname: 'name3',
    imageUri: '/avatar/avatar-small.svg',
  },
  {
    nickname: 'name4',
    imageUri: '/avatar/avatar-small.svg',
  },
  {
    nickname: 'name5',
    imageUri: '/avatar/avatar-small.svg',
  },
  {
    nickname: 'name6',
    imageUri: '/avatar/avatar-small.svg',
  },
  {
    nickname: 'name7',
    imageUri: '/avatar/avatar-small.svg',
  },
  {
    nickname: 'name8',
    imageUri: '/avatar/avatar-small.svg',
  },
];

export function ParticipantModal({
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
  return (
    <>
      <div className="flex flex-row justify-end pt-[10px] pr-[10px]">
        <button onClick={closeModal}>
          <Image
            alt="close modal"
            src="/icon/cross-small.svg"
            width={25}
            height={25}
          ></Image>
        </button>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-center mb-[10px]">참여자 목록</h3>
        <div className="w-[300px] h-[380px] flex flex-col items-center overflow-y-scroll">
          {par.map((p) => (
            <ParticipantCard
              key={p.nickname}
              nickname={p.nickname}
              imageUrl={p.imageUri}
              type="ADMIN"
            />
          ))}
        </div>
      </div>
      <ModalButtons modalStateFunctions={modalStateFunctions} />
    </>
  );
}
