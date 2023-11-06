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
        className="bg-default-interactive text-dark-purple font-bold text-h2 py-sm px-lg rounded-md cursor-pointer mx-md mb-2xl mt-3xl w-xl h-md flex items-center justify-center border border-dark-purple transition-all duration-300 ease-in-out hover:shadow-custom hover:-translate-y-[0.148rem]"
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
