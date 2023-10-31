import Image from 'next/image';
import styles from './DmUser.module.css';

export function DmUser({
  imageUri,
  username,
  messageShortcut,
  date,
}: {
  imageUri: string;
  username: string;
  messageShortcut: string;
  date: Date;
}) {
  const dateView = formatAMPM(date);
  return (
    <button className={`${styles['dm-user']}`}>
      <div className={`${styles['dm-user-image']}`}>
        <Image
          alt="user image short cut dm"
          src={imageUri}
          width="51"
          height="60"
        />
      </div>
      <p className={`${styles['dm-user-name']}`}>{username}</p>
      <p className={`${styles['dm-user-message']}`}>{messageShortcut}</p>
      <p className={`${styles['dm-user-date']}`}>{dateView}</p>
    </button>
  );
}

function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes: number | string = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0시는 12로 표시
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
