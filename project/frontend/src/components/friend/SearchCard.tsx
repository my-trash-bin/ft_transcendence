import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '../common/Button';
import { CommonCard } from './utils/CommonCard';

interface SearchCardProps {
  readonly nickname: string;
  readonly imageURL: string;
}

function SearchCard(props: SearchCardProps) {
  const friend = () => toast(`${props.nickname} 친구 하기`);
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
      <Button onClick={friend}>친구 하기</Button>
    </CommonCard>
  );
}
export default SearchCard;
