import styles from '../styles/Home.module.css';
import Logo from './logo/logo';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.grid}>
        <Logo />
        <Link href="/friend" className={styles.card}>
          <Image
            src="/icon/friend.svg"
            alt="friend-icon"
            width={50}
            height={50}
          />
          <h3>friend</h3>
        </Link>
        <Link href="/dm" className={styles.card}>
          <h3>dm</h3>
        </Link>
        <Link href="/channel" className={styles.card}>
          <h3>channel</h3>
        </Link>
        <Link href="/game" className={styles.card}>
          <h3>game</h3>
        </Link>
        <Link href="/profile" className={styles.card}>
          <h3>profile</h3>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
