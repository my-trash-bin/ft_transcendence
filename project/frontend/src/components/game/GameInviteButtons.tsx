import { ReactNode, useCallback, useState } from 'react';
import { Button } from '../common/Button';

export function GameInviteButtons({
  content,
  setGameMode,
  handleInviteOpen,
  isModal,
}: {
  readonly content: ReactNode;
  readonly setGameMode: (mode: 'normal' | 'item') => void;
  readonly handleInviteOpen: () => void;
  readonly isModal: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const layout = isModal
    ? 'flex felx-row left-[-30px]'
    : 'flex flex-col bottom-[-15px]';
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
      className={`relative w-[75px] h-[30px]`}
    >
      {isHovered ? (
        <div className={`absolute ${layout}`}>
          <Button onClick={() => startNormal()} isModal={isModal}>
            {'일반모드'}
          </Button>
          <Button onClick={() => startItem()} isModal={isModal}>
            {'아이템모드'}
          </Button>
        </div>
      ) : (
        <Button isModal={isModal}>{content}</Button>
      )}
    </div>
  );
}
