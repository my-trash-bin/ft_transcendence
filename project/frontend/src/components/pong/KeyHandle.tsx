import { useEffect } from 'react';
import { getGameSocket } from './gameSocket';

const usePaddleMovement = () => {
  useEffect(() => {
    const socket = getGameSocket();

    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, []);

  return null;
};

export default usePaddleMovement;
