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
    <button className="w-[360px] h-[100px] relative bg-light-background rounded-md mb-[10px]">
      <p className="absolute left-[30px] bottom-[50px] text-[22px]">
        {channelName}
      </p>
      <p className="absolute left-[30px] bottom-[10px] text-[14px]">
        {messageShortcut}
      </p>
      <p className="absolute text-[9px] left-[300px] bottom-[65px]">
        {dateView}
      </p>
      <p className="absolute left-[300px] bottom-[10px] text-[15px]">{state}</p>
    </button>
  );
}
