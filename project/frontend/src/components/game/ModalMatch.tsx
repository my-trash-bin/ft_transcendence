import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import useStore from '../pong/Update';
import { getGameSocket } from '../pong/gameSocket';

interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'normal' | 'item';
}

const MatchingModal: React.FC<MatchingModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const router = useRouter();
  const socket = getGameSocket();
  const { setIsPlayer1 } = useStore();

  useEffect(() => {
    if (isOpen) {
      if (mode === 'normal') {
        socket.emit('joinNormalMatch');
        console.log('joinNormalMatch');
      } else if (mode === 'item') {
        socket.emit('joinItemMatch');
        console.log('joinItemMatch');
      }
    }
  }, [isOpen, onClose, router, socket, mode]);

  useEffect(() => {
    console.log({ test: 'HELLO WORLD!' });
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

  const bgCSS = 'bg-default rounded-md';
  const size = 'py-sm px-lg w-[498px] h-[308px]';
  const borderCSS = 'border-dark-purple border-4';
  const textCSS = 'text-dark-purple text-h2';
  const alignCSS = 'items-center justify-center';
  const positionCSS = 'mx-auto mt-[200px]';

  const hoverCSS = 'cursor-pointer';
  const txtPos = 'text-center mt-[80px]';
  const buttonCSS =
    'bg-dark-purple-interactive rounded-md \
  text-light-gray-interactive text-h2 \
  w-lg mt-[65pt] ml-[250pt]';

  let content = mode === 'normal' ? '일반' : '아이템';

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      className="bg-transparent"
    >
      <div
        className={`${textCSS} ${alignCSS} ${positionCSS} ${borderCSS} ${size} ${bgCSS}`}
      >
        <div className={`${txtPos}`}>
          <p>{content} 매칭이 진행중입니다.</p>
        </div>
        <button className={`${buttonCSS} ${hoverCSS}`} onClick={onClose}>
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default MatchingModal;
