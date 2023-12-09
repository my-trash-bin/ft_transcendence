import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ModalLayout } from '../channel/modals/ModalLayout';
import useStore from '../pong/Update';
import { getGameSocket } from '../pong/gameSocket';

interface FriendInviteProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'normal' | 'item';
}

const FriendInvite: React.FC<FriendInviteProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const router = useRouter();
  const socket = getGameSocket();
  const { setIsPlayer1 } = useStore();

  useEffect(() => {
    const handleGoPong = () => {
      onClose();
      router.push('/pong');
    };

    const handlePlayerRole = (role: string) => {
      setIsPlayer1(role === 'player1');
      console.log('playerRole', role);
      socket.off('playerRole', handlePlayerRole);
    };
    socket.on('GoPong', handleGoPong);
    socket.on('playerRole', handlePlayerRole);
    return () => {
      socket.off('GoPong', handleGoPong);
      socket.off('playerRole', handlePlayerRole);
    };
  }, [onClose, router, setIsPlayer1, socket]);

  const size = 'py-sm px-lg w-[498px] h-[308px]';
  const textCSS = 'text-dark-purple text-h2';
  const alignCSS = 'items-center justify-center';
  const positionCSS = 'mx-auto';

  const hoverCSS = 'cursor-pointer';
  const txtPos = 'text-center mt-[80px]';
  const buttonCSS =
    'bg-dark-purple-interactive rounded-md \
  text-light-gray-interactive text-h2 \
  w-lg mt-[65pt] ml-[250pt]';

  let content = mode === 'normal' ? '일반' : '아이템';

  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="500px"
      height="300px"
    >
      <div className={`${textCSS} ${alignCSS} ${positionCSS} ${size} `}>
        <div className={`${txtPos}`}>
          <p>{content} 게임으로 친구를 초대하였습니다.</p>
        </div>
        <button className={`${buttonCSS} ${hoverCSS}`} onClick={onClose}>
          닫기
        </button>
      </div>
    </ModalLayout>
  );
};

export default FriendInvite;
