import { formatAMPM } from '../dm/utils/FromatAmPm';
export function MyChannelButton({
  channelName,
  messageShortcut,
  date,
  max,
  now,
}: Readonly<{
  channelName: string;
  messageShortcut: string;
  date: Date;
  max: number;
  now: number;
}>) {
  const dateView = formatAMPM(date);
  const state = now + '/' + max;
  return (
    <button className="w-[320px] h-[90px] bg-white border border-default rounded-md shrink-0 p-sm pl-md">
      <div className="flex flex-col h-[100%] justify-between">
        <div className="flex flex-row justify-between items-center">
          <p className="text-[22px] text-left">{channelName}</p>
          <p className="text-[12px] text-right ">{dateView}</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="text-[15px] text-left">{messageShortcut}</p>
          <p className="text-[12px] text-right">{state}</p>
        </div>
      </div>
    </button>
  );
}
