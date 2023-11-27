import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import usePaddleMovement from './Move';
import useStore from './Paddle';
import { GameState, BALL_SIZE, BOARD_HEIGHT, BOARD_WIDTH, PADDLE_HEIGHT, PADDLE_WIDTH } from './gameConstants';

interface PlayerAvatarProps {
  avatarUrl: string;
  playerName: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  avatarUrl,
  playerName,
}) => {
  return (
    <div className="flex items-center">
      <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden mr-[10px]">
        <Image
          src={avatarUrl}
          alt={`${playerName} Avatar`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <span className="text-lg font-medium">{playerName}</span>
    </div>
  );
};

const GameBoard: React.FC = () => {
  const { ball, paddle1, paddle2, score1, score2, isPlayer1 } = useStore();
  usePaddleMovement();
  const previousStateRef = useRef<GameState | null>(null);
  const { setIsPlayer1 } = useStore();

  useEffect(() => {
    // Socket.IO 클라이언트 연결
    const socket = io('localhost', { withCredentials: true });

    // 연결이 성공적으로 수립되었을 때
    socket.on('connect', () => {
      console.log('Connected to the game server');
    });
    socket.emit('joinLobby');

    // 서버로부터 플레이어 역할 정보를 받았을 때
    socket.on('playerRole', (role: string) => {
      // 서버로부터 받은 역할 정보를 기반으로 플레이어 역할을 설정
      setIsPlayer1(role === 'player1');
      console.log(`You are ${role}`);
    });

    // 서버로부터 게임 상태 업데이트를 받았을 때
    socket.on('gameUpdate', (data: GameState) => {
      useStore.setState({
        paddle1: data.paddle1,
        paddle2: data.paddle2,
        ball: data.ball,
        velocity: data.velocity,
        score1: data.score1,
        score2: data.score2,
        gameOver: data.gameOver,
      });
    });

    // 연결이 끊어졌을 때
    socket.on('disconnect', () => {
      console.log('Disconnected from the game server');
    });

    const unsubscribe = useStore.subscribe((state: GameState) => {
      const previousState = previousStateRef.current;

      // 플레이어 1인 경우
      if (isPlayer1) {
        // 플레이어 1의 패들 위치가 변경되었는지 확인
        if (previousState && state.paddle1.y !== previousState.paddle1.y) {
          // 현재 사용자(Player1)의 패들 위치를 서버에 전송
          socket.emit('paddleMove', { paddleY: state.paddle1.y });
        }
      }
      // 플레이어 2인 경우
      else {
        // 플레이어 2의 패들 위치가 변경되었는지 확인
        if (previousState && state.paddle2.y !== previousState.paddle2.y) {
          // 현재 사용자(Player2)의 패들 위치를 서버에 전송
          socket.emit('paddleMove', { paddleY: state.paddle2.y });
        }
      }

      // 현재 상태를 이전 상태로 업데이트
      previousStateRef.current = state;
    });

    return () => {
      socket.disconnect();
      unsubscribe(); // 구독 해제
    };
  }, [setIsPlayer1, isPlayer1]); // 의존성 배열 업데이트

  return (
    <div className="flex flex-col items-center mt-[50px] font-bold text-dark-purple-interactive text-dark-purple-interactive">
      {/* 플레이어 정보 및 점수판 (게임 보드 위에 일렬로 표시) */}
      <div className="flex items-center justify-between w-[800px]">
        {/* 상대방 플레이어 아바타 (왼쪽에 항상 표시) */}
        <PlayerAvatar
          avatarUrl="/avatar/avatar-black.svg"
          playerName={isPlayer1 ? "Player2" : "Player1"}
        />
  
        {/* 점수판 (중앙) */}
        <span className="text-2xl">{score1} : {score2}</span>
  
        {/* 현재 플레이어 아바타 (오른쪽에 항상 표시) */}
        <PlayerAvatar
          avatarUrl="/avatar/avatar-black.svg"
          playerName={isPlayer1 ? "Player1" : "Player2"}
        />
      </div>
  
      {/* 게임 보드 */}
      <div className="border-2 border-dark-purple-interactive relative rounded-md bg-white mt-[10px]"
        style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }} >
  
        {/* 공 */}
        <div className="absolute bg-dark-purple-interactive rounded-full"
          style={{ width: BALL_SIZE, height: BALL_SIZE, left: `${ball.x}px`, top: `${ball.y}px` }} />
  
        {/* 현재 플레이어의 패들 */}
        <div className={`absolute bg-dark-purple-interactive rounded-md`}
          style={{
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            left: isPlayer1 ? 'auto' : '10px',
            right: isPlayer1 ? '10px' : 'auto',
            top: `${isPlayer1 ? paddle1.y : paddle2.y}px`,
          }}
        />
  
        {/* 상대 플레이어의 패들 */}
        <div className={`absolute bg-dark-purple-interactive rounded-md`}
          style={{
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            left: isPlayer1 ? '10px' : 'auto',
            right: isPlayer1 ? 'auto' : '10px',
            top: `${isPlayer1 ? paddle2.y : paddle1.y}px`,
          }}
        />
      </div>
    </div>
  );  
};

export default GameBoard;