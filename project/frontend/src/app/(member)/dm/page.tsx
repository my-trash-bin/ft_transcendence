import Head from 'next/head';
import Navbar from '../../../../components/navbar';
import styles from '../../../styles/Home.module.css';

export default function dmHome() {
  return (
    <div>
      <Head>
        <title>dm-pong</title>
      </Head>
      <nav className={styles.layout}>
        <Navbar />
        <div> This is dm page </div>
      </nav>
    </div>
  );
}
