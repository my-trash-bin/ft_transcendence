import React from 'react';
import useMatching from '../common/useMatching';
import { getGameSocket } from '../pong/gameSocket';

interface ButtonComponentProps {
  mode: 'normal' | 'item';
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ mode }) => {
  const { openMatching: setisMatchingOpen, setGameMode } = useMatching();
  const socket = getGameSocket();

  const handleButtonClick = () => {
    setGameMode(mode);
    if (mode === 'normal') {
      socket.emit('joinNormalMatch');
      console.log('joinNormalMatch');
    } else if (mode === 'item') {
      socket.emit('joinItemMatch');
      console.log('joinItemMatch');
    }
    setisMatchingOpen(true);
  };

  let content = mode === 'normal' ? '일반 게임' : '아이템 게임';

  const bgCSS = 'bg-default-interactive rounded-md';
  const sizeCSS = 'w-[200px] h-[60px]';
  const borderCSS = 'border-3 border-dark-purple-interactive';
  const textCSS = 'text-dark-purple-interactive text-h2 font-taebaek';
  const hoverCSS =
    'cursor-pointer transition-all duration-300 ease-in-out hover:shadow-custom hover:-translate-y-[0.148rem]';

  return (
    <div>
      <button
        className={`${textCSS} ${borderCSS} ${hoverCSS} ${sizeCSS} ${bgCSS}`}
        onClick={handleButtonClick}
      >
        {content}
      </button>
    </div>
  );
};

export default ButtonComponent;
