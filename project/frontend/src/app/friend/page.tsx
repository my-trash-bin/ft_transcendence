import styles from '../../../styles/Home.module.css';
import Navbar from '../../components/common/navbar';

export default function FriendHome() {
  return (
    <nav className={styles.layout}>
      <Navbar />
      <div> This is friend page </div>
    </nav>
  );
}
