import styles from './navbar.module.css';
import Logo from '../logo/logo';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Logo />
      <Link href="/friend" className={styles.active_card}>
        <Image
          className={styles.icon}
          src="/icon/friend.svg"
          alt="friend-icon"
          width={30}
          height={30}
        />
      </Link>
      <Link href="/dm" className={styles.card}>
        <Image src="/icon/dm.svg" alt="chat-icon" width={30} height={30} />
      </Link>
      <Link href="/channel" className={styles.card}>
        <Image
          src="/icon/channel.svg"
          alt="channel-icon"
          width={30}
          height={30}
        />
      </Link>
      <Link href="/game" className={styles.card}>
        <Image src="/icon/game.svg" alt="game-icon" width={30} height={30} />
      </Link>
      <Link href="/profile" className={styles.card}>
        <Image
          src="/icon/profile.svg"
          alt="profile-icon"
          width={30}
          height={30}
        />
      </Link>
    </nav>
  );
};

export default Navbar;
