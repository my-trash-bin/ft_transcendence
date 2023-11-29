// 게임 보드
export const BOARD_WIDTH = 800;
export const BOARD_HEIGHT = 500;

// 패들
export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 80;
export const PADDLE_SPEED = 5;
export const PADDLE_STRIKE = 4;

// 공
export const BALL_SIZE = 15;
export const DEFAULT_SPEED = 3;
export const SMASH_SPEED = 8;

export interface GameState {
  ball: { x: number; y: number };
  velocity: { x: number; y: number };
  paddle1: { x: number; y: number };
  paddle2: { x: number; y: number };
  score1: number;
  score2: number;
  gameOver: boolean;
}
