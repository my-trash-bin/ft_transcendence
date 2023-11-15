export type TetrominoShape = number[][];

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type Tetrominos = {
  [key in TetrominoType]: TetrominoShape;
};

export const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

// 나중에 적용해보기
export const cellColors: { [key: number]: string } = {
  0: 'bg-white-interactive', // I
  1: 'bg-dark-purple-interactive', // J
  2: 'bg-dark-gray-interactive', // L
  3: 'bg-dark-purple-interactive', // O
  4: 'bg-dark-gray-interactive', // S
  5: 'bg-dark-purple-interactive', // T
  6: 'bg-dark-gray-interactive', // Z
};

export const getRandomTetromino = (): TetrominoShape => {
  const tetrominosKeys = Object.keys(tetrominos) as TetrominoType[];
  const randomKey = tetrominosKeys[Math.floor(Math.random() * tetrominosKeys.length)];
  return tetrominos[randomKey];
};
