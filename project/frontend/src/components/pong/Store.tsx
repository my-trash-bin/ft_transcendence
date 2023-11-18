import { create } from 'zustand'

// 게임 보드
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 500;

// 패들
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 5;
const PADDLE_STRIKE = 4;

// 공
const BALL_SIZE = 15;
const DEFAULT_SPEED = 3;
const SMASH_SPEED = 8;

interface GameState {
  ball: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  paddle1: {
    y: number;
  };
  paddle2: {
    y: number;
  };
  score1: number;
  score2: number;
  gameOver: boolean;
  moveBall: (x:number, y:number) => void;
  movePaddle1: (dy: number) => void;
  movePaddle2: (dy: number) => void;
  incrementScore1: () => void;
  incrementScore2: () => void;
}


const checkPaddleBounds = (paddleY: number): number => {
  const minY = 0;
  const maxY = BOARD_HEIGHT - PADDLE_HEIGHT - 4;
  return Math.min(Math.max(paddleY, minY), maxY);
};

const checkPaddleCollision = (paddleCenter: number, ballY: number): number => {
  const deltaY = Math.abs(ballY - paddleCenter);

  // 중앙에 가까우면 스매시, 아니면 기본 속도
  if (deltaY < PADDLE_HEIGHT / PADDLE_STRIKE) {
    return SMASH_SPEED;
  } else {
    return DEFAULT_SPEED;
  }
};

const useStore = create<GameState>(set => ({
  // 초기 상태
  gameOver: false,
  ball: { x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2 },
  velocity: { x: DEFAULT_SPEED, y: DEFAULT_SPEED / 2 },
  paddle1: { y: 200 },
  paddle2: { y: 200 },
  score1: 0,
  score2: 0,

  moveBall: () => set(state => {
    let newX = state.ball.x + state.velocity.x;
    let newY = state.ball.y + state.velocity.y;

    if (state.gameOver) {
      // 공을 중앙에 위치시키고, 속도 초기화
      state.ball.x = BOARD_WIDTH / 2 - BALL_SIZE / 2;
      state.ball.y = BOARD_HEIGHT / 2 - BALL_SIZE / 2;
      state.paddle1.y = 200;
      state.paddle2.y = 200;
      return {
        ...state,
        gameOver: true,
        // 여기에 게임 종료 후 필요한 추가적인 처리를 포함할 수 있음
      };
    }
    // X축 경계 체크 (게임 보드의 좌우 경계) ----------------------- 함수 1
    if (newX < 0 || newX > BOARD_WIDTH - BALL_SIZE - 1) {
      // 왼쪽 경계에 닿았을 경우 플레이어 2의 점수 증가
      if (newX < 0) {
        state.score2 += 1;
      }
      // 오른쪽 경계에 닿았을 경우 플레이어 1의 점수 증가
      else {
        state.score1 += 1;
      }

      // 공을 중앙에 위치시키고, 속도 초기화
      newX = BOARD_WIDTH / 2 - BALL_SIZE / 2;
      newY = BOARD_HEIGHT / 2 - BALL_SIZE / 2;
      state.paddle1.y = 200;
      state.paddle2.y = 200;

      // 서브 방향 변경
      state.velocity.x = state.velocity.x < 0 ? -DEFAULT_SPEED : DEFAULT_SPEED;
      if ((state.score1 + state.score2) % 2 == 0) {
        state.velocity.x *= -1;
      }
      // 초기 Y축 속도
      state.velocity.y = DEFAULT_SPEED / 2;
    }
    if (state.score1 === 10 || state.score2 === 10) {
      // 게임 종료 상태를 true로 설정
      // 공을 중앙에 위치시키고, 속도 초기화
      newX = BOARD_WIDTH / 2 - BALL_SIZE / 2;
      newY = BOARD_HEIGHT / 2 - BALL_SIZE / 2;
      state.paddle1.y = 200;
      state.paddle2.y = 200;
      return {
        ...state,
        gameOver: true,
        // 여기에 게임 종료 후 필요한 추가적인 처리를 포함할 수 있음
      };
    }

    // Y축 경계 체크 (게임 보드의 상하 경계) ----------------------- 함수 2
    if (newY < 0 || newY > BOARD_HEIGHT - BALL_SIZE - 1) {
      // Y축 방향 반전
      state.velocity.y *= -1;
      // newY = state.ball.y + state.velocity.y;
    }

    // 패들 충돌 체트  ----------------------- 함수 3
    const paddle1Center = state.paddle1.y + PADDLE_HEIGHT / 2;
    const paddle2Center = state.paddle2.y + PADDLE_HEIGHT / 2;
    // 플레이어 1의 패들과의 충돌 체크
    if (
      newX <= PADDLE_WIDTH + 10 &&
      newY + BALL_SIZE >= state.paddle1.y &&
      newY <= state.paddle1.y + PADDLE_HEIGHT
    ) {
      state.velocity.x = checkPaddleCollision(paddle1Center, newY);
      newX = PADDLE_WIDTH + BALL_SIZE;
    }

    // 플레이어 2의 패들과의 충돌 체크
    else if (
      newX + BALL_SIZE >= BOARD_WIDTH - PADDLE_WIDTH - 10 &&
      newY + BALL_SIZE >= state.paddle2.y &&
      newY <= state.paddle2.y + PADDLE_HEIGHT
    ) {
      state.velocity.x = -checkPaddleCollision(paddle2Center, newY);
      newX = BOARD_WIDTH - PADDLE_WIDTH - BALL_SIZE * 2;
    }
    return {
      ...state,
      ball: {
        x: newX,
        y: newY,
      },
    };
  }),

  movePaddle1: (dy: number) => set(state => {
    const increasedSpeed = dy * PADDLE_SPEED;
    const newY = state.paddle1.y + increasedSpeed;
    const boundedY = checkPaddleBounds(newY);

    return {
      paddle1: {
        y: boundedY,
      },
    };
  }),

  movePaddle2: (dy: number) => set(state => {
    const increasedSpeed = dy * PADDLE_SPEED;
    const newY = state.paddle2.y + increasedSpeed;
    const boundedY = checkPaddleBounds(newY);
    return {
      paddle2: {
        y: boundedY,
      },
    };
  }),
  incrementScore1: () => set(state => ({ score1: state.score1 + 1 })),
  incrementScore2: () => set(state => ({ score2: state.score2 + 1 })),
}));

export default useStore;
