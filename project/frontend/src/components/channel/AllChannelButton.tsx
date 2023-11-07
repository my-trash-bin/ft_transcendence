export function AllChannelButton({
  channelName,
  now,
  max,
}: {
  channelName: string;
  now: number;
  max: number;
}) {
  const state = now + '/' + max;
  return (
    <button className="w-[320px] h-[60px] pl-[10px] pr-[10px] relative border-b border-default pb-[3px] flex justify-between items-center">
      <p>{channelName}</p>
      <p>{state}</p>
    </button>
  );
}
