import { formatAMPM } from '../utils/FromatAmPm';

export function MyChat({
  message,
  time,
}: Readonly<{ message: string; time: Date }>) {
  const timeAMPM = formatAMPM(time);

  return (
    <div className=" pr-[3%] mb-[1.5%] flex flex-col">
      <p
        className="p-[2%] text-left inline-block max-w-[200px] rounded-[20px]
                break-words bg-white self-end min-w-[30px]"
      >
        {message}
      </p>
      <p className="pr-[1%] text-[11px] self-end">{timeAMPM}</p>
    </div>
  );
}
