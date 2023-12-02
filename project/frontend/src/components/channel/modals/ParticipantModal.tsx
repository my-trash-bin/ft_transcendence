import { Api } from '@/api/api';
import Image from 'next/image';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { ModalButtons } from './ModalButtons';
import { ParticipantCard } from './ParticipantCard';

const getRenderedData = (
  data: any,
  myAuthority: string,
  myNickname: string,
  channelId: string,
) => {
  return data.map((p) => {
    return (
      <ParticipantCard
        key={p.member.id}
        nickname={p.member.nickname}
        imageUrl={p.member.profileImageUrl}
        type={myAuthority}
        isMyself={p.member.nickname === myNickname}
        channelId={channelId}
        memberId={p.member.id}
      />
    );
  });
};

export function ParticipantModal({
  closeModal,
  modalStateFunctions,
  channelId,
  myAuthority,
  myNickname,
}: {
  closeModal: () => void;
  modalStateFunctions: {
    setModalParticipant: () => void;
    setModalSetting: () => void;
    setModalAdd: () => void;
  };
  channelId: string;
  myAuthority: string;
  myNickname: any;
}) {
  const apiCall = useCallback(
    () =>
      new Api().api.channelControllerFindChannelMembersByChannelId(channelId),
    [channelId],
  );
  const { isLoading, isError, data } = useQuery('channelMembers', apiCall);

  if (isLoading) return <div>Loading...</div>;
  if (isError) throw new Error('Error fetching data');

  const renderedData = getRenderedData(
    data?.data,
    myAuthority,
    myNickname,
    channelId,
  );

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
