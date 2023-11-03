import Image from 'next/image';
import { formatAMPM } from '../utils/FromatAmPm';
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
