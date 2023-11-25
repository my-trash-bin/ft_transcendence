'use client';
import { Button } from '@/components/common/Button';
import FriendAvatar from '@/components/friend/utils/FriendAvatar';
import { ModalLayout } from '../channel/modals/ModalLayout';
import { TextBox } from './TextBox';
import { CardType, HistoryCard } from './history/HistoryCard';
import { mockData } from './history/mockDataHistory';

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
    <div className="p-xl flex flex-col">
      <div className="flex felx-row">
        <FriendAvatar
          src={props.profileImageUrl}
          size={80}
          onClick={{} as () => void}
        />
        <TextBox
          nickname={props.nickname}
          win={props.win}
          lose={props.lose}
          ratio={props.ratio}
          statusMessage={props.statusMessage}
          isModal={true}
        />
      </div>
      <div className="flex flex-col pt-xl">
        {mockData.slice(0, 3).map((data) => (
          <HistoryCard
            key={data.key}
            user1Name={data.user1Name}
            user2Name={data.user2Name}
            user1Avatar={data.user1Avatar}
            user2Avatar={data.user2Avatar}
            user1Score={data.user1Score}
            user2Score={data.user2Score}
            type={CardType.Small}
          />
        ))}
      </div>
      <div className="flex flex-col pt-xl gap-md">
        <div className="flex flex-row gap-3xl justify-center">
          <Button onClick={{} as () => void} isModal={true} disabled={true}>
            친구추가
          </Button>
          <Button onClick={{} as () => void} isModal={true}>
            게임하기
          </Button>
        </div>
        <div className="flex flex-row gap-3xl justify-center">
          <Button onClick={{} as () => void} isModal={true}>
            차단하기
          </Button>
          <Button onClick={{} as () => void} isModal={true}>
            DM
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProfileModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
  nickname,
}) => {
  // parameter: nickname
  // const { loading, error, data } = useQuery(GET_PROFILES);

  // let modalContent: React.ReactNode;
  // if (loading) {
  //   modalContent = <p>loading...</p>;
  // } else if (error) {
  //   modalContent = <p>데이터를 가저오기에 실패했습니다.. ☠️</p>;
  // } else {
  //   modalContent = getModalContent(data.profile[0]);
  // }
  let modalContent = getModalContent({
    nickname: 'nickname',
    profileImageUrl: '/avatar/avatar-black.svg',
    win: 10,
    lose: 10,
    ratio: 1,
    statusMessage: 'statusMessage',
  });

  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="400px"
      height="500px"
    >
      {modalContent}
    </ModalLayout>
  );
};

export default ProfileModal;
