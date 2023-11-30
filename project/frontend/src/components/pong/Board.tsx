import Image from 'next/image';
import React, { useEffect } from 'react';
import usePaddleMovement from './KeyHandle';
import useStore from './Update';
import { BALL_SIZE, BOARD_HEIGHT, BOARD_WIDTH, GameState, PADDLE_HEIGHT, PADDLE_WIDTH } from './gameConstants';
import { getGameSocket } from './gameSocket';

const GameBoard: React.FC = () => {
  const { ball, paddle1, paddle2, score1, score2, isPlayer1 } = useStore();
  usePaddleMovement();
  const { setIsPlayer1 } = useStore();

  useEffect(() => {
    const socket = getGameSocket();
    socket.emit('joinLobby');
  
    // 서버로부터 플레이어 역할 정보를 받았을 때
    socket.on('playerRole', (role) => {
      if (role == 'player1') {
        setIsPlayer1(true);
      } else {
        setIsPlayer1(false);
      }
      console.log(`Am I player 1? ${isPlayer1}`);
    });

    socket.on('gameUpdate', (data: GameState) => {
      useStore.setState(data);
      if (data.gameOver) {
        // 일단은 끝내자마자 바로 시작하도록 만듦
        socket.emit('restartGame');
      }
    });

    return () => {
      socket.off('gameUpdate');
      socket.off('playerRole');
    };
  }, [setIsPlayer1, isPlayer1]);

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
          style={{ width: BALL_SIZE, 
            height: BALL_SIZE,
            left: isPlayer1 ? `${BOARD_WIDTH - PADDLE_WIDTH - 10 - ball.x}px` : `${ball.x}px`,
            top: `${ball.y}px`
          }} />
  
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

export default GameBoard;