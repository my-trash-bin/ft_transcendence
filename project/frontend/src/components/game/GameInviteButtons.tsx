import { ReactNode, useCallback, useState } from 'react';
import { Button } from '../common/Button';

export function DualFunctionButton({
  content,
  setGameMode,
  handleInviteOpen,
}: {
  readonly content: ReactNode;
  readonly setGameMode: (mode: 'normal' | 'item') => void;
  readonly handleInviteOpen: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const startNormal = useCallback(() => {
    setGameMode('normal');

    handleInviteOpen();
  }, [setGameMode, handleInviteOpen]);
  const startItem = useCallback(() => {
    setGameMode('item');

    handleInviteOpen();
  }, [setGameMode, handleInviteOpen]);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-[75px] h-[30px]"
    >
      {isHovered ? (
        <div className="absolute bottom-[-15px]">
          <Button onClick={() => startNormal()}>{'일반모드'}</Button>
          <Button onClick={() => startItem()}>{'아이템모드'}</Button>
        </div>
      ) : (
        <Button>{content}</Button>
      )}
    </div>
  );
}
