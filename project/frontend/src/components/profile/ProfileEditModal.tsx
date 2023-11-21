'use client';
import Image from 'next/image';
import { ModalLayout } from '../channel/modals/ModalLayout';
import { TextBox } from './TextBox';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
}

interface ModalData {
  readonly profileImageUrl: string;
  readonly nickname: string;
  readonly win: number;
  readonly lose: number;
  readonly ratio: number;
  readonly statusMessage: string;
}

const mockModalData: ModalData = {
  profileImageUrl: '/avatar/avatar-black.svg',
  nickname: 'MockUser123',
  win: 15,
  lose: 5,
  ratio: 3.0, // Assuming a win/lose ratio of 3:1
  statusMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
};

const getModalContent = (props: ModalData) => {
  return (
    <div className="w-[100%] h-[100%] relative">
      <div className="h-[inherit] p-2xl flex flex-row items-center">
        <Image
          src={props.profileImageUrl}
          priority={true}
          alt="avatar"
          width={150}
          height={200}
        />
        <TextBox
          nickname={props.nickname}
          win={props.win}
          lose={props.lose}
          ratio={props.ratio}
          statusMessage={props.statusMessage}
        />
      </div>
    </div>
  );
};

export const ProfileEditModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  nickname,
}) => {
  let modalContent = getModalContent(mockModalData);

  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="600px"
      height="300px"
    >
      {modalContent}
    </ModalLayout>
  );
};
