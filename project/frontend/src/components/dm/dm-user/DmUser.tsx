import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import Image from 'next/image';
import Link from 'next/link';
import { formatAMPM } from '../utils/FromatAmPm';
export function DmUser({
  imageUri,
  nickname,
  messageShortcut,
  date,
}: Readonly<{
  imageUri: string;
  nickname: string;
  messageShortcut: string;
  date: Date;
}>) {
  const dateView = formatAMPM(date);
  return (
    <Link href={`/dm/${nickname}`}>
      <button className="w-[320px] h-[90px] bg-white border border-default rounded-md shrink-0 p-sm">
        <div className="flex flex-row gap-lg h-[100%] justify-between items-center">
          <div className="w-[50px] h-[50px]">
            <Image
              alt="user image short cut dm"
              src={avatarToUrl(imageUri)}
              width={50}
              height={50}
            />
          </div>
          <div className="flex flex-col h-[100%] w-[230px] justify-between">
            <div className="flex flex-row justify-between items-center">
              <p className="text-[22px] text-left  font-semibold">{nickname}</p>
              <p className="text-[12px] text-right ">{dateView}</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-[15px] text-left ">{messageShortcut}</p>
            </div>
          </div>
        </div>
      </button>
    </Link>
  );
}
