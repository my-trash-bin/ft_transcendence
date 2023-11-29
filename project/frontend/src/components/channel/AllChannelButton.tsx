import { getSocket } from '@/lib/Socket';
import Image from 'next/image';

export function AllChannelButton({
  id,
  channelName,
  now,
  max,
  type,
  setIsModalOpen,
  setSelectedChannel,
}: Readonly<{
  id: string;
  channelName: string;
  now: number;
  max: number;
  type: string;
  setIsModalOpen: (isModalOpen: boolean) => void;
  setSelectedChannel: (channelId: string) => void;
}>) {
  const state = now + '/' + max;

  const addUserToChannel = () => {
    if (type === 'public') getSocket().emit('join', { channelId: id });
    else {
      setIsModalOpen(true);
      setSelectedChannel(id);
      // if(password)
      //   getSocket().emit('join', { channelId: id, password: password });
    }
  };

  return (
    <>
      <button
        onClick={addUserToChannel}
        className="w-[320px] h-[60px] pl-[15px] pr-[12px]
     bg-white border border-default rounded-md mb-[10px] shrink-0 flex justify-between items-center"
      >
        {type === 'protected' ? (
          <Image src="/icon/lock.svg" width={25} height={25} alt="lock icon" />
        ) : (
          <p className="w-[25]"></p>
        )}

        <p className="self-center text-dark-gray">{channelName}</p>
        <p className="text-dark-gray">{state}</p>
      </button>
    </>
  );
}
