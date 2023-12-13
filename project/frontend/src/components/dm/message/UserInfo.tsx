import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import { LiveStatus } from '@/components/common/LiveStatus';
import Image from 'next/image';

export function UserInfo({
  imageUri,
  username,
  targetId,
}: Readonly<{
  imageUri: any;
  username: any;
  onActive: boolean;
  targetId: string;
}>) {
  return (
    <div className="h-[80px] w-[95%] border-b border-default flex flex-row ml-[20px] items-center">
      <div className="w-[50px] h-[50px]">
        <Image
          alt="userImage"
          src={avatarToUrl(imageUri)}
          width={50}
          height={50}
        />
      </div>
      <div className="ml-[20px] self-center">
        <p className="top-[10px] left-[100px] text-[22px]">{username}</p>
        <LiveStatus targetId={targetId} />
      </div>
    </div>
  );
}
