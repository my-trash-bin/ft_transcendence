export function AllChannelButton({
  id,
  channelName,
  now,
  max,
}: Readonly<{
  id: string;
  channelName: string;
  now: number;
  max: number;
}>) {
  const state = now + '/' + max;
  //Todo : on click -> add user to channel
  return (
    <button className="w-[320px] h-[60px] pl-[10px] pr-[10px] relative bg-white border border-default rounded-md mb-[10px] shrink-0 flex justify-between items-center">
      <p>{channelName}</p>
      <p>{state}</p>
    </button>
  );
}
