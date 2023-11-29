import { create } from 'zustand';
import { GameState, BOARD_HEIGHT, BOARD_WIDTH, BALL_SIZE, PADDLE_WIDTH, DEFAULT_SPEED } from './gameConstants';

interface ExtendedGameState extends GameState {
  isPlayer1: boolean;
  setIsPlayer1: (isPlayer1: boolean) => void;
  setGameState: (newState: GameState) => void;
}

const useStore = create<ExtendedGameState>((set) => ({
  ball: { x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2 },
  velocity: { x: DEFAULT_SPEED, y: DEFAULT_SPEED / 2 },
  paddle1: { x: PADDLE_WIDTH + 10, y: 200 },
  paddle2: { x: BOARD_WIDTH - PADDLE_WIDTH - 10, y: 200 },
  score1: 0,
  score2: 0,
  gameOver: false,
  isPlayer1: true,

  setIsPlayer1: (isPlayer1) => set({ isPlayer1 }),

  // 서버로부터 게임 상태 업데이트 수신
  setGameState: (newState) => set({ ...newState }),
}));

export default useStore;
