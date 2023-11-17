'use client';
import { GET_PROFILES } from '@/api/profile/ProfileApi';
import { useQuery } from '@apollo/client';
import { ModalLayout } from '../../channel/modals/ModalLayout';
import { TextBox } from '../TextBox';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
}

interface ModalData {
  nickname: string;
  imageURL: string;
  win: number;
  lose: number;
  ratio: number;
  statusMessage: string;
}

const getModalContent = (props: ModalData) => {
  return (
    <div>
      <p>{`${props.nickname}\'s 프로필!!`}</p>
      {/* <FriendAvatar src={props.imageURL} size={75} onClick={} /> */}
      <TextBox
        nickname={props.nickname}
        win={props.win}
        lose={props.lose}
        ratio={props.ratio}
        statusMessage={props.statusMessage}
      />
    </div>
  );
};

const ProfileModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  nickname,
}) => {
  // parameter: nickname
  const { loading, error, data } = useQuery(GET_PROFILES);

  let modalContent: React.ReactNode;
  if (loading) {
    modalContent = <p>loading...</p>;
  } else if (error) {
    modalContent = <p>데이터를 가저오기에 실패했습니다.. ☠️</p>;
  } else {
    modalContent = getModalContent(data);
  }
  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="350px"
      height="500px"
    >
      {modalContent}
    </ModalLayout>
  );
};

export default ProfileModal;
