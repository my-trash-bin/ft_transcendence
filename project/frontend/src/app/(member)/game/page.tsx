import { NavBar } from '@/app/_internal/component/ui/layout/NavBar';
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';

export default function gameHome() {
  return (
    <div>
      <Head>
        <title>game-pong</title>
      </Head>
      <nav className={styles.layout}>
        <NavBar />
        <div> This is game page </div>
      </nav>
    </div>
  );
}
