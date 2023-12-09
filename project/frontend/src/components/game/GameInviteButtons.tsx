import { ReactNode, useCallback, useState } from 'react';
import { Button } from '../common/Button';
import { getGameSocket } from '../pong/gameSocket';

export function GameInviteButtons({
  content,
  setGameMode,
  handleInviteOpen,
  isModal,
  friendId,
}: {
  readonly content: ReactNode;
  readonly setGameMode: (mode: 'normal' | 'item') => void;
  readonly handleInviteOpen: () => void;
  readonly isModal: boolean;
  readonly friendId: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const socket = getGameSocket();

  const layout = isModal
    ? 'flex felx-row left-[-30px]'
    : 'flex flex-col bottom-[-15px]';
    
  const startNormal = useCallback(() => {
    socket.emit('inviteNormalMatch', friendId);
    setGameMode('normal');

    handleInviteOpen();
  }, [setGameMode, handleInviteOpen, friendId, socket]);

  const startItem = useCallback(() => {
    socket.emit('inviteItemMatch', friendId);
    setGameMode('item');

    handleInviteOpen();
  }, [setGameMode, handleInviteOpen, friendId, socket]);
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
