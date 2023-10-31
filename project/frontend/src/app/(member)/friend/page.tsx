import Head from 'next/head';
import Navbar from '../../../../components/navbar';
import styles from '../../../styles/Home.module.css';

export default function friendHome() {
  return (
    <div>
      <Head>
        <title>friend-pong</title>
      </Head>
      <nav className={styles.layout}>
        <Navbar />
        <div> This is friend page </div>
      </nav>
    </div>
  );
}
