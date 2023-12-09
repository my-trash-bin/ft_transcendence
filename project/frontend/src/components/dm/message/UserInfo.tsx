import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import { LiveStatus } from '@/components/common/LiveStatus';
import Image from 'next/image';

export function UserInfo({
  imageUri,
  username,
  onActive,
  targetId,
}: Readonly<{
  imageUri: any;
  username: any;
  onActive: boolean;
  targetId: string;
}>) {
  return (
    <div className="h-[80px] w-[95%] border-b border-default relative">
      <div className="w-[45px] h-[50px] absolute left-[30px] top-[20px]">
        <Image
          alt="userImage"
          src={avatarToUrl(imageUri)}
          width={35}
          height={40}
        />
      </div>
      <p className="top-[10px] left-[100px] text-[22px] absolute">
        {username}
        <LiveStatus targetId={targetId} />
      </p>
    </div>
  );
}
