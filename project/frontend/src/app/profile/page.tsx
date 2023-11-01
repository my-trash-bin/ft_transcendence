import Navbar from '../../../components/common/navbar/navbar';
import styles from '../../../styles/Home.module.css';

export default function FriendHome() {
  return (
    <nav className={styles.layout}>
      <Navbar />
      <div> This is profile page </div>
    </nav>
  );
}
