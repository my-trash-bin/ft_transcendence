'use client';
import Image from 'next/image';
import { ModalLayout } from '../channel/modals/ModalLayout';
import { Button } from '../common/Button';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameFinishModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
}) => {
  const handleClose = () => {
    onClose();
  };
  const userLayout = 'flex flex-col justify-center items-center';
  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="600px"
      height="300px"
    >
      <div className="flex flex-col p-xl gap-xl justify-between">
        <div className="flex flex-row justify-between">
          <div className={userLayout}>
            <Image
              src="/avatar/avatar-black.svg"
              alt="avatar"
              width={100}
              height={100}
            />
            <div className="font-taebaek">yoonsele</div>
            <div className="text-center font-taebaek text-dark-purple">
              패.. ㅠ
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-center text-[80px] font-taebaek">2 - 10</div>
          </div>
          <div className={userLayout}>
            <Image
              src="/avatar/avatar-blue.svg"
              alt="avatar"
              width={100}
              height={100}
            />
            <div className="font-taebaek">minkim</div>
            <div className="text-center font-taebaek text-dark-purple">
              승!!
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-3xl">
          <Button onClick={handleClose} size={'medium'}>
            그만하기
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};
