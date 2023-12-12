import Image from 'next/image';
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import useStore from '../pong/Update';
import { getGameSocket } from '../pong/gameSocket';
import useMatching from '../common/useMatching';

const MatchingModal: React.FC = () => {
  const socket = getGameSocket();
  const { setIsPlayer1 } = useStore();
  const { isMatchingOpen, gameMode, closeMatching } = useMatching();

  useEffect(() => {
    const handlePlayerRole = (role: string) => {
      setIsPlayer1(role === 'player1');
      console.log('playerRole', role);
      socket.off('playerRole', handlePlayerRole);
    };
    socket.on('playerRole', handlePlayerRole);
    return () => {
      socket.off('playerRole', handlePlayerRole);
    };
  }, [socket, setIsPlayer1]);

  const handleModalClose = () => {
    socket.emit('cancelMatch', gameMode);
    console.log('cancelMatch');
    closeMatching();
  };

  const bgCSS = 'bg-default rounded-md';
  const size = 'py-sm px-lg w-[498px] h-[308px]';
  const borderCSS = 'border-dark-purple border-4';
  const textCSS = 'text-dark-purple text-h2';
  const alignCSS = 'items-center justify-center';
  const positionCSS = 'mx-auto mt-[200px]';

  const hoverCSS = 'cursor-pointer';
  const txtPos = 'text-center ';
  const buttonCSS =
    'bg-dark-purple-interactive rounded-md \
  text-light-gray-interactive text-h2 \
  w-lg mt-[65pt] ml-[250pt]';

  let content = gameMode === 'normal' ? '일반' : '아이템';

  return (
    <Modal
      isOpen={isMatchingOpen}
      onRequestClose={handleModalClose}
      shouldCloseOnOverlayClick={false}
      className="bg-transparent"
    >
      <div
        className={`${textCSS} ${alignCSS} ${positionCSS} ${borderCSS} ${size} ${bgCSS}`}
      >
        <div className="flex flex-row mt-[80px] items-center justify-center">
          <p className={`${txtPos}`}>{content} 매칭이 진행중입니다.</p>
          <Image
            src="/images/octo-loading.gif"
            width={50}
            height={50}
            alt="loading"
          />
        </div>
        <button className={`${buttonCSS} ${hoverCSS}`} onClick={handleModalClose}>
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default MatchingModal;
