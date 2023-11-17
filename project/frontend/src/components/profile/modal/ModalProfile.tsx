import FriendAvatar from '@/components/friend/utils/FriendAvatar';
import React from 'react';
import Modal from 'react-modal';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
  imageURL: string;
}

const ModalProfile: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  nickname,
  imageURL,
}) => {
  if (!isOpen) {
    return null;
  }
  const modalCSS =
    'w-[400px] h-[600px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
  const borderCSS =
    'w-[100%] h-[100%] bg-default rounded-md border-dark-purple border-4';
  const alignCSS = 'flex flex-col items-center justify-center';
  const textCSS = 'text-dark-purple text-h2';
  const buttonCSS =
    'bg-dark-purple-interactive rounded-md text-light-gray-interactive text-h2 cursor-pointer';

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      className={modalCSS}
    >
      <div className={`${borderCSS} ${textCSS} ${alignCSS}`}>
        <p>{`${nickname}\'s 프로필!!`}</p>
        <FriendAvatar src={imageURL} size={75} />
        {/* <TextBox
          nickname={props.nickname}
          win={props.win}
          lose={props.lose}
          ratio={props.ratio}
          statusMessage={props.statusMessage}
        /> */}
        <button className={buttonCSS} onClick={onClose}>
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default ModalProfile;
