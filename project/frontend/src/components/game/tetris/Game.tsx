import React from 'react';
import { RecoilRoot } from 'recoil';
import { TetrisBoard } from './TetrisBoard';
import { GameStarter } from './Start';

const Game: React.FC = () => {
  return (
    <RecoilRoot>
      <GameStarter />
      <TetrisBoard />
    </RecoilRoot>
  );
};

export default Game;
