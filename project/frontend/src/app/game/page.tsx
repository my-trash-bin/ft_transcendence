'use client';
import Navbar from '../../components/common/navbar';
import GameButton from '../../components/game/GameButton';
import Ranking from '../../components/game/Ranking';
import { mockRankings } from './mockRankings';
import { mockUser } from './mockUser';

export default function FriendHome() {
  const maxWidthClass = "max-w-4xl";

  return (
    <div className="flex">
      <Navbar />
      <div className={`flex flex-col items-center ${maxWidthClass} mx-auto`}>
        <section className="flex justify-center w-full">
          <GameButton mode="normal" />
          <GameButton mode="item" />
        </section>
        <article className="w-full">
          <h1 className="text-dark-gray-interactive font-bold text-h2 \
          py-sm px-lg mx-auto my-xl h-sm flex items-center justify-center">순위</h1>
          <Ranking rankings={mockUser} isUser={true}/>
          <Ranking rankings={mockRankings}/>
        </article>
      </div>
    </div>
  );
}
