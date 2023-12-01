'use client';
import { GameFinishModal } from '@/components/game/GameFinishModal';
import GameButton from '../../components/game/GameButton';
import { Ranking } from '../../components/game/Ranking';
import React, { useState } from 'react';

export default function GamePage() {
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
            <section className="flex justify-between w-[700px] pt-xl">
              <GameButton mode="normal" />
              <GameButton mode="item" />
            </section>
            <article className="w-full">
              <h2
                className="text-dark-gray-interactive font-bold text-h2 \
            mt-xl mx-auto h-sm flex items-center justify-center"
              >
                순위
              </h2>
              <Ranking />
            </article>
          </div>
        </div>
      </div>
      <div onClick={() => handleModalOpen}>open modal</div>
      <GameFinishModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
