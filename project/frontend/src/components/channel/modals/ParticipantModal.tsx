import { Api, ChannelMemberDto } from '@/api/api';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ModalButtons } from './ModalButtons';
import { ParticipantCard } from './ParticipantCard';

const getRenderedData = (
  data: ChannelMemberDto[] | undefined,
  setMyAuthority: React.Dispatch<React.SetStateAction<string>>,
  myAuthority: string,
) => {
  if (data === undefined) return;
  const me: string | null = localStorage.getItem('me');
  const myNickname = me ? JSON.parse(me).nickname : '';
  return data.map((p) => {
    if (p.member.nickname === myNickname && myAuthority === '') {
      setMyAuthority(p.memberType);
    }
    return (
      <ParticipantCard
        key={p.member.id}
        nickname={p.member.nickname}
        imageUrl={p.member.profileImageUrl}
        type={myAuthority}
        isMyself={p.member.nickname === myNickname}
      />
    );
  });
};

export function ParticipantModal({
  closeModal,
  modalStateFunctions,
  channelId,
}: {
  closeModal: () => void;
  modalStateFunctions: {
    setModalParticipant: () => void;
    setModalSetting: () => void;
    setModalAdd: () => void;
  };
  channelId: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [fetchData, setFetchData] = useState<ChannelMemberDto[]>();
  const [myAuthority, setMyAuthority] = useState<string>('');

  useEffect(() => {
    async function getChannelParticipant() {
      try {
        const res =
          await new Api().api.channelControllerFindChannelMembersByChannelId(
            channelId,
          );
        setFetchData(res.data);
        setIsLoading(false);
      } catch (e) {
        setIsError(true);
      }
    }
    getChannelParticipant();
  }, [channelId]);
  if (isLoading) return <div>로딩중 ... </div>;
  if (isError) return <div>데이터를 가져오는데 실패했습니다 ...☠️ </div>;

  const renderedData = getRenderedData(fetchData, setMyAuthority, myAuthority);

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
          {renderedData}
        </div>
      </div>
      <ModalButtons
        modalStateFunctions={modalStateFunctions}
        authority={myAuthority}
        targetChannelId={channelId}
        closeModal={closeModal}
      />
    </>
  );
}
