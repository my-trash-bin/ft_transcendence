import Image from 'next/image';
import styles from './logo.module.css';

function Logo() {
  return (
    <div className={styles.logo}>
      <h1>our pong</h1>
      <Image src="/images/totoro.png" alt="totoro" width={50} height={50} />
    </div>
  );
}

export default Logo;
