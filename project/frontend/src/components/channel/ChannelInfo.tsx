import Image from 'next/image';

export function ChannelInfo() {
  const channelData = {
    channelName: 'channel name',
  };
  return (
    <div className="w-[inherit] h-[80px] border-b border-default relative flex justify-center items-center">
      <h3>{channelData.channelName}</h3>
      <button className="absolute right-[15px] top-[25px] w-[25px] h-[30px]">
        <Image
          alt="message-setting"
          src={'/icon/message-setting.svg'}
          width={35}
          height={50}
          layout="relative"
        ></Image>
      </button>
    </div>
  );
}
