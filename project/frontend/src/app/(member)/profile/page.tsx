import Head from 'next/head';

import { NavBar } from '@/app/_internal/component/ui/layout/NavBar';
import styles from '../../../styles/Home.module.css';

export default function profileHome() {
  return (
    <div>
      <Head>
        <title>profile-pong</title>
      </Head>
      <nav className={styles.layout}>
        <NavBar />
        <div> This is profile page </div>
      </nav>
    </div>
  );
}
