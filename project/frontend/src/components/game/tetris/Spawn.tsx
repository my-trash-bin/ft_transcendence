import { useRecoilCallback, useRecoilValue } from 'recoil';
import { boardState, currentTetrominoState, nextTetrominoState, tetrominoPositionState } from './State';
import { TetrominoShape, getRandomTetromino } from './Block';

interface Position {
  x: number;
  y: number;
}

let gameOver = false;
const CELLS_WIDTH = 10;

export const useLockAndSpawnTetromino = () => {
  return useRecoilCallback(({ snapshot, set }) => async (prevPosition: Position, currentTetromino: TetrominoShape | null) => {
    if (!currentTetromino) return;

    // 현재 Recoil 상태를 읽기
    const board = await snapshot.getPromise(boardState);

    const newBoard = board.map(row => [...row]);
    currentTetromino.forEach((row, tetrominoY) => {
      row.forEach((cell, tetrominoX) => {
        if (cell !== 0) {
          const newY = tetrominoY + prevPosition.y;
          const newX = tetrominoX + prevPosition.x;

          // Check if the cell is outside the game board's top boundary or if the position is already occupied
          if (newY < 0 || newBoard[newY][newX] !== 0) {
            gameOver = true;
            return;
          }

          newBoard[newY][newX] = cell;
        }
      });
    });

    if (gameOver) {
      // Handle game over logic here
      console.log('Game Over');
      // You might want to stop the game loop, display a message, etc.
    }
    
    // Recoil 상태 업데이트
    set(boardState, newBoard);
    // set(currentTetrominoState, await snapshot.getPromise(nextTetrominoState));
    // set(nextTetrominoState, getRandomTetromino());
    const nextTetromino = await snapshot.getPromise(nextTetrominoState);
    set(currentTetrominoState, nextTetromino);
    set(nextTetrominoState, getRandomTetromino());

    // 새 테트로미노의 초기 위치 설정
    set(tetrominoPositionState, { x: Math.floor(CELLS_WIDTH / 2) - 1, y: -2 }); // 보드의 상단 중앙에 위치
  }, []);
};
