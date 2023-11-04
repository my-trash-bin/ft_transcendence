import React, { useState } from 'react';
import MatchingModal from './ModalMatch';

interface ButtonComponentProps {
  mode: 'normal' | 'item';
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  let content = mode === 'normal' ? '일반 게임' : '아이템 게임';

  return (
    <div>
      <button
        className="bg-default text-dark-purple font-bold text-30 p-5.12 rounded-5.12 cursor-pointer mx-10.24 mt-25.6 w-76.8 h-12.8 flex items-center justify-center border border-dark-purple transition-all duration-300 ease-in-out hover:bg-background-hover hover:shadow-custom hover:-translate-y-2.048"
        onClick={handleButtonClick}
      >
        {content}
      </button>
      <MatchingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={mode}
      />
    </div>
  );
};

export default ButtonComponent;
