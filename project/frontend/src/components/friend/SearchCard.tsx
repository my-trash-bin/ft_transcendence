import toast, { Toaster } from 'react-hot-toast';
import { CommonCard } from './utils/CommonCard';

interface SearchCardProps {
  readonly nickname: string;
  readonly imageURL: string;
}

function SearchCard(props: SearchCardProps) {
  const friend = () => toast(`${props.nickname} 친구 하기`);
  const buttonClass =
    'w-md h-xs bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold mr-lg hover:bg-light-background';
  return (
    <CommonCard imageURL={props.imageURL} nickname={props.nickname}>
      <Toaster
        toastOptions={{
          duration: 2000,
        }}
      />
      <button onClick={friend} className={buttonClass}>
        친구 하기
      </button>
    </CommonCard>
  );
}
export default SearchCard;
