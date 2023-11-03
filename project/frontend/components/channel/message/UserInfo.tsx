import Image from 'next/image';
import styles from './UserInfo.module.css';

export function UserInfo({
  imageUri,
  username,
  onActive,
}: Readonly<{
  imageUri: string;
  username: string;
  onActive: boolean;
}>) {
  const active = onActive ? 'Active' : 'Inavtice';

  return (
    <div className={`${styles['user-info']}`}>
      <div className={`${styles['user-info-image']}`}>
        <Image alt="userImage" src={imageUri} width={45} height={62} />
      </div>
      <p className={`${styles['user-info-username']}`}>{username}</p>
      <div
        className={`${styles['user-info-active']} ${
          onActive ? styles.active : styles.inactive
        }`}
      ></div>
      <p className={`${styles['user-info-active-dis']}`}>{active}</p>
      <button className={`${styles['user-info-setting']}`}>
        <Image
          alt="message-setting"
          src={'/icon/message-setting.svg'}
          width={35}
          height={50}
        ></Image>
      </button>
    </div>
  );
}
