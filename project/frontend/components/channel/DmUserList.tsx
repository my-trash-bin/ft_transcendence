import DmUser from './DmUser';
import styles from './DmUserList.module.css';

const dummyMessage = [
  {
    key: '1',
    imageUri: '/images/avataaars.svg',
    username: 'user1',
    messageShortcut: 'hello',
    date: new Date(),
  },
  {
    key: '2',
    imageUri: '/images/avataaars.svg',
    username: 'user2',
    messageShortcut: 'hello1',
    date: new Date(),
  },
  {
    key: '3',
    imageUri: '/images/avataaars.svg',
    username: 'user3',
    messageShortcut: 'hello2',
    date: new Date(),
  },
];

export default function DmUsers() {
  return (
    <div className={`${styles['dm-users']}`}>
      <p className={`${styles['dm-users-alt']}`}>All Message</p>
      {dummyMessage.map((val) => {
        return (
          <DmUser
            key={val.key}
            imageUri={val.imageUri}
            username={val.username}
            messageShortcut={val.messageShortcut}
            date={val.date}
          />
        );
      })}
    </div>
  );
}
