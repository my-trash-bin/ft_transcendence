import { Api } from '@/api/api';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import Portal from '../common/Portal';
import { AllChannelCard } from './AllChannelCard';
import { EnterPasswordModal } from './modals/EnterPasswordModal';
import { ParticipationModal } from './modals/ParticipationModal';

function getRenderData(
  channelData: any,
  setPasswordModalOpen: (isModalOpen: boolean) => void,
  setParticipationModalOpen: (isModalOpen: boolean) => void,
  setSelectedChannelId: (channelId: string) => void,
  setSelectedChannelType: (channelType: string) => void,
  searchChannel: string,
) {
  const filteredData = channelData.filter((channel: any) =>
    channel.title.includes(searchChannel),
  );
  return filteredData.map((channel: any) => {
    return (
      <AllChannelCard
        key={channel.id}
        id={channel.id}
        channelName={channel.title}
        now={channel.memberCount}
        max={channel.maximumMemberCount}
        isPublic={channel.isPublic}
        participateModalOpen={setParticipationModalOpen}
        passwordModalOpen={setPasswordModalOpen}
        setSelectedChannelId={setSelectedChannelId}
        setSelectedChannelType={setSelectedChannelType}
      />
    );
  });
}

export function AllChannelList({ searchChannel }: { searchChannel: string }) {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [isParticipationModalOpen, setParticipationModalOpen] =
    useState<boolean>(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');
  const [selectedChannelType, setSelectedChannelType] = useState<string>('');
  const apiCall = useCallback(
    () => new Api().api.channelControllerFindAll(),
    [],
  );

  const { isLoading, data } = useQuery('allChannels', apiCall);

  if (isLoading) return <p>로딩중...</p>;

  let renderData = getRenderData(
    data?.data,
    setPasswordModalOpen,
    setParticipationModalOpen,
    setSelectedChannelId,
    setSelectedChannelType,
    searchChannel,
  );

  return (
    <>
      <Portal selector={'#modal-channel'}>
        <EnterPasswordModal
          isModalOpen={isPasswordModalOpen}
          setIsModalOpen={setPasswordModalOpen}
          targetChannelId={selectedChannelId}
        />
      </Portal>
      <Portal selector={'#modal-channel'}>
        <ParticipationModal
          isModalOpen={isParticipationModalOpen}
          setIsModalOpen={setParticipationModalOpen}
          targetChannelId={selectedChannelId}
          targetChannelType={selectedChannelType}
        />
      </Portal>

      <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
        {renderData}
      </div>
    </>
  );
}
