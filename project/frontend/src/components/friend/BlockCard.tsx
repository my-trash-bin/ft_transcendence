import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CommonCard } from './utils/CommonCard';

interface FriendCardProps {
  readonly nickname: string;
  readonly imageURL: string;
}

function FriendCard(props: FriendCardProps) {
  const unblock = () => toast(`${props.nickname} 차단 해제`);
  useEffect(() => {
    return () => toast.dismiss();
  }, []);
  return (
    <CommonCard imageURL={props.imageURL} nickname={props.nickname}>
      <Toaster
        toastOptions={{
          duration: 2000,
        }}
      />
      <button
        onClick={unblock}
        className={
          'w-md h-xs bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold mr-lg hover:bg-light-background'
        }
      >
        차단 풀기
      </button>
    </CommonCard>
  );
}
export default FriendCard;
