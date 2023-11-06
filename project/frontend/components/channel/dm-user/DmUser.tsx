import Image from 'next/image';
import { formatAMPM } from '../utils/FromatAmPm';
import styles from './DmUser.module.css';
export function DmUser({
  imageUri,
  nickname,
  messageShortcut,
  date,
}: Readonly<{
  imageUri: string;
  nickname: string;
  messageShortcut: string;
  date: Date;
}>) {
  const dateView = formatAMPM(date);
  return (
    <button className={`${styles['dm-user']}`}>
      <div className={`${styles['dm-user-image']}`}>
        <Image
          alt="user image short cut dm"
          src={imageUri}
          width="51"
          height="60"
          layout="relative"
        />
      </div>
      <p className={`${styles['dm-user-name']}`}>{nickname}</p>
      <p className={`${styles['dm-user-message']}`}>{messageShortcut}</p>
      <p className={`${styles['dm-user-date']}`}>{dateView}</p>
    </button>
  );
}
