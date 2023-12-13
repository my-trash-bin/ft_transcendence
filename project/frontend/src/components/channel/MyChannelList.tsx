import { unwrap } from '@/api/unwrap';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { MyChannelCard } from './MyChannelCard';

function getRenderData(channelData: any, searchChannel: string) {
  const filteredData = channelData?.filter((channel: any) =>
    channel.title.includes(searchChannel),
  );
  return filteredData?.map((channel: any) => {
    return (
      <MyChannelCard
        key={channel.id}
        id={channel.id}
        channelName={channel.title}
        messageShortcut={channel.message}
        date={new Date(channel.lastActiveAt)}
        max={channel.maximumMemberCount}
        now={channel.memberCount}
      />
    );
  });
}

export function MyChannelList({
  searchChannel,
}: {
  readonly searchChannel: string;
}) {
  const { api } = useContext(ApiContext);
  const { isLoading, isError, data } = useQuery(
    'myChannels',
    useCallback(
      async () => unwrap(await api.channelControllerFindMyChannels()),
      [api],
    ),
  );

  if (isLoading) return <p>로딩중...</p>;
  if (isError) return <p>알 수 없는 에러</p>;
  let renderData = getRenderData(data, searchChannel);

  return (
    <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
      {renderData}
    </div>
  );
}
