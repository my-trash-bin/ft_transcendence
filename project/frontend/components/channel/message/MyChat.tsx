import { formatAMPM } from '../utils/FromatAmPm';
import styles from './MyChat.module.css';

export function MyChat({
  content,
  time,
  isFirst,
}: Readonly<{ content: string; time: Date; isFirst: boolean }>) {
  const timeAMPM = formatAMPM(time);
  const contentStyle =
    isFirst === true ? 'my-chat-content-f' : 'my-chat-content';
  return (
    <div className={`${styles['my-chat']}`}>
      <p className={`${styles[contentStyle]}`}>{content}</p>
      <p className={`${styles['my-chat-time']}`}>{timeAMPM}</p>
    </div>
  );
}
