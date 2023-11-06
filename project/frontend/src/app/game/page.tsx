'use client';
import Navbar from '../../components/common/navbar';
import GameButton from '../../components/game/GameButton';
import pageStyles from './page.module.css';

export default function FriendHome() {
  return (
    <nav className="flex">
      <Navbar />
      <div className={pageStyles.buttonContainer}>
        <GameButton mode="normal" />
        <GameButton mode="item" />
      </div>
    </nav>
  );
}
