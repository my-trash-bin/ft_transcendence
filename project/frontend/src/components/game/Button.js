// Button.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MatchingModal from './MatchingModal';
import './Button.css';

const ButtonComponent = ({ mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  let content;

  if (mode === 'normal') {
    content = 'Normal Mode';
  } else {
    content = 'Item Mode';
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
