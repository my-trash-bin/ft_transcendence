'use client';
import { GET_ALL_CHANNELS } from '@/api/channel/ChannelApi';
import { useQuery } from '@apollo/client';
import { AllChannelButton } from './AllChannelButton';
import { MyChannelButton } from './MyChannelButton';

interface myChannelListProps {
  channelName: string;
  latestTime: Date;
  preViewMessage: string;
  max: number;
  min: number;
}

interface allChannelListProps {
  channelName: string;
  max: number;
  min: number;
}

export function ChannelList({
  myChannel,
  searchChannel,
}: {
  myChannel: boolean;
  searchChannel: string;
}) {
  const { loading, error, data } = useQuery(GET_ALL_CHANNELS);
  if (loading) return;
  if (error) return <p>데이터를 가저오기에 실패했습니다.. ☠️</p>;

  return (
    <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
      {myChannel
        ? data.allChannel.map((data: myChannelListProps) => {
            return (
              <MyChannelButton
                key={data.channelName}
                channelName={data.channelName}
                date={data.latestTime}
                messageShortcut={data.preViewMessage.substring(0, 18)}
                max={data.max}
                now={data.min}
              />
            );
          })
        : data.allChannel.map((data: allChannelListProps) => {
            return (
              <AllChannelButton
                key={data.channelName}
                channelName={data.channelName}
                max={data.max}
                now={data.min}
              />
            );
          })}
    </div>
  );
}
