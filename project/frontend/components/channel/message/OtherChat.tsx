import Image from 'next/image';
import { formatAMPM } from '../utils/FromatAmPm';
import styles from './OtherChat.module.css';

export function OtherChat({
  content,
  time,
  profile,
  isFirst,
}: Readonly<{
  content: string;
  time: Date;
  profile: string;
  isFirst: boolean;
}>) {
  const timeAMPM = formatAMPM(time);
  const contentStyle =
    isFirst === true ? 'other-chat-content-f' : 'other-chat-content';
  return (
    <div className={`${styles['other-chat-layout']}`}>
      <div className={`${styles['other-chat-image']}`}>
        {isFirst === true ? (
          <Image
            alt="profile"
            src={profile}
            width={40}
            height={40}
            layout="responsive"
          />
        ) : (
          ''
        )}
      </div>
      <div className={`${styles['other-chat']}`}>
        <p className={`${styles[contentStyle]}`}>{content}</p>
        <p className={`${styles['other-chat-time']}`}>{timeAMPM}</p>
      </div>
    </div>
  );
}
