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
    <button className="w-[95%] h-[25%] relative border-b border-default pb-[3px]">
      <div className="w-[7%] h-[7%] absolute top-[30%] left-[5%] bottom-[70%]">
        <Image
          alt="user image short cut dm"
          src={imageUri}
          width="51"
          height="60"
          layout="relative"
        />
      </div>
      <p className="absolute left-[21%] bottom-[50%] text-[22px]">{nickname}</p>
      <p className="absolute left-[21%] bottom-[20%] text-[14px]">
        {messageShortcut}
      </p>
      <p className="absolute text-[9px] left-[85%] bottom-[70%]">{dateView}</p>
    </button>
  );
}
