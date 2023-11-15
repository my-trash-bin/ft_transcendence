import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useLockAndSpawnTetromino } from './Spawn';
import { getRandomTetromino, TetrominoShape } from './Block';
import {
  boardState,
  currentTetrominoState,
  nextTetrominoState,
  tetrominoPositionState,
  // ... other state atoms ...
} from './State';

interface Position {
  x: number;
  y: number;
}

export const useGameLogic = () => {
  const [board, setBoard] = useRecoilState(boardState);
  const [currentTetromino, setCurrentTetromino] = useRecoilState(currentTetrominoState);
  const [nextTetromino, setNextTetromino] = useRecoilState(nextTetrominoState);
  const [tetrominoPosition, setTetrominoPosition] = useRecoilState(tetrominoPositionState);

  const canMoveDown = useCallback((newPosition: Position): boolean => {
    if (currentTetromino === null) {
      return false;
    }
    for (let row = 0; row < currentTetromino.length; row++) {
      for (let col = 0; col < currentTetromino[row].length; col++) {
        if (currentTetromino[row][col] !== 0) {
          const newPosX = col + newPosition.x;
          const newPosY = row + newPosition.y;

          // 여기서 newPosY가 음수일 경우에 대한 처리
          if (newPosY < 0) {
            continue; // 보드 경계 위에 있으므로, 아직 충돌 검사를 수행하지 않음
          }

          if (
            newPosX < 0 ||
            newPosX >= board[0].length ||
            newPosY >= board.length ||
            board[newPosY][newPosX] !== 0
          ) {
            return false;  // 충돌 발생
          }
        }
      }
    }
    return true;
  }, [currentTetromino, board]);

  const checkCollision = useCallback((newPosition: Position) => {
    return !canMoveDown(newPosition);
  }, [canMoveDown]);

  const lockAndSpawnTetromino = useLockAndSpawnTetromino();

  const moveTetrominoDown = useCallback(() => {
    if (!currentTetromino) return;

    setTetrominoPosition((prevPosition) => {
      const newPosition = { ...prevPosition, y: prevPosition.y + 1 };

      console.log("Attempting to move to new y =", newPosition.y); // Log the attempted new position
      if (!checkCollision(newPosition)) {
        console.log("No collision, new position will be:", newPosition);
        return newPosition;
      } else {
        console.log("Collision detected, locking Tetromino and spawning new one");
        lockAndSpawnTetromino(prevPosition, currentTetromino);
        return prevPosition;
      }
    });
  }, [
    setTetrominoPosition,
    checkCollision,
    lockAndSpawnTetromino,
    currentTetromino
  ]);
  // A new function to handle the side effects outside the state updater
  // ... other game logic functions ...

  return {
    moveTetrominoDown,
    // ... other exposed game logic functions ...
  };
};
