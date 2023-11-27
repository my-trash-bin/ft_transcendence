import { create } from 'zustand'
import { GameState, BOARD_HEIGHT, BOARD_WIDTH, BALL_SIZE, PADDLE_HEIGHT, PADDLE_SPEED, DEFAULT_SPEED } from './gameConstants';
import { io } from 'socket.io-client';

const socket = io('localhost', { withCredentials: true });

const checkPaddleBounds = (paddleY: number): number => {
  const minY = 0;
  const maxY = BOARD_HEIGHT - PADDLE_HEIGHT - 4;
  return Math.min(Math.max(paddleY, minY), maxY);
};

interface ExtendedGameState extends GameState {
  isPlayer1: boolean;
  setIsPlayer1: (isPlayer1: boolean) => void;
  setGameState: (newState: GameState) => void;
  movePaddle1: (dy: number) => void;
  movePaddle2: (dy: number) => void;
}

const useStore = create<ExtendedGameState>((set) => ({
  ball: { x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2 },
  velocity: { x: DEFAULT_SPEED, y: DEFAULT_SPEED / 2 },
  paddle1: { y: 200 },
  paddle2: { y: 200 },
  score1: 0,
  score2: 0,
  gameOver: false,
  isPlayer1: true,

  setIsPlayer1: (isPlayer1) => set({ isPlayer1 }),

  // 서버로부터 게임 상태 업데이트 수신
  setGameState: (newState: GameState) => set({ ...newState }),

  // 패들 움직임 (서버로 전송)
  movePaddle1: (dy: number) => {
    const state = useStore.getState();
    const newY = checkPaddleBounds(state.paddle1.y + dy * PADDLE_SPEED);
    set(state => ({ ...state, paddle1: { ...state.paddle1, y: newY } }));
  },
  
  movePaddle2: (dy: number) => {
    const state = useStore.getState();
    const newY = checkPaddleBounds(state.paddle2.y + dy * PADDLE_SPEED);
    set(state => ({ ...state, paddle2: { ...state.paddle2, y: newY } }));
  },
}));

// 게임 상태 업데이트 수신
socket.on('gameUpdate', (gameState: GameState) => {
  useStore.getState().setGameState(gameState);
});

export default useStore;