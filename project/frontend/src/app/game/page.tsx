'use client'
import Navbar from '../../../components/common/navbar/navbar';
import Button from '../../../components/common/game/Button.js';
import styles from '../../../styles/Home.module.css';
import pageStyles from './page.module.css';

export default function FriendHome() {

  return (
    <nav className={styles.layout}>
      <Navbar />
      <div className={pageStyles.buttonContainer}>
        <Button mode="normal"  />
        <Button mode="item"  />
      </div>
    </nav>
  );
}
