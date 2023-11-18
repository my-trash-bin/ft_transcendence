import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentTetrominoState, nextTetrominoState, isGameStartedState } from './State';
import { getRandomTetromino } from './Block';

export const GameStarter = () => {
  const setIsGameStarted = useSetRecoilState(isGameStartedState);
  const [currentTetromino, setCurrentTetromino] = useRecoilState(currentTetrominoState);
  const setNextTetromino = useSetRecoilState(nextTetrominoState);

  useEffect(() => {
    setIsGameStarted(true);
    if (currentTetromino === null) {
      const newTetromino = getRandomTetromino();
      setCurrentTetromino(newTetromino);
      setNextTetromino(getRandomTetromino());
    }
  }, [setIsGameStarted, currentTetromino, setCurrentTetromino, setNextTetromino]);

  return null;
};
