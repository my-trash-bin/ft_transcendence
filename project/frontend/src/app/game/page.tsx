'use client';
import styles from '../../../styles/Home.module.css';
import Navbar from '../../components/common/navbar/navbar';
import Button from '../../components/game/Button.js';
import pageStyles from './page.module.css';

export default function FriendHome() {
  return (
    <nav className={styles.layout}>
      <Navbar />
      <div className={pageStyles.buttonContainer}>
        <Button mode="일반" />
        <Button mode="아이템" />
      </div>
    </nav>
  );
}
