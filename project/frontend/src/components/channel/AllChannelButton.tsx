import Image from 'next/image';

export function AllChannelButton({
  id,
  channelName,
  now,
  max,
  type,
  passwordModalOpen,
  participateModalOpen,
  setSelectedChannel,
}: Readonly<{
  id: string;
  channelName: string;
  now: number;
  max: number;
  type: string;
  passwordModalOpen: (isModalOpen: boolean) => void;
  participateModalOpen: (isModalOpen: boolean) => void;
  setSelectedChannel: (channelId: string) => void;
}>) {
  const state = now + '/' + max;

  const addUserToChannel = () => {
    setSelectedChannel(id);
    if (type === 'public') {
      participateModalOpen(true);
    } else if (type === 'protected') {
      passwordModalOpen(true);
      // if(password)
      //   getSocket().emit('join', { channelId: id, password: password });
    }
  };

  return (
    <>
      <button
        onClick={addUserToChannel}
        className="w-[320px] h-[60px] pl-[15px] pr-[12px]
     bg-white border border-default rounded-md mb-[10px] shrink-0 flex-row flex items-center justify-between"
      >
        <p className="self-center text-dark-gray">{channelName}</p>
        <div className="flex items-center">
          {type === 'protected' ? (
            <Image
              src="/icon/lock.svg"
              width={25}
              height={25}
              alt="lock icon"
            />
          ) : (
            <p className="w-[25]"></p>
          )}
          <p className="text-dark-gray ml-[15px]">{state}</p>
        </div>
      </button>
    </>
  );
}
