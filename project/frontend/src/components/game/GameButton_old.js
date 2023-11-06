import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MatchingModal from './ModalMatch';
import './GameButton.css';

const ButtonComponent = ({ mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  let content;

  if (mode === '일반') {
    content = '일반 게임';
  } else {
    content = '아이템 게임';
  }

  return (
    <div>
      <button className="button" onClick={handleButtonClick}>
        {content}
      </button>
      <MatchingModal isOpen={isModalOpen} onClose={handleModalClose} mode={mode} />
    </div>
  );
};

ButtonComponent.propTypes = {
  mode: PropTypes.oneOf(['normal', 'item']).isRequired,
};

export default ButtonComponent;
