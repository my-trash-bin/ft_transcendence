import { Api } from '@/api/api';
import Image from 'next/image';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { ModalButtons } from './ModalButtons';
import { ParticipantCard } from './ParticipantCard';
import { Title } from '@/components/common/Title';

const getRenderedData = (
  data: any,
  myAuthority: string,
  myNickname: string,
  channelId: string,
) => {
  return data.map((p: any) => {
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
    <div className="p-sm">
      <div className="flex flex-row justify-end">
        <Image
          alt="close modal"
          src="/icon/cross-small.svg"
          width={25}
          height={25}
          onClick={closeModal}
        ></Image>
      </div>
      <div className="flex flex-col items-center gap-md">
        <Title>참여자 목록</Title>
        <div className="w-[300px] h-[350px] flex flex-col items-center overflow-y-scroll">
          {renderedData}
        </div>
      </div>
      <ModalButtons
        modalStateFunctions={modalStateFunctions}
        authority={myAuthority}
        targetChannelId={channelId}
        closeModal={closeModal}
      />
    </div>
  );
}
