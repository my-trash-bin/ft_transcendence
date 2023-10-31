import { NavBar } from '@/app/_internal/component/ui/layout/NavBar';
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';

export default function FriendHome() {
  return (
    <div>
      <Head>
        <title>friend-pong</title>
      </Head>
      <nav className={styles.layout}>
        <NavBar />
        <div> This is friend page </div>
      </nav>
    </div>
  );
}
