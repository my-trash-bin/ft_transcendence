import Head from 'next/head';
import Navbar from '../../../components/navbar';
import styles from '../../../styles/Home.module.css';

export default function gameHome() {
  return (
    <div>
      <Head>
        <title>game-pong</title>
      </Head>
      <nav className={styles.layout}>
        <Navbar />
      </nav>
    </div>
  );
}
