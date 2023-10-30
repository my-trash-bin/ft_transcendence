import Navbar from '../../../components/common/navbar/navbar';
import Head from 'next/head';
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
