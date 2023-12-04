import Image from 'next/image';
import React, { use, useEffect } from 'react';
import usePaddleMovement from './KeyHandle';
import useStore from './Update';
import { BALL_SIZE, BOARD_HEIGHT, BOARD_WIDTH, GameState, PADDLE_HEIGHT, PADDLE_WIDTH } from './gameConstants';
import { getGameSocket } from './gameSocket';
import { useRouter } from 'next/navigation';

// npm run build && npx nest start --watch
const NormalBoard: React.FC = () => {
  const { ball, paddle1, paddle2, score1, score2, isPlayer1, setGameState} = useStore();
  const socket = getGameSocket();
  const router = useRouter();

  // console.log('mode = ', useStore.getState().mode);

  usePaddleMovement();

  const handleGameUpdate = (gameState: GameState) => {
    if (!gameState.gameStart) {
      console.log('game not started');
    } else if (!gameState.gameOver) {
      setGameState(gameState);
      console.log('isItemMode = ', gameState.isItemMode);
    } else {
      console.log('gameOver');
      router.push('/pong/gameOver');
    }
  };
  useEffect(() => {
    socket.on('gameUpdate', handleGameUpdate);

    return () => {
      socket.off('gameUpdate', handleGameUpdate);
    };
  }, []);

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
        <span className="text-2xl">{isPlayer1 ? score2 : score1} : {isPlayer1 ? score1 : score2}</span>
        {/* <span className="text-2xl">{score1} : {score2}</span> */}

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
          }}
        />

        {/* 상대 플레이어의 패들 내가 1이라면 2, 2라면 1*/}
        <div className={`absolute bg-dark-gray rounded-md`}
          style={{
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            left: '10px',
            right: 'auto',
            top: `${isPlayer1 ? paddle2.y : paddle1.y}px`,
          }}
        />

        {/* 현재 플레이어의 패들 : 1이면 1, 2이면 2*/}
        <div className={`absolute bg-dark-purple-interactive rounded-md`}
          style={{
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            left: 'auto',
            right: '10px',
            top: `${isPlayer1 ? paddle1.y : paddle2.y}px`,
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

export default NormalBoard;
