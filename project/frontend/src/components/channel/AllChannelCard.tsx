import Image from 'next/image';

export function AllChannelCard({
  id,
  channelName,
  now,
  max,
  isPublic,
  passwordModalOpen,
  participateModalOpen,
  setSelectedChannelId,
  setSelectedChannelType,
}: Readonly<{
  id: string;
  channelName: string;
  now: number;
  max: number;
  isPublic: boolean;
  passwordModalOpen: (isModalOpen: boolean) => void;
  participateModalOpen: (isModalOpen: boolean) => void;
  setSelectedChannelId: (channelId: string) => void;
  setSelectedChannelType: (channelType: string) => void;
}>) {
  const state = now + '/' + max;

  const addUserToChannel = () => {
    setSelectedChannelId(id);
    if (isPublic) {
      setSelectedChannelType('public');
      participateModalOpen(true);
    } else {
      setSelectedChannelType('private');
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
     bg-white border border-default rounded-md mb-[10px] shrink-0 flex-row flex items-center justify-between "
      >
        <p className="self-center text-h3">{channelName}</p>
        <div className="flex items-center">
          {!isPublic ? (
            <Image
              src="/icon/lock.svg"
              width={25}
              height={25}
              alt="lock icon"
            />
          ) : (
            ''
          )}
          <p className="text-dark-gray ml-[10px] text-md">{state}</p>
        </div>
      </button>
    </>
  );
}
