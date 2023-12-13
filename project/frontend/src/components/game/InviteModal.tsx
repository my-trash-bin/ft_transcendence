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
  const alignCSS = 'flex flex-col items-center justify-center gap-xl';
  const positionCSS = 'mx-auto';

  const hoverCSS = 'cursor-pointer';
  const buttonCSS =
    'bg-dark-purple-interactive rounded-md text-light-gray-interactive text-h2 w-lg self-end';

  let content = gameMode === 'normal' ? '일반' : '아이템';

  return (
    <ModalLayout
      isOpen={isInviteOpen}
      closeModal={closeInvite}
      width="500px"
      height="300px"
      zValue={30}
      outFocus={true}
    >
      <div className={`${textCSS} ${alignCSS} ${positionCSS} ${size}`}>
        <div className={`flex flex-row gap-md`}>
          <Image
            src="/images/octo-loading.gif"
            width={80}
            height={80}
            alt="loading"
          />
          <p className="text-left">
            {content}모드 게임에서
            <br />
            친구의 응답을 기다리고 있습니다.
          </p>
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
