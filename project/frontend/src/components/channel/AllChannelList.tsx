import { Api } from '@/api/api';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import Portal from '../common/Portal';
import { AllChannelButton } from './AllChannelButton';
import { EnterPasswordModal } from './modals/EnterPasswordModal';
import { ParticipationModal } from './modals/ParticipationModal';

function getLenderData(
  channelData: any,
  setPasswordModalOpen: (isModalOpen: boolean) => void,
  setParticipationModalOpen: (isModalOpen: boolean) => void,
  setSelectedChannel: (channelId: string) => void,
) {
  return channelData.map((channel: any) => {
    return (
      <AllChannelButton
        key={channel.id}
        id={channel.id}
        channelName={channel.title}
        now={channel.memberCount}
        max={channel.maximumMemberCount}
        isPublic={channel.isPublic}
        participateModalOpen={setParticipationModalOpen}
        passwordModalOpen={setPasswordModalOpen}
        setSelectedChannel={setSelectedChannel}
      />
    );
  });
}

export function AllChannelList({ searchChannel }: { searchChannel: string }) {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [isParticipationModalOpen, setParticipationModalOpen] =
    useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const apiCall = useCallback(
    () => new Api().api.channelControllerFindAll(),
    [],
  );

  const { isLoading, data } = useQuery('allChannels', apiCall);

  if (isLoading) return <p>로딩중...</p>;

  let lenderData = getLenderData(
    data?.data,
    setPasswordModalOpen,
    setParticipationModalOpen,
    setSelectedChannel,
  );

  return (
    <>
      <Portal selector={'#modal-channel'}>
        <EnterPasswordModal
          isModalOpen={isPasswordModalOpen}
          setIsModalOpen={setPasswordModalOpen}
          targetChannelId={selectedChannel}
        />
      </Portal>
      <Portal selector={'#modal-channel'}>
        <ParticipationModal
          isModalOpen={isParticipationModalOpen}
          setIsModalOpen={setParticipationModalOpen}
          targetChannelId={selectedChannel}
        />
      </Portal>

      <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
        {lenderData}
      </div>
    </>
  );
}
