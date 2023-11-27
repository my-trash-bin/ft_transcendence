import { useEffect, useRef } from 'react';
import useStore from './Paddle';

const PADDLE_MOVE_STEP = 0.5; // 움직임의 단계 크기 증가

const usePaddleMovement = () => {
  const { isPlayer1, movePaddle1, movePaddle2 } = useStore();
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const updatePaddleMovement = () => {
      if (isPlayer1) {
        // 플레이어 1의 패들 움직임 처리
        if (keysPressed.current.has('w') || keysPressed.current.has('ArrowUp')) {
          movePaddle1(-PADDLE_MOVE_STEP);
        }
        if (keysPressed.current.has('s') || keysPressed.current.has('ArrowDown')) {
          movePaddle1(PADDLE_MOVE_STEP);
        }
      } else {
        // 플레이어 2의 패들 움직임 처리
        if (keysPressed.current.has('w') || keysPressed.current.has('ArrowUp')) {
          movePaddle2(-PADDLE_MOVE_STEP);
        }
        if (keysPressed.current.has('s') || keysPressed.current.has('ArrowDown')) {
          movePaddle2(PADDLE_MOVE_STEP);
        }
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
  }, [isPlayer1, movePaddle1, movePaddle2]);

  return null;
};

export default usePaddleMovement;