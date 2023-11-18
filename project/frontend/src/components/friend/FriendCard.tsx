import Link from 'next/link';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '../common/button';
import FriendSetting from './FriendSetting';
import { CommonCard } from './utils/CommonCard';

interface FriendCardProps {
  readonly nickname: string;
  readonly imageURL: string;
}

function FriendCard(props: FriendCardProps) {
  const game = () => {
    // console.log('게임');
    toast(`${props.nickname} 게임 요청`);
  };
  const buttonClass =
    'w-md h-xs bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold mx-lg hover:bg-light-background';

  // Cleanup toasts when the component unmounts
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
      <Button onClick={game}>게임하기</Button>
      <Link href={'/dm'} className={buttonClass}>
        메세지
      </Link>
      <FriendSetting nickname={props.nickname} />
    </CommonCard>
  );
}
export default FriendCard;
