import { atom } from 'recoil';
import { TetrominoShape, getRandomTetromino } from './Block';

const CELLS_WIDTH = 10;
const CELLS_HEIGHT = 20;

export const tetrominoState = atom({
  key: 'tetrominoState',
  default: getRandomTetromino(),
});

export const rotationState = atom({
  key: 'rotationState',
  default: 0, // 0: 0 degrees, 1: 90 degrees, 2: 180 degrees, 3: 270 degrees
});

export const boardState = atom({
  key: 'boardState',
  default: Array.from({ length: CELLS_HEIGHT }, () => Array(CELLS_WIDTH).fill(0)),
});

export const currentTetrominoState = atom<TetrominoShape | null>({
  key: 'currentTetrominoState',
  default: null,
});

export const nextTetrominoState = atom({
  key: 'nextTetrominoState',
  default: getRandomTetromino(),
});

export const tetrominoPositionState = atom({
  key: 'tetrominoPositionState',
  default: { x: CELLS_WIDTH / 2 - 2, y: -1 },
});

export const scoreState = atom({
  key: 'scoreState',
  default: 0,
});

export const levelState = atom({
  key: 'levelState',
  default: 1,
});

export const linesClearedState = atom({
  key: 'linesClearedState',
  default: 0,
});

export const isGameOverState = atom({
  key: 'isGameOverState',
  default: false,
});

export const isGamePausedState = atom({
  key: 'isGamePausedState',
  default: false,
});

export const isGameStartedState = atom({
  key: 'isGameStartedState',
  default: false,
});
