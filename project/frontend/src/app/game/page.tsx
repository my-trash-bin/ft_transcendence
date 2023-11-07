'use client';
import Navbar from '../../components/common/Navbar';
import GameButton from '../../components/game/GameButton';
import Ranking from '../../components/game/Ranking';
import { mockRankings } from './mockRankings';
import { mockUser } from './mockUser';

export default function GamePage() {
  return (
    <div className="flex flex-row h-[100%] w-[100%]">
      <Navbar />
      <div className="flex flex-row w-[100%]">
        <div className={`flex flex-col items-center max-w-4xl mx-auto`}>
          <section className="flex justify-center w-full">
            <GameButton mode="normal" />
            <GameButton mode="item" />
          </section>
          <article className="w-full">
            <h1
              className="text-dark-gray-interactive font-bold text-h2 \
            py-sm px-lg mx-auto my-xl h-sm flex items-center justify-center"
            >
              순위
            </h1>
            <Ranking rankings={mockUser} isUser={true} />
            <Ranking rankings={mockRankings} />
          </article>
        </div>
      </div>
    </div>
  );
}
