'use client';
import Navbar from '../../components/common/navbar';
import GameButton from '../../components/game/GameButton';
import Ranking from '../../components/game/Ranking';
import { mockRankings } from './mockRankings';
import { mockUser } from './mockUser';
import pageStyles from './page.module.css';

export default function FriendHome() {
  return (
    <div className="flex">
      <Navbar />
      <div>
        <section className={pageStyles.buttonContainer}>
          <GameButton mode="normal" />
          <GameButton mode="item" />
        </section>
        <article>
        <h1 className="text-dark-gray-interactive font-bold text-h2 \
        py-sm px-lg mx-auto my-xl w-xl h-sm flex items-center justify-center">순위</h1>
          <Ranking rankings={mockUser} isUser={true}/>
          <Ranking rankings={mockRankings}/>
        </article>
      </div>
    </div>
  );
}
