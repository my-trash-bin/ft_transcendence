import { Api, ChannelDto } from '@/api/api';
import { useEffect, useState } from 'react';
import { MyChannelButton } from './MyChannelButton';

function getLenderData(
  channelData: ChannelDto[],
  error: boolean,
  setIsModalOpen: (isModalOpen: boolean) => void,
  isModalOpen: boolean,
) {
  if (error) {
    return <p> 데이터를 가져오는데 실패했습니다 ☠️....</p>;
  }

  return channelData.map((channel) => (
    <MyChannelButton
      key={channel.id}
      id={channel.id}
      channelName={channel.title}
      max={channel.maximumMemberCount}
      now={channel.memberCount}
    />
  ));
}

export function MyChannelList({ searchChannel }: { searchChannel: string }) {
  const [channelData, setChannelData] = useState<ChannelDto[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await new Api().api.channelControllerFindMyChannels();
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
  );

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  return (
    <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
      {lenderData}
    </div>
  );
}
