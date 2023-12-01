import { Api, ChannelDto } from '@/api/api';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { MyChannelButton } from './MyChannelButton';
function getLenderData(
  channelData: any,
  setIsModalOpen: (isModalOpen: boolean) => void,
  isModalOpen: boolean,
) {
  return channelData.map((channel: any) => (
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const apiCall = useCallback(
    () => new Api().api.channelControllerFindMyChannels(),
    [],
  );
  const { isLoading, isError, data } = useQuery('myChannels', apiCall);

  if (isLoading) return <p>로딩중...</p>;
  if (isError) throw new Error('에러가 발생했습니다.');
  let lenderData = getLenderData(data?.data, setIsModalOpen, isModalOpen);

  return (
    <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
      {lenderData}
    </div>
  );
}
