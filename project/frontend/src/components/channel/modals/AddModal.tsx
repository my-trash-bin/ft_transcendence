import { MessageSearchInput } from '@/components/dm/message-search/MessageSearchInput';
import Image from 'next/image';
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
    nickname: 'name2',
    imageUri: '/avatar/avatar-small.svg',
  },
  {
    nickname: 'name2',
    imageUri: '/avatar/avatar-small.svg',
  },
];

export function AddModal({
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
      <div className="flex flex-row justify-between pt-[10px] pl-[10px] pr-[10px]">
        <button onClick={modalStateFunctions.setModalParticipant}>
          <Image
            alt="return"
            src="/icon/return.svg"
            width={20}
            height={20}
          ></Image>
        </button>
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
        <h3 className="text-center mb-[10px]">유저 검색</h3>
        <MessageSearchInput width="250px" height="30px" />
        <div className="w-[300px] h-[380px] mt-[15px] flex flex-col items-center overflow-y-scroll">
          {par.map((p) => (
            <ParticipantCard
              key={p.nickname}
              nickname={p.nickname}
              imageUrl={p.imageUri}
              type="ADD"
            />
          ))}
        </div>
      </div>
    </>
  );
}
