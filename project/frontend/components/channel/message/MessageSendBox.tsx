import Image from 'next/image';
import styles from './MessageSendBox.module.css';
export function MessageSendBox() {
  return (
    <div className={`${styles['message-send-box']}`}>
      <div className={`${styles['message-box']}`}>
        <input type="text" placeholder="Enter your message" />
        <button className={`${styles['message-button']}`}>
          <Image
            alt="search icon"
            src="/icon/message-send.svg"
            width={30}
            height={30}
            layout="relative"
          />
        </button>
      </div>
    </div>
  );
}
