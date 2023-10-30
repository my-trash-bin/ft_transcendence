import Navbar from '../../../components/common/navbar/navbar';
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';

export default function channelHome() {
  return (
    <div>
      <Head>
        <title>channel-pong</title>
      </Head>
      <nav className={styles.layout}>
        <Navbar />
        <div> This is channel page </div>
      </nav>
    </div>
  );
}
