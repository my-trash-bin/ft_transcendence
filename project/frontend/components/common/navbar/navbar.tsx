'use client';
import styles from './navbar.module.css';
import Logo from '../logo/logo';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface CreateIconProps {
  type: string;
}
const CreateIcon = (props: CreateIconProps) => {
  const path = usePathname();
  const isActive = path === `/${props.type}`;
  const className = isActive ? styles.active_card : styles.card;
  return (
    <Link href={`/${props.type}`} className={className}>
      <Image
        className={styles.icon}
        src={`/icon/${props.type}.svg`}
        alt={`${props.type}-icon`}
        width={30}
        height={30}
      />
    </Link>
  );
};

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Logo />
      <CreateIcon type="friend" />
      <CreateIcon type="dm" />
      <CreateIcon type="channel" />
      <CreateIcon type="game" />
      <CreateIcon type="profile" />
    </nav>
  );
};

export default Navbar;
