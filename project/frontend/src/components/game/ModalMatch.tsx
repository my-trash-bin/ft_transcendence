import React from 'react';
import Modal from 'react-modal';

interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'normal' | 'item';
}

const MatchingModal: React.FC<MatchingModalProps> = ({ isOpen, onClose, mode }) => {
  if (!isOpen) {
    return null;
  }
  const bgCSS = 'bg-default rounded-md';
  const size = 'py-sm px-lg w-[498px] h-[308px]';
  const borderCSS = 'border-dark-purple border-4';
  const textCSS = 'text-dark-purple text-h2';
  const alignCSS = 'items-center justify-center';
  const positionCSS = 'mx-auto mt-[200px]';

  const hoverCSS = 'cursor-pointer';
  const txtPos = 'text-center mt-[80px]';
  const buttonCSS = 'bg-dark-purple-interactive rounded-md \
  text-light-gray-interactive text-h2 \
  w-lg mt-[65pt] ml-[250pt]';

  let content = mode === 'normal' ? '일반' : '아이템';

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} shouldCloseOnOverlayClick={false} className="bg-transparent">
      <div className={`${textCSS} ${alignCSS} ${positionCSS} ${borderCSS} ${size} ${bgCSS}`}>
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
