import { useEffect } from 'react';
import useStore from './Update';
import { getGameSocket } from './gameSocket';

const usePaddleMovement = () => {
  const { isPlayer1 } = useStore();

  useEffect(() => {
    const socket = getGameSocket();

    const handleKeyDown = (event: KeyboardEvent) => {
      const playerRole = isPlayer1 ? 'player1' : 'player2';
      if (event.key === 'w' || event.key === 'ArrowUp') {
        socket.emit('paddleMove', true);
      } else if (event.key === 's' || event.key === 'ArrowDown') {
        socket.emit('paddleMove', false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlayer1]);

  return null;
};

export default usePaddleMovement;
