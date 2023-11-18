import { formatAMPM } from '../utils/FromatAmPm';

export function MyChat({
  content,
  time,
}: Readonly<{ content: string; time: Date }>) {
  const timeAMPM = formatAMPM(time);

  return (
    <div className=" pr-[3%] mb-[1.5%] flex flex-col">
      <p
        className="p-[2%] text-center inline-block max-w-[35%] rounded-[20px]
                break-words bg-white self-end min-w-[10%]"
      >
        {content}
      </p>
      <p className="pr-[1%] text-[11px] self-end">{timeAMPM}</p>
    </div>
  );
}
