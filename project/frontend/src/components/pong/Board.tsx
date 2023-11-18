import React, { useEffect } from 'react';
import useStore from './Store';
import usePaddleMovement from './Move';
import Image from 'next/image';

// 게임 보드의 크기
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 500;

// 패들의 크기
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;

// 공의 크기
const BALL_SIZE = 15;

interface PlayerAvatarProps {
  avatarUrl: string;
  playerName: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ avatarUrl, playerName }) => {
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
  const { ball, velocity, moveBall, paddle1, paddle2, score1, score2 } = useStore();
  usePaddleMovement();
  useEffect(() => {
    let frameId: number;

    const update = () => {
      moveBall(velocity.x, velocity.y);
      frameId = requestAnimationFrame(update);
    };

    // 게임의 'gameOver' 상태에 대한 구독
    const unsubscribe = useStore.subscribe(
      (state) => {
        if (state.gameOver) {
          cancelAnimationFrame(frameId);
        }
      }
    );

    frameId = requestAnimationFrame(update);

    return () => {
      unsubscribe(); // 구독 해제
      cancelAnimationFrame(frameId); // 애니메이션 프레임 취소
    };
  }, [moveBall, velocity]);

  return (
    <div className="flex flex-col items-center mt-[50px]">
      <div className="flex items-center justify-between text-2xl font-bold text-dark-purple w-[800px]">
        {/* Player1 정보 (왼쪽 끝) */}
        <PlayerAvatar avatarUrl="/avatar/avatar-black.svg" playerName="Player1" />

        {/* 점수판 (중앙) */}
        <span>{score1} : {score2}</span>

        {/* Player2 정보 (오른쪽 끝) */}
        <PlayerAvatar avatarUrl="/avatar/avatar-black.svg" playerName="Player2" />
      </div>

      {/* 게임 보드 */}
      <div
        className="border-2 border-dark-purple relative rounded-md bg-white mt-[10px]"
        style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
      >
      {/* 공 */}
      <div className="absolute bg-dark-purple rounded-full"
            style={{ width: BALL_SIZE, height: BALL_SIZE, left: `${ball.x}px`, top: `${ball.y}px` }} />

      {/* 플레이어 1의 패들 */}
      <div className="absolute bg-dark-purple-interactive rounded-md"
            style={{ width: PADDLE_WIDTH, height: PADDLE_HEIGHT, left: '10px', top: `${paddle1.y}px` }} />

      {/* 플레이어 2의 패들 */}
      <div className="absolute bg-dark-purple-interactive rounded-md"
            style={{ width: PADDLE_WIDTH, height: PADDLE_HEIGHT, right: '10px', top: `${paddle2.y}px` }} />
      </div>
    </div>
  );
};

export default GameBoard;
