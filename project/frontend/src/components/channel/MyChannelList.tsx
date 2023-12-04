import { Api } from '@/api/api';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { MyChannelButton } from './MyChannelButton';

function getRenderData(channelData: any, searchChannel: string) {
  const filteredData = channelData.filter((channel: any) =>
    channel.title.includes(searchChannel),
  );

  return filteredData.map((channel: any) => (
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const apiCall = useCallback(
    () => new Api().api.channelControllerFindMyChannels(),
    [],
  );
  const { isLoading, data } = useQuery('myChannels', apiCall);

  if (isLoading) return <p>로딩중...</p>;
  let renderData = getRenderData(data?.data, searchChannel);

  return (
    <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
      {renderData}
    </div>
  );
}
