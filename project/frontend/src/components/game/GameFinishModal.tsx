'use client';
import Image from 'next/image';
import { ModalLayout } from '../channel/modals/ModalLayout';
import { Button } from '../common/Button';
import useStore from '../pong/Update';

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
  const { isPlayer1, player1Info, player2Info, score1, score2 } = useStore();
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
              src={isPlayer1 ? player2Info.avatarUrl : player1Info.avatarUrl}
              alt="avatar"
              width={100}
              height={100}
            />
            <div className="font-taebaek">
              {isPlayer1 ? player2Info.nickname : player1Info.nickname}
            </div>
            <div className="text-center font-taebaek text-dark-purple">
             {(isPlayer1 && score2 > score1) || (!isPlayer1 && score1 > score2)
              ? '승!!' : '패..ㅠ'}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-center text-[80px] font-taebaek">
              {isPlayer1 ? score2 : score1} : {isPlayer1 ? score1 : score2}
            </div>
          </div>
          <div className={userLayout}>
            <Image
              src={isPlayer1 ? player1Info.avatarUrl : player2Info.avatarUrl}
              alt="avatar"
              width={100}
              height={100}
            />
            <div className="font-taebaek">
              {isPlayer1 ? player1Info.nickname : player2Info.nickname}
            </div>
            <div className="text-center font-taebaek text-dark-purple">
              {(isPlayer1 && score1 > score2) || (!isPlayer1 && score2 > score1)
              ? '승!!' : '패..ㅠ'}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-3xl">
          <Button onClick={handleClose} size={'medium'}>
            닫기
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};
