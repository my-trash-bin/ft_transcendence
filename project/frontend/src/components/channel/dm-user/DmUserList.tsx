import { DmUser } from './DmUser';

const dummyMessage = [
  {
    key: '1',
    imageUri: '/avatar/avatar-big.svg',
    username: 'user1',
    messageShortcut: 'hello',
    date: new Date(),
  },
  {
    key: '2',
    imageUri: '/avatar/avatar-big.svg',
    username: 'user2',
    messageShortcut: 'hello1',
    date: new Date(),
  },
  {
    key: '3',
    imageUri: '/avatar/avatar-black.svg',
    username: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
  },
  {
    key: '4',
    imageUri: '/avatar/avatar-blue.svg',
    username: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
  },
  {
    key: '5',
    imageUri: '/avatar/avatar-big.svg',
    username: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
  },
  {
    key: '6',
    imageUri: '/avatar/avatar-small.svg',
    username: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
  },
  {
    key: '7',
    imageUri: '/avatar/avatar-big.svg',
    username: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
  },
  {
    key: '8',
    imageUri: '/avatar/avatar-black.svg',
    username: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
  },
];

export function DmUserList() {
  return (
    <div className="flex flex-col w-[100%] h-[80%] pl-[5%] ">
      <p className="w-[25%] h-[3%] text-[0.7rem] text-dark-gray">All Message</p>
      <div className="h-[inherit] overflow-y-scroll">
        {dummyMessage.map((val) => {
          return (
            <DmUser
              key={val.key}
              imageUri={val.imageUri}
              nickname={val.username}
              messageShortcut={val.messageShortcut}
              date={val.date}
            />
          );
        })}
      </div>
    </div>
  );
}
