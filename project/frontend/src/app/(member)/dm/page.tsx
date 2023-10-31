import { NavBar } from '@/app/_internal/component/ui/layout/NavBar';
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';

export default function dmHome() {
  return (
    <div>
      <Head>
        <title>dm-pong</title>
      </Head>
      <nav className={styles.layout}>
        <NavBar />
        <div> This is dm page </div>
      </nav>
    </div>
  );
}
