import { MyChannelButton } from './MyChannelButton';

const dummyChannel = [
  {
    key: '1',
    channelName: 'user1',
    messageShortcut: 'hello',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '2',

    channelName: 'user2',
    messageShortcut: 'hello1',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '3',

    channelName: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '4',

    channelName: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
    max: 10,
    now: 5,
  },
  {
    key: '5',
    channelName: 'user3',
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

export function ChannelList() {
  return (
    <div className="w-[inherit] h-[380px] overflow-y-scroll">
      {dummyChannel.map((data) => {
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
      })}
    </div>
  );
}
