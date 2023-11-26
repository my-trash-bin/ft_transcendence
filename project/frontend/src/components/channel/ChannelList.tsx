'use client';
import { Api, ChannelDto } from '@/api/api';
import { useEffect, useState } from 'react';
import { AllChannelButton } from './AllChannelButton';
import { MyChannelButton } from './MyChannelButton';

function getLenderData(
  channelData: ChannelDto[],
  error: boolean,
  myChannel: boolean,
) {
  if (error) {
    return <p> 데이터를 가져오는데 실패했습니다 ☠️....</p>;
  }
  if (myChannel) {
    return channelData.map((channel) => (
      <MyChannelButton
        key={channel.id}
        id={channel.id}
        channelName={channel.title}
        date={new Date()}
        messageShortcut={'aaa'}
        max={channel.maximumMemberCount}
        now={channel.memberCount}
      />
    ));
  } else {
    return channelData.map((channel) => (
      <AllChannelButton
        key={channel.id}
        id={channel.id}
        channelName={channel.title}
        max={channel.maximumMemberCount}
        now={channel.memberCount}
      />
    ));
  }
}

export function ChannelList({
  myChannel,
  searchChannel,
}: {
  myChannel: boolean;
  searchChannel: string;
}) {
  const [channelData, setChannelData] = useState<ChannelDto[]>([]);
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    async function fetchData() {
      try {
        if (myChannel) {
          const { data } =
            await new Api().api.channelControllerFindMyChannels();
          setChannelData(data);
        } else {
          const { data } = await new Api().api.channelControllerFindAll();
          setChannelData(data);
        }
        setError(false);
      } catch (e) {
        setError(true);
      }
    }
    fetchData();
  }, [searchChannel, myChannel]);

  let lenderData = getLenderData(channelData, error, myChannel);
  return (
    <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
      {lenderData}
    </div>
  );
}
