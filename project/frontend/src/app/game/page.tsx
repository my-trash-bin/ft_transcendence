'use client';
import Navbar from '../../components/common/navbar';
import GameButton from '../../components/game/GameButton';
import Ranking from '../../components/game/Ranking';
import { mockRankings } from './mockRankings';
import { mockUser } from './mockUser';

export default function FriendHome() {
  return (
    <div className="flex flex-row h-[100%] w-[100%]">
      <Navbar />
      <div>
        <div className={`flex-col items-center max-w-4xl mx-auto`}>
          <section className="justify-center w-full">
            <GameButton mode="normal" />
            <GameButton mode="item" />
          </section>
          <article className="w-full">
            <h1 className="text-dark-gray-interactive font-bold text-h2 \
            py-sm px-lg my-xl h-sm justify-center">순위</h1>
            <Ranking rankings={mockUser} isUser={true}/>
            <Ranking rankings={mockRankings}/>
          </article>
        </div>
      </div>
    </div>
  );
}
