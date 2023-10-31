import { NavBar } from '@/app/_internal/component/ui/layout/NavBar';
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';

export default function channelHome() {
  return (
    <div>
      <Head>
        <title>channel-pong</title>
      </Head>
      <nav className={styles.layout}>
        <NavBar />
        <div> This is channel page </div>
      </nav>
    </div>
  );
}
