import { ReactNode } from 'react';
import toast from 'react-hot-toast';
import FriendAvatar from './FriendAvatar';

interface CommonCardProps {
  readonly children: ReactNode;
  readonly imageURL: string;
  readonly nickname: string;
}

export function CommonCard({ children, imageURL, nickname }: CommonCardProps) {
  const profile = () => toast(`${nickname} 프로필 모달`);

  const sizeCSS = 'w-[600px] h-[100px]';
  const colorCSS = 'bg-white border-3 border-default rounded-md';
  const alignCSS = 'flex items-center relative';
  return (
    <div className={`${sizeCSS} ${colorCSS} ${alignCSS}`}>
      <button onClick={profile}>
        <FriendAvatar src={imageURL} size={50} />
      </button>
      <div className="text-left text-black text-h2 font-semibold ml-2xl">
        {nickname}
      </div>
      <div className="absolute right-xl flex items-center">{children}</div>
    </div>
  );
}
