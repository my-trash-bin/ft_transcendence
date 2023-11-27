import express from 'express';
import { createServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { BALL_SIZE, BOARD_HEIGHT, BOARD_WIDTH, DEFAULT_SPEED, PADDLE_HEIGHT, PADDLE_STRIKE, PADDLE_WIDTH, SMASH_SPEED } from './gameConstants';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:53000", // 클라이언트 url
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 게임 상태
let gameState = {
    ball: { x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2 },
    velocity: { x: DEFAULT_SPEED, y: DEFAULT_SPEED / 2 },
    paddle1: { y: 200 },
    paddle2: { y: 200 },
    score1: 0,
    score2: 0,
    gameOver: false,
};

// 게임 로비 정보
let lobby = {
  player1: null as any, // 플레이어 1
  player2: null as any, // 플레이어 2
};

io.on('connection', (socket: Socket) => {
  
  socket.on('connect_error', (err) => {
    console.log('Connection Error:', err.message);
  });
  
  console.log('A user connected');
  socket.on('joinLobby', () => {
    console.log('User entered the lobby');
    if (!lobby.player1) {
      lobby.player1 = socket;
      socket.emit('waitingForPlayer');
      socket.emit('playerRole', 'player1');
    } else if (!lobby.player2) {
      lobby.player2 = socket;
      socket.emit('matchFound', { role: 'player2' });
      lobby.player1.emit('matchFound', { role: 'player1' });
      lobby.player2.emit('playerRole', 'player2');
      lobby.player1.emit('playerRole', 'player1');

      // 게임 초기화 및 시작 로직
    }

    socket.on('disconnect', () => {
      console.log('User disconnected');
      // 사용자가 로비에서 나갈 때 해당 로비 정보 업데이트
      if (lobby.player1 === socket) {
        lobby.player1 = null;
      }
      if (lobby.player2 === socket) {
        lobby.player2 = null;
      }
    });
  });
});

function checkPaddleCollision(paddleCenter : number, ballY : number) {
  const deltaY = Math.abs(ballY - paddleCenter);

  // 중앙에 가까우면 스매시, 아니면 기본 속도
  if (deltaY < PADDLE_HEIGHT / PADDLE_STRIKE) {
    return SMASH_SPEED;
  } else {
    return DEFAULT_SPEED;
  }
}

function updateGameLogic() {
  //  ============================= 공의 움직임 업데이트 =============================
  gameState.ball.x += gameState.velocity.x;
  gameState.ball.y += gameState.velocity.y;

  // ============================= X축 경계 체크 =============================
  if (gameState.ball.x < 0 || gameState.ball.x > BOARD_WIDTH - BALL_SIZE) {

    // 점수 업데이트 및 공 위치 초기화
    if (gameState.ball.x < 0) gameState.score2++;
    else gameState.score1++;

    // 공을 중앙에 위치
    gameState.ball.x = BOARD_WIDTH / 2 - BALL_SIZE / 2;
    gameState.ball.y = BOARD_HEIGHT / 2 - BALL_SIZE / 2;

    // 공의 속도 초기화
    if (Math.abs(gameState.velocity.x) > DEFAULT_SPEED) {
      gameState.velocity.x = DEFAULT_SPEED * (gameState.velocity.x < 0 ? -1 : 1);
    }
    gameState.velocity.y = DEFAULT_SPEED / 2;

    // 점수 합이 짝수일 때 X축 속도 방향을 반전
    if ((gameState.score1 + gameState.score2) % 2 === 0) {
      gameState.velocity.x = -gameState.velocity.x;
    }

    // 게임 종료 체크
    if (gameState.score1 === 10 || gameState.score2 === 10) {
      gameState.gameOver = true;
    }
  }
  //  ============================= Y축 경계 체크 =============================
  if (gameState.ball.y < 0 || gameState.ball.y > BOARD_HEIGHT - BALL_SIZE - 1) {
    gameState.velocity.y = -gameState.velocity.y;
  }
  //  ============================= 패들 충돌 로직 =============================
  // 플레이어 1의 패들과의 충돌 체크
  const paddle1Center = gameState.paddle1.y + PADDLE_HEIGHT / 2;
  if (gameState.ball.x <= PADDLE_WIDTH + 10 &&
      gameState.ball.y + BALL_SIZE >= gameState.paddle1.y &&
      gameState.ball.y <= gameState.paddle1.y + PADDLE_HEIGHT) {
    gameState.velocity.x = checkPaddleCollision(paddle1Center, gameState.ball.y);
    gameState.ball.x = PADDLE_WIDTH + BALL_SIZE;
  }

  // 플레이어 2의 패들과의 충돌 체크
  const paddle2Center = gameState.paddle2.y + PADDLE_HEIGHT / 2;
  if (gameState.ball.x + BALL_SIZE >= BOARD_WIDTH - PADDLE_WIDTH - 10 &&
      gameState.ball.y + BALL_SIZE >= gameState.paddle2.y &&
      gameState.ball.y <= gameState.paddle2.y + PADDLE_HEIGHT) {

    gameState.velocity.x = -checkPaddleCollision(paddle2Center, gameState.ball.y);
    gameState.ball.x = BOARD_WIDTH - PADDLE_WIDTH - BALL_SIZE * 2;
  }

  //  ============================= 클라이언트에게 상태 업데이트 전송 =============================
  io.emit('gameUpdate', gameState);
}

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });

  socket.on('paddleMove', (data) => {
    if (data.player === 'player1') {
      gameState.paddle1.y = data.paddleY;
    } else if (data.player === 'player2') {
      gameState.paddle2.y = data.paddleY;
    }

    // 필요한 경우 게임 상태를 업데이트하고, 모든 클라이언트에 상태를 전송
    io.emit('gameUpdate', gameState);
  });
});

// 주기적으로 게임 상태 업데이트
setInterval(() => {
    if (!gameState.gameOver) {
        updateGameLogic();
        io.emit('gameUpdate', gameState);
    }
}, 1000 / 60); // 60FPS

httpServer.listen(8080, () => {
  console.log('Listening on *:8080');
});
