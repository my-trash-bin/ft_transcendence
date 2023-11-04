'use client';
import styles from '../../../styles/Home.module.css';
import Navbar from '../../components/common/navbar/navbar';
import GameButton from '../../components/game/Gamebutton.js';
import pageStyles from './page.module.css';

export default function FriendHome() {
  return (
    <nav className={styles.layout}>
      <Navbar />
      <div className={pageStyles.buttonContainer}>
        <GameButton mode="일반" />
        <GameButton mode="아이템" />
      </div>
    </nav>
  );
}
