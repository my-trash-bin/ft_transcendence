import React, { useState, useEffect } from 'react';
import { useGameLogic } from './GameLogic';
import Preview from './Preview';
import { TetrominoShape, cellColors } from './Block';
import { useRecoilState, useRecoilValue } from 'recoil';
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

type Board = number[][];

const TetrisBoard: React.FC = () => {
  // Use useRecoilValue or useRecoilState to access the current tetromino and its position
  const currentTetromino = useRecoilValue(currentTetrominoState);
  const tetrominoPosition = useRecoilValue(tetrominoPositionState);
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


  const getCombinedBoardState = (
    board: Board,
    tetromino: TetrominoShape | null,
    position: { x: number; y: number }
  ): Board => {
    // Clone the board to avoid mutating the original state
    const newBoard: Board = board.map(row => [...row]);

    // If there is a tetromino, integrate it into the cloned board
    if (tetromino) {
      tetromino.forEach((row, y) => {
        row.forEach((cell: number, x) => {
          if (cell !== 0) { // Check if the cell is filled in the tetromino
            const newY = y + position.y;
            const newX = x + position.x;
            if (
              newY >= 0 && newY < board.length &&
              newX >= 0 && newX < board[0].length
            ) {
              newBoard[newY][newX] = cell; // Place the cell in the new board
            }
          }
        });
      });
    }
    return newBoard;
  };
  // Inside your TetrisBoard component
  // Compute the combined board every time the component renders
  const combinedBoard = getCombinedBoardState(board, currentTetromino, tetrominoPosition);
  // console.log(combinedBoard);
  function getCellColorClass(cell: number): string {
    return cellColors[cell] || 'bg-transparent'; // Fallback to 'bg-transparent' if the cell type is not defined
  }

  // 렌더링 부분
  return (
    <div className="flex justify-center items-start space-x-4">
      {/* 게임 보드 */}
      <div className="grid grid-cols-10 gap-1 bg-white-interactive" style={{ width: '200px', height: '400px' }}>
        {combinedBoard.flat().map((cell, cellIndex) => (
          <div
            key={cellIndex}
            // className={`w-[20px] h-[20px] border border-default-interactive ${getCellColorClass(cell)}`}
            className={`w-[20px] h-[20px] border ${cell ? 'bg-dark-purple-interactive' : 'border-default-interactive'}`}
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

export default TetrisBoard;
