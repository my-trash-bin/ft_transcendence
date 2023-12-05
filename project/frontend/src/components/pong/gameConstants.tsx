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

// 아이템
export const ITEM_SIZE = 100;

// type 0: 아이템 없음
// type 1: 공 스피드 증가
// type 2: 점수 2배
// type 3: 패들 크기 감소

export interface GameState {
  ball: { x: number; y: number, type: number };
  velocity: { x: number; y: number };
  paddle1: { x: number; y: number, type: number };
  paddle2: { x: number; y: number, type: number };
  score1: number;
  score2: number;
  gameOver: boolean;
  gameStart : boolean;
  isItemMode: boolean;
  itemMap: { x: number; y: number, type: number };
}
