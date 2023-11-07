import PropTypes from 'prop-types';
import Modal from 'react-modal';
import './ModalMatch.css';

const MatchingModal = ({ isOpen, onClose, mode }) => {
  if (!isOpen) {
    return null;
  }

  const customStyles = {
    content: {
      width: '50vw',
      height: '35vw',
      top: '35vw',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      backgroundColor: 'transparent',
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      <div className="matching-modal-content">
        <div className="text-center">
          <p>{mode} 매칭이 진행중입니다.</p>
        </div>
        <button className="matching-modal-close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </Modal>
  );
};

MatchingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['normal', 'item']).isRequired,
};

export default MatchingModal;
