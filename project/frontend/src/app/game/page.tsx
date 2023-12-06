'use client';
import withAuth from '@/components/auth/Auth';
import { Title } from '@/components/common/Title';
import { GameFinishModal } from '@/components/game/GameFinishModal';
import { useState } from 'react';
import GameButton from '../../components/game/GameButton';
import { Ranking } from '../../components/game/Ranking';

function GamePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  return (
    <div className="flex flex-row h-[100%] w-[100%]">
      <div className="w-[100%] h-[100%] bg-light-background rounded-lg">
        <div className="flex flex-row w-[100%]">
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            <section className="flex justify-between w-[700px] py-xl">
              <GameButton mode="normal" />
              <GameButton mode="item" />
            </section>
            <Title font="big">순위</Title>
            <Ranking />
          </div>
        </div>
      </div>
      <button className="w-sm h-sm bg-default" onClick={handleModalOpen}>
        임시 버튼
      </button>
      <GameFinishModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}

export default withAuth(GamePage);
