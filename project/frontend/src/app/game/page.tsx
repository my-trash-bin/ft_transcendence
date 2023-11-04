'use client';
import styles from '../../../styles/Home.module.css';
import Navbar from '../../components/common/navbar';
// import GameButton from '../../components/game/Gamebutton.js';
import GameButton from '../../components/game/GameButton';
import pageStyles from './page.module.css';

export default function FriendHome() {
  return (
    <nav className={styles.layout}>
      <Navbar />
      <div className={pageStyles.buttonContainer}>
        <GameButton mode="normal" />
        <GameButton mode="item" />
      </div>
    </nav>
  );
}
