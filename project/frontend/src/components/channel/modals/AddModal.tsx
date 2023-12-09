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
    nickname: 'name3',
    imageUri: '/avatar/avatar-small.svg',
  },
  {
    nickname: 'name21',
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
          <Image alt="return" src="/icon/return.svg" width={20} height={20} />
        </button>
        <button onClick={closeModal}>
          <Image
            alt="close modal"
            src="/icon/cross-small.svg"
            width={25}
            height={25}
          />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-center mb-[10px]">유저 검색</h3>
        <MessageSearchInput
          width="280px"
          height="30px"
          placeholder="search user.."
          eventFunction={(searchInput) =>
            alert(`// TODO: searchInput: ${searchInput}`)
          }
        />
        <div className="w-[300px] h-[380px] mt-[15px] flex flex-col items-center overflow-y-scroll">
          {par.map((p) => (
            <ParticipantCard
              key={p.nickname}
              nickname={p.nickname}
              imageUrl={p.imageUri}
              type="ADD"
              // TODO: 빠진 프로퍼티 채우기. 일단 타입 에러 때문에 임의로 아무거나 넣었습니다
              channelId="0x42"
              memberId="0x42"
              isMyself={false}
            />
          ))}
        </div>
      </div>
    </>
  );
}
