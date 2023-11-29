import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import useStore from './Update';
import { getGameSocket } from './gameSocket';
import { getSocket } from '@/lib/Socket';

const usePaddleMovement = () => {
  const socketRef = useRef<Socket | null>(null);
  const { isPlayer1 } = useStore(); // 상태 저장소에서 현재 플레이어의 역할을 가져옴

  useEffect(() => {
    socketRef.current = getGameSocket();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (socketRef.current) {
        const playerRole = isPlayer1 ? 'player1' : 'player2'; // 플레이어 역할 결정
        if (event.key === 'w' || event.key === 'ArrowUp') {
          socketRef.current.emit('paddleMove', { direction: 'up', player: playerRole });
        } else if (event.key === 's' || event.key === 'ArrowDown') {
          socketRef.current.emit('paddleMove', { direction: 'down', player: playerRole });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isPlayer1]);

  return null;
};

export default usePaddleMovement;
