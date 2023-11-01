import Image from 'next/image';
import styles from './logo.module.css';

function Logo() {
  return (
    <div className={styles.logo}>
      <Image
        src="/images/totoro.png"
        priority={true}
        alt="totoro"
        width={50}
        height={50}
      />
    </div>
  );
}

export default Logo;
