import { Api, ChannelDto } from '@/api/api';
import { useEffect, useState } from 'react';
import Portal from '../common/Portal';
import { AllChannelButton } from './AllChannelButton';
import { EnterPasswordModal } from './modals/EnterPasswordModal';

function getLenderData(
  channelData: ChannelDto[],
  error: boolean,
  setIsModalOpen: (isModalOpen: boolean) => void,
  isModalOpen: boolean,
  setSelectedChannel: (channelId: string) => void,
) {
  if (error) {
    return <p> 데이터를 가져오는데 실패했습니다 ☠️....</p>;
  }

  return channelData.map((channel) => (
    <AllChannelButton
      key={channel.id}
      id={channel.id}
      channelName={channel.title}
      max={channel.maximumMemberCount}
      now={channel.memberCount}
      type={channel.type}
      setIsModalOpen={setIsModalOpen}
      setSelectedChannel={setSelectedChannel}
    />
  ));
}

export function AllChannelList({ searchChannel }: { searchChannel: string }) {
  const [channelData, setChannelData] = useState<ChannelDto[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedChannel, setSelectedChannel] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await new Api().api.channelControllerFindAll();
        setIsLoading(false);
        setChannelData(data);
      } catch (e) {
        setError(true);
      }
    }
    fetchData();
  }, [searchChannel]);

  let lenderData = getLenderData(
    channelData,
    error,
    setIsModalOpen,
    isModalOpen,
    setSelectedChannel,
  );

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  return (
    <>
      <Portal selector={'#modal-channel'}>
        <EnterPasswordModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          targetChannelId={selectedChannel}
        />
      </Portal>
      <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
        {lenderData}
      </div>
    </>
  );
}
