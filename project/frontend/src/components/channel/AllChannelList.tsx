import { useQuery } from 'react-query';
import Portal from '../common/Portal';
import { AllChannelCard } from './AllChannelCard';
import { EnterPasswordModal } from './modals/EnterPasswordModal';
import { ParticipationModal } from './modals/ParticipationModal';
import { useCallback, useContext, useState } from 'react';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { unwrap } from '@/api/unwrap';

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
  const { api } = useContext(ApiContext);

  const { isLoading, isError, data } = useQuery(
    'allChannels',
    useCallback(
      async () => unwrap(await api.channelControllerFindAll()),
      [api],
    ),
  );

  if (isLoading) return <p>로딩중...</p>;
  if (isError || !data) return <p>알 수 없는 에러</p>;

  let renderData = getRenderData(
    data,
    setPasswordModalOpen,
    setParticipationModalOpen,
    setSelectedChannelId,
    setSelectedChannelType,
    searchChannel,
  );

  return (
    <>
      <Portal selector={'#backdrop-root'}>
        <EnterPasswordModal
          isModalOpen={isPasswordModalOpen}
          setIsModalOpen={setPasswordModalOpen}
          targetChannelId={selectedChannelId}
        />
      </Portal>
      <Portal selector={'#backdrop-root'}>
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
