const dummyChannel = [
  {
    key: '1',
    channelName: 'channel 1',
    messageShortcut: 'hello',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '2',
    channelName: 'channel 1',
    messageShortcut: 'hello1',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '3',
    channelName: 'channel 3',
    messageShortcut: 'hello2',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '4',
    channelName: 'channel 4',
    messageShortcut: 'hello2',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '5',
    channelName: 'channel 4',
    messageShortcut: 'hello2',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '6',
    channelName: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '7',
    channelName: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '8',
    channelName: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
    max: 10,
    now: 5,
  },
];

import { AllChannelButton } from './AllChannelButton';
export function ChannelList() {
  return (
    <div className="w-[inherit] h-[530px] flex flex-col items-center overflow-y-scroll">
      {/* {dummyChannel.map((data) => {
        return (
          <MyChannelButton
            key={data.key}
            channelName={data.channelName}
            date={data.date}
            messageShortcut={data.messageShortcut}
            max={data.max}
            now={data.now}
          />
        );
      })} */}
      {dummyChannel.map((data) => {
        return (
          <AllChannelButton
            key={data.key}
            channelName={data.channelName}
            now={data.now}
            max={data.max}
          />
        );
      })}
    </div>
  );
}
