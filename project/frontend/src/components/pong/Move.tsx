import { useEffect, useRef } from 'react';
import useStore from './Store';
const PADDLE_MOVE_STEP = 0.5; // 움직임의 단계 크기 증가

const usePaddleMovement = () => {
  const movePaddle1 = useStore(state => state.movePaddle1);
  const movePaddle2 = useStore(state => state.movePaddle2);
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const updatePaddleMovement = () => {
      if (keysPressed.current.has('w')) {
        movePaddle1(-PADDLE_MOVE_STEP);
      }
      if (keysPressed.current.has('s')) {
        movePaddle1(PADDLE_MOVE_STEP);
      }
      if (keysPressed.current.has('ArrowUp')) {
        movePaddle2(-PADDLE_MOVE_STEP);
      }
      if (keysPressed.current.has('ArrowDown')) {
        movePaddle2(PADDLE_MOVE_STEP);
      }
      requestAnimationFrame(updatePaddleMovement);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.key);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key);
    };

    // 키보드 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    requestAnimationFrame(updatePaddleMovement);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [movePaddle1, movePaddle2]);

  return null;
};

export default usePaddleMovement;
