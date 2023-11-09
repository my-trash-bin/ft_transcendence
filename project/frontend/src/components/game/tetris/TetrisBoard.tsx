import React, { useState, useEffect } from 'react';
import { useGameLogic } from './GameLogic';
import Preview from './Preview';
import { useRecoilState } from 'recoil';
import {
  boardState,
  currentTetrominoState,
  nextTetrominoState,
  tetrominoPositionState,
  scoreState,
  levelState,
  linesClearedState,
  isGameOverState,
  isGamePausedState,
  isGameStartedState
} from './State';

// const startGame = () => {
//   setisGameStarted(true);
//   // Other game start logic
// };

export const TetrisBoard: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [board, setBoard] = useRecoilState(boardState);
  const [nextTetromino, setNextTetromino] = useRecoilState(nextTetrominoState);
  const [isGameStarted, setisGameStarted] = useRecoilState(isGameStartedState);
  const [isGamePaused, setIsGamePaused] = useRecoilState(isGamePausedState);
  const { moveTetrominoDown } = useGameLogic();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (isGameStarted && !isGamePaused) {
      intervalId = setInterval(moveTetrominoDown, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGameStarted, isGamePaused, moveTetrominoDown]);

  // 렌더링 부분
  return (
    <div className="flex justify-center items-start space-x-4">
      {/* 게임 보드 */}
      <div className="grid grid-cols-10 gap-1 bg-white-interactive" style={{ width: '200px', height: '400px' }}>
        {board.flat().map((cell, cellIndex) => (
          <div
            key={cellIndex}
            className={`w-[20px] h-[20px] border ${cell ? 'border-default-interactive fill-cell-class' : 'border-default'}`}
          ></div>
        ))}
      </div>

      {/* 미리보기 보드 nextTetromino */}
      <div>
        <div className="text-center mb-2">Next Tetromino</div>
        {nextTetromino && <Preview tetromino={nextTetromino} />}
      </div>
    </div>
  );
};
