'use client';
import { GET_PROFILES } from '@/api/profile/ProfileApi';
import FriendAvatar from '@/components/friend/utils/FriendAvatar';
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
  profileImageUrl: string;
  win: number;
  lose: number;
  ratio: number;
  statusMessage: string;
}

const getModalContent = (props: ModalData) => {
  return (
    <div className="flex felx-row">
      <FriendAvatar
        src={props.profileImageUrl}
        size={75}
        onClick={{} as () => void}
      />
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

  // console.log(data);
  let modalContent: React.ReactNode;
  if (loading) {
    modalContent = <p>loading...</p>;
  } else if (error) {
    modalContent = <p>데이터를 가저오기에 실패했습니다.. ☠️</p>;
  } else {
    console.log(data.profile[0].profileImageUrl);

    modalContent = getModalContent(data.profile[0]);
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
