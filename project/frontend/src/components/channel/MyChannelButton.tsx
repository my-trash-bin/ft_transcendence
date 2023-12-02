import Link from 'next/link';
import { formatAMPM } from '../dm/utils/FromatAmPm';
export function MyChannelButton({
  channelName,
  messageShortcut,
  date,
  max,
  now,
  id,
}: Readonly<{
  channelName: string;
  messageShortcut?: string;
  date?: Date;
  max: number;
  now: number;
  id: string;
}>) {
  const dateView = date ? formatAMPM(date) : '';
  const state = now + '/' + max;
  return (
    <Link href={`/channel/${id}`}>
      <button className="w-[320px] h-[90px] bg-white border border-default rounded-md shrink-0 p-sm pl-md ">
        <div className="flex flex-col h-[100%] justify-between">
          <div className="flex flex-row justify-between items-center">
            <p className="text-[22px] text-left">{channelName}</p>
            {date ? <p className="text-[12px] text-right ">{dateView}</p> : ''}
          </div>
          <div className="flex flex-row justify-between items-center">
            {messageShortcut ? (
              <p className="text-[13px] text-left text-slate-500">
                {messageShortcut}
              </p>
            ) : (
              <p className="text-[13px] text-left text-slate-500">
                대화내용이 없습니다.
              </p>
            )}

            <p className="text-[12px] text-right">{state}</p>
          </div>
        </div>
      </button>
    </Link>
  );
}
