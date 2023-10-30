import Navbar from '../../../components/navbar';
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';

export default function profileHome() {
  return (
    <div>
      <Head>
        <title>profile-pong</title>
      </Head>
      <nav className={styles.layout}>
        <Navbar />
        <div> This is profile page </div>
      </nav>
    </div>
  );
}
