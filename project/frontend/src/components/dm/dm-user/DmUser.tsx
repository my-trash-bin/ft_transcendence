import Image from 'next/image';
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
    <button className="w-[340px] h-[100px] relative bg-white border border-default rounded-md mb-[10px] shrink-0">
      <div className="w-[40] h-[60px] absolute top-[20px] left-[15px]">
        <Image
          alt="user image short cut dm"
          src={imageUri}
          width="40"
          height="40"
          layout="relative"
        />
      </div>
      <p className="absolute left-[90px] bottom-[55px] text-[22px]">
        {nickname}
      </p>
      <p className="absolute left-[90px] bottom-[20px] text-[14px]">
        {messageShortcut}
      </p>
      <p className="absolute text-[9px] left-[280px] bottom-[70px]">
        {dateView}
      </p>
    </button>
  );
}
