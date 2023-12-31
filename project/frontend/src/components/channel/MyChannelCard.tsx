import Link from 'next/link';
import { formatAMPM } from '../dm/utils/FromatAmPm';
export function MyChannelCard({
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
            <p className="text-h3 text-left">{channelName}</p>
            {messageShortcut ? (
              <p className="text-[12px] text-right ">{dateView}</p>
            ) : (
              ''
            )}
          </div>
          <div className="flex flex-row justify-between items-center">
            {messageShortcut ? (
              <p className="text-[13px] text-left text-slate-500">
                {messageShortcut.length >= 30
                  ? messageShortcut.slice(0, 30) + '...'
                  : messageShortcut}
              </p>
            ) : (
              <p className="text-[13px] text-left text-slate-500">
                대화내용이 없습니다.
              </p>
            )}

            <p className="text-right text-md">{state}</p>
          </div>
        </div>
      </button>
    </Link>
  );
}
