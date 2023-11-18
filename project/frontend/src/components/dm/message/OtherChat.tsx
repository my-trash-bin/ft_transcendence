import Image from 'next/image';
import { formatAMPM } from '../utils/FromatAmPm';

export function OtherChat({
  content,
  time,
  profile,
  isFirst,
  nickname,
}: Readonly<{
  content: string;
  time: Date;
  profile: string;
  isFirst: boolean;
  nickname: string;
}>) {
  const timeAMPM = formatAMPM(time);
  return (
    <div className="flex flex-row pl-[3%] mb-[1.5%]">
      <div className="w-[10%] h-[10%]">
        {isFirst === true ? (
          <Image
            alt="profile"
            src={profile}
            width={40}
            height={40}
            layout="responsive"
          />
        ) : (
          ''
        )}
      </div>
      <div className="flex flex-col w-[80%] pl-[2%]">
        <p
          className={`p-[2%] text-center text-white inline-block max-w-[35%] rounded-[20px]
                break-words bg-chat-color1 self-start min-w-[10%]`}
        >
          {content}
        </p>
        <p className="pl-[1%] text-[11px] self-start">{timeAMPM}</p>
      </div>
    </div>
  );
}
