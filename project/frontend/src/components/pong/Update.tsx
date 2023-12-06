import { create } from 'zustand';
import {
  BALL_SIZE,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  DEFAULT_SPEED,
  GameState,
  PADDLE_WIDTH,
  PlayerInfo,
} from './gameConstants';

interface ExtendedGameState extends GameState {
  isPlayer1: boolean;
  setIsPlayer1: (isPlayer1: boolean) => void;
  setGameState: (newState: GameState) => void;
  setGameOver: (gameOver: boolean) => void;
  player1Info: PlayerInfo;
  player2Info: PlayerInfo;
  setplayer1Info: (playerInfo: PlayerInfo) => void;
  setplayer2Info: (playerInfo: PlayerInfo) => void;
}

const useStore = create<ExtendedGameState>((set) => ({
  ball: {
    x: BOARD_WIDTH / 2 - BALL_SIZE / 2,
    y: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
    type: 0,
  },
  velocity: { x: DEFAULT_SPEED, y: DEFAULT_SPEED / 2 },
  paddle1: { x: PADDLE_WIDTH + 10, y: 200, type: 0 },
  paddle2: { x: BOARD_WIDTH - PADDLE_WIDTH - 10, y: 200, type: 0 },
  score1: 0,
  score2: 0,
  gameOver: false,
  gameStart: false,
  isPlayer1: true,
  isItemMode: false,
  pongItem: { x: 0, y: 0, type: 0 },
  player1Info: { nickname: '', avatarUrl: '' },
  player2Info: { nickname: '', avatarUrl: '' },

  setIsPlayer1: (isPlayer1) => set({ isPlayer1 }),
  setGameState: (newState) => set({ ...newState }),
  setGameOver: (gameOver) => set({ gameOver }),
  setplayer1Info: (playerInfo) => set({ player1Info: playerInfo }),
  setplayer2Info: (playerInfo) => set({ player2Info: playerInfo }),
}));

export default useStore;
