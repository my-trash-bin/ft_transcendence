export function AllChannelButton({
  channelName,
  now,
  max,
}: Readonly<{
  channelName: string;
  now: number;
  max: number;
}>) {
  const state = now + '/' + max;
  return (
    <button className="w-[360px] h-[60px] pl-[10px] pr-[10px] relative bg-light-background rounded-md mb-[10px] flex justify-between items-center">
      <p>{channelName}</p>
      <p>{state}</p>
    </button>
  );
}
