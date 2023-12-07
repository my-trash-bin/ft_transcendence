// events.game.ts
import { EventEmitter } from 'events';
import { PrismaService } from '../base/prisma.service';

// 게임 상수
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 500;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const SMALL_PADDLE_HEIGHT = 50;
const SMALL_PADDLE_STRIKE = 2;
const BALL_SIZE = 15;
const DEFAULT_SPEED = 3;
const SMASH_SPEED = 8;
const PADDLE_STRIKE = 4;
const PADDLE_MOVE_STEP = 20;
const ITEM_SIZE = 100;
const GAME_OVER = 1;

export interface GameState {
  ball: { x: number; y: number; type: number };
  velocity: { x: number; y: number };
  paddle1: { x: number; y: number; type: number };
  paddle2: { x: number; y: number; type: number };
  score1: number;
  score2: number;
  gameOver: boolean;
  gameStart: boolean;
  isItemMode: boolean;
  pongItem: { x: number; y: number; type: number };
}

export class Pong {
  readonly onGameUpdate = new EventEmitter();

  private gameState: GameState;
  private player1Won: boolean;

  constructor(
    private readonly prisma: PrismaService,
    public readonly player1Id: string,
    public readonly player2Id: string,
    private IsItemMode: boolean,
    private readonly onEnd: () => void,
  ) {
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.player1Won = false;

    this.gameState = {
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
      gameStart: true,
      isItemMode: false,
      pongItem: { x: 0, y: 0, type: 0 },
    };
    this.gameInit();
    this.onGameUpdate.emit('gameState', this.gameState);
    this.startGameLoop();
  }

  private makeItemRandomPosition(): boolean {
    // item position = 200 ~ 600, 150 ~ 400
    const x = Math.floor(Math.random() * (600 - 150 + 1)) + 150;
    const y = Math.floor(Math.random() * (400 - 150 + 1)) + 150;

    // random type = 1, 2, 3
    const type = Math.floor(Math.random() * 3) + 1;

    // new item
    this.gameState.pongItem = { x, y, type };

    return false;
  }

  setIsItemMode(mode: boolean) {
    this.gameState.isItemMode = mode;
  }

  private startGameLoop() {
    console.log('startGameLoop');
    if (this.gameState.gameOver) {
      return;
    }

    this.setIsItemMode(this.IsItemMode);
    const interval = setInterval(() => {
      if (this.updateGameLogic()) {
        clearInterval(interval);
        (async () => {
          try {
            await this.prisma.pongGameHistory.create({
              data: {
                player1Id: this.player1Id,
                player2Id: this.player2Id,
                player1Score: this.gameState.score1,
                player2Score: this.gameState.score2,
                isPlayer1win: this.gameState.score1 === GAME_OVER,
              },
            });
          } catch (error) {
            console.error(error);
          } finally {
            this.onEnd();
          }
        })();
      }
    }, 1000 / 60);

    if (this.gameState.isItemMode) {
      const itemInterval = setInterval(() => {
        if (this.makeItemRandomPosition()) clearInterval(itemInterval);
      }, 3000);
    }
  }

  handlePaddleMove(directionIsUp: boolean, player1: boolean) {
    const deltaY = directionIsUp ? -PADDLE_MOVE_STEP : PADDLE_MOVE_STEP;

    const paddle = player1 ? this.gameState.paddle1 : this.gameState.paddle2;
    const newY = this.checkPaddleBounds(paddle.y + deltaY, paddle.type);
    paddle.y = newY;
    this.checkPaddleCollisions();
    this.onGameUpdate.emit('gameState', this.gameState);
  }

  private checkPaddleBounds(paddleY: number, type: number): number {
    const minY = 0;
    let maxY: number;

    if (type === 3) {
      maxY = BOARD_HEIGHT - SMALL_PADDLE_HEIGHT - 4;
    } else {
      maxY = BOARD_HEIGHT - PADDLE_HEIGHT - 4;
    }

    return Math.min(Math.max(paddleY, minY), maxY);
  }

  getGameState() {
    return this.gameState;
  }

  private moveBall() {
    if (this.gameState.ball.type === 1) {
      this.gameState.ball.x += this.gameState.velocity.x * 1.5;
      this.gameState.ball.y += this.gameState.velocity.y;
    } else {
      this.gameState.ball.x += this.gameState.velocity.x;
      this.gameState.ball.y += this.gameState.velocity.y;
    }
  }

  private updateGameLogic(): boolean {
    // 공의 위치 업데이트
    this.moveBall();

    // 아이템 충돌 체크
    this.checkItemCollision();

    // 경계 체크 및 처리
    this.checkBoundaries();

    // 패들 충돌 처리
    this.checkPaddleCollisions();

    // 게임 업데이트
    this.onGameUpdate.emit('gameState', this.gameState);

    return this.gameState.gameOver;
  }

  private checkBoundaries() {
    // X축 경계 체크
    if (
      this.gameState.ball.x < 4 ||
      this.gameState.ball.x > BOARD_WIDTH - BALL_SIZE - 4
    ) {
      this.handleXAxisBoundary();
    }

    // Y축 경계 체크
    if (
      this.gameState.ball.y < 0 ||
      this.gameState.ball.y > BOARD_HEIGHT - BALL_SIZE - 4
    ) {
      this.gameState.velocity.y = -this.gameState.velocity.y;
    }
  }

  private doubleScore() {
    if (this.gameState.ball.x < 4) {
      this.gameState.score2 += 2;
      this.gameState.paddle1.type = 0;
    } else {
      this.gameState.score1 += 2;
      this.gameState.paddle2.type = 0;
    }
  }

  private updateScore() {
    if (this.gameState.ball.type === 2) {
      this.doubleScore();
      return;
    }
    if (this.gameState.ball.x < 4) {
      this.gameState.score2++;
      this.gameState.paddle1.type = 0;
    } else {
      this.gameState.score1++;
      this.gameState.paddle2.type = 0;
    }
  }

  private handleXAxisBoundary() {
    // 점수 업데이트
    this.updateScore();

    // 공과 패들을 중앙에 위치, 아이템 초기화
    this.resetPosition();

    // 점수 합이 짝수일 때 X축 속도 방향을 반전
    if ((this.gameState.score1 + this.gameState.score2) % 2 == 0) {
      this.gameState.velocity.x = -this.gameState.velocity.x;
    }

    // 게임 종료 체크
    this.checkGameOver();
  }

  private gameInit() {
    this.resetPosition();
    this.gameState.pongItem = { x: 0, y: 0, type: 0 };
  }

  private resetPosition() {
    this.gameState.ball.x = BOARD_WIDTH / 2 - BALL_SIZE / 2;
    this.gameState.ball.y = BOARD_HEIGHT / 2 - BALL_SIZE / 2;
    this.gameState.velocity.x =
      DEFAULT_SPEED * (this.gameState.velocity.x < 0 ? -1 : 1);
    this.gameState.velocity.y = DEFAULT_SPEED / 2;
    this.gameState.paddle1.y = 200;
    this.gameState.paddle2.y = 200;
    this.gameState.ball.type = 0;
    this.gameState.paddle1.type = 0;
    this.gameState.paddle2.type = 0;
  }

  private checkGameOver() {
    if (
      !this.gameState.gameOver &&
      (this.gameState.score1 >= GAME_OVER || this.gameState.score2 >= GAME_OVER)
    ) {
      if (this.gameState.score1 >= GAME_OVER) {
        this.gameState.score1 = GAME_OVER;
      }
      if (this.gameState.score2 >= GAME_OVER) {
        this.gameState.score2 = GAME_OVER;
      }
      this.gameState.gameOver = true;
      this.player1Won = this.gameState.score1 === GAME_OVER;
      this.gameState.pongItem = { x: 0, y: 0, type: 0 };
      this.onGameUpdate.emit('gameState', this.gameState);
    }
  }

  private checkItemCollision() {
    if (!this.gameState.isItemMode || this.gameState.pongItem.type === 0) {
      return;
    }
    const ballLeft = this.gameState.ball.x;
    const ballRight = this.gameState.ball.x + BALL_SIZE;
    const ballTop = this.gameState.ball.y;
    const ballBottom = this.gameState.ball.y + BALL_SIZE;

    const item = this.gameState.pongItem;
    if (item) {
      const itemLeft = item.x;
      const itemRight = item.x + ITEM_SIZE;
      const itemTop = item.y;
      const itemBottom = item.y + ITEM_SIZE;

      // 아이템 충돌 감지
      const isCollision =
        ballRight >= itemLeft &&
        ballLeft <= itemRight &&
        ballBottom >= itemTop &&
        ballTop <= itemBottom;

      if (isCollision) {
        console.log('item collision');
        this.gameState.ball.type = item.type;
        this.gameState.pongItem = { x: 0, y: 0, type: 0 };
      }
    }
  }

  private checkPaddleCollisions() {
    // 플레이어 1의 패들과의 충돌 체크
    const paddleHeight =
      this.gameState.paddle1.type === 3 ? SMALL_PADDLE_HEIGHT : PADDLE_HEIGHT;
    const paddle1Center = this.gameState.paddle1.y + paddleHeight / 2;
    if (
      this.gameState.ball.x <= this.gameState.paddle1.x &&
      this.gameState.ball.y + BALL_SIZE >= this.gameState.paddle1.y &&
      this.gameState.ball.y <= this.gameState.paddle1.y + paddleHeight
    ) {
      this.gameState.velocity.x = this.checkSmash(
        paddle1Center,
        this.gameState.ball.y,
      );
      this.gameState.ball.x = PADDLE_WIDTH + BALL_SIZE;
      this.gameState.paddle1.type = this.gameState.ball.type;
    }

    // 플레이어 2의 패들과의 충돌 체크
    const paddle2Center = this.gameState.paddle2.y + paddleHeight / 2;
    if (
      this.gameState.ball.x + BALL_SIZE >= this.gameState.paddle2.x &&
      this.gameState.ball.y + BALL_SIZE >= this.gameState.paddle2.y &&
      this.gameState.ball.y <= this.gameState.paddle2.y + paddleHeight
    ) {
      this.gameState.velocity.x = -this.checkSmash(
        paddle2Center,
        this.gameState.ball.y,
      );
      this.gameState.ball.x = BOARD_WIDTH - PADDLE_WIDTH - BALL_SIZE * 2;
      this.gameState.paddle2.type = this.gameState.ball.type;
    }
  }

  private checkSmash(paddleCenter: number, ballY: number): number {
    const paddleHeight =
      this.gameState.paddle1.type === 3 ? SMALL_PADDLE_HEIGHT : PADDLE_HEIGHT;
    const paddleStrike =
      this.gameState.paddle1.type === 3 ? SMALL_PADDLE_STRIKE : PADDLE_STRIKE;
    const deltaY = Math.abs(ballY - paddleCenter);
    if (this.gameState.pongItem.type === 1) {
      return deltaY < paddleHeight / paddleStrike
        ? SMASH_SPEED * 1.2
        : DEFAULT_SPEED;
    } else {
      return deltaY < paddleHeight / paddleStrike ? SMASH_SPEED : DEFAULT_SPEED;
    }
  }
}
