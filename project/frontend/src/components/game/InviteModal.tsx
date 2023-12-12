import Image from 'next/image';
import { ModalLayout } from '../channel/modals/ModalLayout';
import useFriendInviteStore from '../common/FriendInvite';
import { getGameSocket } from '../pong/gameSocket';

const InviteModal = () => {
  const socket = getGameSocket();
  const { isInviteOpen, gameMode, closeInvite } = useFriendInviteStore();
  const handleModalClose = () => {
    socket.emit('cancelInvite', gameMode);
    console.log('cancelInvite');
    closeInvite();
  };

  const size = 'py-sm px-lg w-[498px] h-[308px]';
  const textCSS = 'text-dark-purple text-h2';
  const alignCSS = 'items-center justify-center';
  const positionCSS = 'mx-auto';

  const hoverCSS = 'cursor-pointer';
  const txtPos = 'text-center mt-[80px]';
  const buttonCSS =
    'bg-dark-purple-interactive rounded-md \
  text-light-gray-interactive text-h2 \
  w-lg mt-[65pt] ml-[250pt]';

  let content = gameMode === 'normal' ? '일반' : '아이템';

  return (
    <ModalLayout
      isOpen={isInviteOpen}
      closeModal={closeInvite}
      width="500px"
      height="300px"
    >
      <div className={`${textCSS} ${alignCSS} ${positionCSS} ${size} z-[20]`}>
        <div className="flex flex-row mt-[80px] items-center justify-center">
          <p className={`${txtPos}`}>
            {content} 게임으로 친구를 초대하였습니다.
          </p>
          <Image
            src="/images/octo-loading.gif"
            width={50}
            height={50}
            alt="loading"
          />
        </div>
        <button
          className={`${buttonCSS} ${hoverCSS}`}
          onClick={handleModalClose}
        >
          닫기
        </button>
      </div>
    </ModalLayout>
  );
};

export default InviteModal;
