// events.game.ts
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

// 게임 상수
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 500;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;
const DEFAULT_SPEED = 3;
const SMASH_SPEED = 8;
const PADDLE_STRIKE = 4;
const PADDLE_MOVE_STEP = 20; 
// const PADDLE_MOVE_STEP = 0.5; // 움직임의 단계 크기 증가

export interface GameState {
  ball: { x: number; y: number };
  velocity: { x: number; y: number };
  paddle1: { x: number, y: number };
  paddle2: { x: number, y: number };
  score1: number;
  score2: number;
  gameOver: boolean;
}

@Injectable()
export class GameService {
  readonly onGameUpdate = new EventEmitter();

  private gameState: GameState = {
    ball: { x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2 },
    velocity: { x: DEFAULT_SPEED, y: DEFAULT_SPEED / 2 },
    paddle1: { x: PADDLE_WIDTH + 10, y: 200 },
    paddle2: { x: BOARD_WIDTH - PADDLE_WIDTH - 10, y: 200 },
    score1: 0,
    score2: 0,
    gameOver: false,
  };

  constructor() {
    this.startGameLoop();
  }
  
  resetGame() {
    this.gameState.score1 = 0;
    this.gameState.score2 = 0;
    this.gameState.gameOver = false;
    this.resetPosition();
    this.onGameUpdate.emit('gameState', this.gameState);
  }
  
  private startGameLoop() {
    setInterval(() => {
      this.updateGameLogic();
    }, 1000 / 60); // 초당 60번 업데이트
  }
  
  handlePaddleMove(direction: 'up' | 'down', player: 'player1' | 'player2') {
    const deltaY = direction === 'up' ? -PADDLE_MOVE_STEP : PADDLE_MOVE_STEP;
    const paddle = player === 'player1' ? this.gameState.paddle1 : this.gameState.paddle2;
    const newY = this.checkPaddleBounds(paddle.y + deltaY);
    paddle.y = newY;
    this.updateGameLogic();
}

  private checkPaddleBounds(paddleY: number): number {
    const minY = 0;
    const maxY = BOARD_HEIGHT - PADDLE_HEIGHT - 4;
    return Math.min(Math.max(paddleY, minY), maxY);
  }

  getGameState() {
    return this.gameState;
  }

  private updateGameLogic() {
    // 공의 위치 업데이트
    this.gameState.ball.x += this.gameState.velocity.x;
    this.gameState.ball.y += this.gameState.velocity.y;

    // 경계 체크 및 처리
    this.checkBoundaries();

    // 패들 충돌 처리
    this.checkPaddleCollisions();

    // 게임 업데이트
    this.onGameUpdate.emit('gameState', this.gameState);
    // console.log('After update:', this.gameState);
  }

  private checkBoundaries() {
    // X축 경계 체크
    if (this.gameState.ball.x < 4 || this.gameState.ball.x > BOARD_WIDTH - BALL_SIZE - 4) {
      this.handleXAxisBoundary();
    }

    // Y축 경계 체크
    if (this.gameState.ball.y < 0 || this.gameState.ball.y > BOARD_HEIGHT - BALL_SIZE - 4) {
      this.gameState.velocity.y = -this.gameState.velocity.y;
    }
  }

  private handleXAxisBoundary() {
    // 점수 업데이트
    if (this.gameState.ball.x < 4) {
      this.gameState.score2++;
    } else {
      this.gameState.score1++;
    }

    // 공과 패들을 중앙에 위치
    this.resetPosition();

    // 점수 합이 짝수일 때 X축 속도 방향을 반전
    if ((this.gameState.score1 + this.gameState.score2) % 2 == 0) {
      this.gameState.velocity.x = -this.gameState.velocity.x;
    }

    // 게임 종료 체크
    this.checkGameOver();
  }

  private resetPosition() {
    this.gameState.ball.x = BOARD_WIDTH / 2 - BALL_SIZE / 2;
    this.gameState.ball.y = BOARD_HEIGHT / 2 - BALL_SIZE / 2;
    this.gameState.velocity.x = DEFAULT_SPEED * (this.gameState.velocity.x < 0 ? -1 : 1);
    this.gameState.velocity.y = DEFAULT_SPEED / 2;
    this.gameState.paddle1.y = 200;
    this.gameState.paddle2.y = 200;
  }

  private checkGameOver() {
    if (this.gameState.score1 === 11 || this.gameState.score2 === 11) {
      this.gameState.gameOver = true;
      this.onGameUpdate.emit('gameState', this.gameState);
    }
  }

  private checkPaddleCollisions() {
    // 플레이어 1의 패들과의 충돌 체크
    const paddle1Center = this.gameState.paddle1.y + PADDLE_HEIGHT / 2;
    if (this.gameState.ball.x <= this.gameState.paddle1.x &&
        this.gameState.ball.y + BALL_SIZE >= this.gameState.paddle1.y &&
        this.gameState.ball.y <= this.gameState.paddle1.y + PADDLE_HEIGHT) {
      this.gameState.velocity.x = this.checkSmash(paddle1Center, this.gameState.ball.y);
      this.gameState.ball.x = PADDLE_WIDTH + BALL_SIZE;
    }

    // 플레이어 2의 패들과의 충돌 체크
    const paddle2Center = this.gameState.paddle2.y + PADDLE_HEIGHT / 2;
    if (this.gameState.ball.x + BALL_SIZE >= this.gameState.paddle2.x &&
        this.gameState.ball.y + BALL_SIZE >= this.gameState.paddle2.y &&
        this.gameState.ball.y <= this.gameState.paddle2.y + PADDLE_HEIGHT) {
      this.gameState.velocity.x = -this.checkSmash(paddle2Center, this.gameState.ball.y);
      this.gameState.ball.x = BOARD_WIDTH - PADDLE_WIDTH - BALL_SIZE * 2;
    }
  }

  private checkSmash(paddleCenter: number, ballY: number): number {
    const deltaY = Math.abs(ballY - paddleCenter);
    return deltaY < PADDLE_HEIGHT / PADDLE_STRIKE ? SMASH_SPEED : DEFAULT_SPEED;
  }
}

